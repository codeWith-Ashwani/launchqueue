const fixedRoutes = new Set(['/', '/login', '/register', '/forgot-password', '/reset-password', '/dashboard', '/dashboard/new', '/profile', '/pricing', '/admin', '/admin/login'])
export function routeTemplate(pathname) {
  if (fixedRoutes.has(pathname)) return pathname
  if (/^\/dashboard\/[^/]+\/settings\/?$/.test(pathname)) return '/dashboard/:id/settings'
  if (/^\/dashboard\/[^/]+\/?$/.test(pathname)) return '/dashboard/:id'
  if (/^\/w\/[^/]+\/welcome\/?$/.test(pathname)) return '/w/:slug/welcome'
  if (/^\/w\/[^/]+\/?$/.test(pathname)) return '/w/:slug'
  return 'unmatched'
}

// Core Web Vitals describe the document, so retain its initial route across SPA navigation.
export async function startVitals({ sampleRate = Number(import.meta.env.VITE_PERFORMANCE_SAMPLE_RATE ?? (import.meta.env.PROD ? 0.1 : 1)),
  apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api', random = Math.random,
  loadVitals = () => import('web-vitals') } = {}) {
  if (!Number.isFinite(sampleRate) || sampleRate <= 0 || sampleRate > 1 || random() >= sampleRate) return
  const route = routeTemplate(window.location.pathname)
  const pending = new Map()
  const endpoint = `${apiUrl.replace(/\/$/, '')}/telemetry/vitals`
  let stopped = false
  let exiting = false
  let flushQueued = false
  const flush = () => {
    if (stopped || !pending.size) return
    const payload = JSON.stringify({ metrics: [...pending.values()] })
    pending.clear()
    // text/plain keeps this small beacon free of CORS preflights and auth headers.
    try {
      if (navigator.sendBeacon?.(endpoint, new Blob([payload], { type: 'text/plain' }))) return
    } catch { /* Performance reporting must never interrupt the page. */ }
    try { void fetch(endpoint, { method: 'POST', credentials: 'omit', keepalive: true,
      headers: { 'Content-Type': 'text/plain' }, body: payload }).catch(() => {}) } catch { /* Offline or shutting down. */ }
  }
  const scheduleFlush = () => {
    if (flushQueued) return
    flushQueued = true
    queueMicrotask(() => { flushQueued = false; flush() })
  }
  const report = ({ name, value }) => {
    if (!stopped && ['LCP', 'INP', 'CLS'].includes(name) && Number.isFinite(value) && value >= 0 && value <= 3600000) {
      pending.set(name, { name, value, route })
      // The library may finalize a metric after our visibility callback.
      if (exiting || document.visibilityState === 'hidden') scheduleFlush()
    }
  }
  try {
    const { onCLS, onINP, onLCP } = await loadVitals()
    onCLS(report); onINP(report); onLCP(report)
  } catch { return }
  // Run after the library's visibility handlers have finalized their measurements.
  const onHidden = () => { exiting = document.visibilityState === 'hidden'; if (exiting) scheduleFlush() }
  const onPageHide = () => { exiting = true; scheduleFlush() }
  document.addEventListener('visibilitychange', onHidden)
  window.addEventListener('pagehide', onPageHide)
  const timer = setInterval(flush, 15000)
  return () => {
    flush(); stopped = true; clearInterval(timer)
    document.removeEventListener('visibilitychange', onHidden)
    window.removeEventListener('pagehide', onPageHide)
  }
}
