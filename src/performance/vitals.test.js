import { afterEach, describe, expect, it, vi } from 'vitest'
import { routeTemplate, startVitals } from './vitals'

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); window.history.replaceState({}, '', '/') })
describe('privacy-preserving performance reporting', () => {
  it('normalizes private resource paths and never sends query strings', () => {
    expect(routeTemplate('/w/private-product')).toBe('/w/:slug')
    expect(routeTemplate('/dashboard/123/settings')).toBe('/dashboard/:id/settings')
    expect(routeTemplate('/unknown/email@example.com')).toBe('unmatched')
  })
  it('does not load the library or report when sampling is disabled', async () => {
    const loadVitals = vi.fn()
    await startVitals({ sampleRate: 0, loadVitals })
    await startVitals({ sampleRate: 0.1, random: () => 0.5, loadVitals })
    expect(loadVitals).not.toHaveBeenCalled()
  })
  it('batches only three allowed measurements and keeps the initial route across navigation', async () => {
    window.history.replaceState({}, '', '/w/secret-product?token=private')
    const report = {}
    const sendBeacon = vi.fn(() => true)
    Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: sendBeacon })
    const stop = await startVitals({ sampleRate: 1, loadVitals: async () => Object.fromEntries(['CLS', 'INP', 'LCP'].map((name) => [`on${name}`, (handler) => { report[name] = handler }])) })
    try {
      window.history.replaceState({}, '', '/profile')
      report.LCP({ name: 'LCP', value: 800, id: 'private-id', entries: [{ name: 'private-url' }] })
      report.INP({ name: 'INP', value: 30 })
      report.CLS({ name: 'CLS', value: 0.02 })
      report.CLS({ name: 'CLS', value: 0.03 })
      report.CLS({ name: 'UNKNOWN', value: 123 })
      report.CLS({ name: 'CLS', value: Infinity })
      window.dispatchEvent(new Event('pagehide'))
      await Promise.resolve()
      expect(sendBeacon).toHaveBeenCalledTimes(1)
      const blob = sendBeacon.mock.calls[0][1]
      // jsdom's Blob exposes data through FileReader.
      const text = await new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsText(blob) })
      expect(JSON.parse(text).metrics).toHaveLength(3)
      expect(JSON.parse(text).metrics.every((metric) => metric.route === '/w/:slug')).toBe(true)
      expect(text).not.toMatch(/secret|token|private|entries/)
      expect(JSON.parse(text).metrics.find((metric) => metric.name === 'CLS').value).toBe(0.03)
    } finally { stop() }
  })
  it('drops failed delivery without blocking the page or resending forever', async () => {
    Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: () => false })
    const request = vi.fn(() => Promise.reject(new Error('offline')))
    vi.stubGlobal('fetch', request)
    const stop = await startVitals({ sampleRate: 1, loadVitals: async () => ({ onCLS: (cb) => cb({ name: 'CLS', value: 0 }), onINP: () => {}, onLCP: () => {} }) })
    stop()
    await Promise.resolve()
    expect(request).toHaveBeenCalledTimes(1)
    expect(request.mock.calls[0][1]).toMatchObject({ credentials: 'omit', headers: { 'Content-Type': 'text/plain' } })
  })
  it('flushes a metric finalized after the pagehide handler has run', async () => {
    let report
    const sendBeacon = vi.fn(() => true)
    Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: sendBeacon })
    const stop = await startVitals({ sampleRate: 1, loadVitals: async () => ({ onCLS: (cb) => { report = cb }, onINP: () => {}, onLCP: () => {} }) })
    try {
      window.dispatchEvent(new Event('pagehide'))
      await Promise.resolve()
      expect(sendBeacon).not.toHaveBeenCalled()
      report({ name: 'CLS', value: 0.03 })
      await Promise.resolve()
      expect(sendBeacon).toHaveBeenCalledTimes(1)
    } finally { stop() }
  })
})
