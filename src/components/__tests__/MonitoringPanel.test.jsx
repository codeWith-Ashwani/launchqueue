import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import MonitoringPanel from '../MonitoringPanel';
import { getMonitoring, getTrace, getTraces } from '../../api/resources';

vi.mock('../../api/resources', () => ({ getMonitoring: vi.fn(), getTrace: vi.fn(), getTraces: vi.fn() }));
beforeEach(() => {
  vi.resetAllMocks();
  getMonitoring.mockResolvedValue({ data: { storage: { enabled: true, pendingBatches: 0, droppedObservations: 0 }, objectives: { minimumObservations: 20 }, series: [
    { name: 'http', label: 'GET /api/waitlists/:id/stats', count: 25, status: 'breached', goodRate: .8, targetGoodRate: .95, threshold: 2000, p95UpperBound: 5000, availability: .96 },
  ] } });
  getTraces.mockResolvedValue({ data: { traces: [{ spanId: 'span', traceId: 'trace', name: 'GET /api/waitlists/:id/stats', durationMs: 2200, status: 2, startedAt: '2026-10-05T10:00:00Z' }] } });
  getTrace.mockResolvedValue({ data: { traceId: 'trace', spans: [{ spanId: 'child', name: 'analytics.ranking', serviceName: 'launchqueue-api', durationMs: 2100, status: 2 }], truncated: false } });
});
it('shows objective breaches and correlated operations, and loads the selected window', async () => {
  const user = userEvent.setup();
  render(<MonitoringPanel />);
  expect(await screen.findByText('Needs attention')).toBeInTheDocument();
  expect(screen.getByText('96.0%')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /2200 ms/ }));
  expect(await screen.findByText(/analytics.ranking/)).toBeInTheDocument();
  await user.selectOptions(screen.getByRole('combobox', { name: 'Window' }), '1');
  await waitFor(() => expect(getMonitoring).toHaveBeenLastCalledWith(1, expect.objectContaining({ signal: expect.any(AbortSignal) })));
});
it('keeps failed requests recoverable and reports empty windows', async () => {
  const user = userEvent.setup();
  getMonitoring.mockRejectedValueOnce(new Error('offline'));
  render(<MonitoringPanel />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Try refreshing');
  getMonitoring.mockResolvedValue({ data: { storage: { enabled: true, pendingBatches: 0, droppedObservations: 0 }, objectives: { minimumObservations: 20 }, series: [] } });
  getTraces.mockResolvedValue({ data: { traces: [] } });
  await user.click(screen.getByRole('button', { name: 'Refresh health' }));
  expect(await screen.findByText('No observations in this window yet.')).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
