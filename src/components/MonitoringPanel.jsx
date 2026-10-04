import { useEffect, useState } from 'react';
import { getMonitoring, getTrace, getTraces } from '../api/resources';

const percent = (value) => `${(value * 100).toFixed(1)}%`;
const measure = (value, name) => value === null ? 'Above range' : `${Number(value.toFixed(2))}${name === 'CLS' ? '' : ' ms'}`;

export default function MonitoringPanel() {
  const [hours, setHours] = useState(24);
  const [revision, setRevision] = useState(0);
  const [report, setReport] = useState(null);
  const [traces, setTraces] = useState([]);
  const [detail, setDetail] = useState(null);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError('');
    Promise.all([getMonitoring(hours, { signal: controller.signal }), getTraces(hours, { signal: controller.signal })])
      .then(([metrics, recent]) => { if (active) { setReport(metrics.data); setTraces(recent.data.traces); } })
      .catch(() => { if (active) setError('Monitoring could not load. Try refreshing.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [hours, revision]);
  useEffect(() => {
    if (!selected) return;
    let active = true;
    const controller = new AbortController();
    setDetail(null);
    getTrace(selected, { signal: controller.signal })
      .then(({ data }) => { if (active) setDetail(data); })
      .catch(() => { if (active) setError('This trace could not load.'); });
    return () => { active = false; controller.abort(); };
  }, [selected]);
  return <div className="monitoring-panel">
    <div className="admin-toolbar">
      <div><h2>Service health</h2><p>Stored observations and sampled traces · seven day retention.</p></div>
      <div className="admin-row-actions">
        <label>Window <select className="lq-input" value={hours} onChange={(event) => setHours(Number(event.target.value))}>
          <option value={1}>Last hour</option><option value={24}>Last 24 hours</option>
        </select></label>
        <button className="lq-btn lq-btn-secondary" disabled={loading} onClick={() => setRevision((value) => value + 1)}>Refresh health</button>
      </div>
    </div>
    {error && <p role="alert" className="lq-msg-error">{error}</p>}
    {loading && <p role="status">Loading health observations…</p>}
    {report && <>
      <p className="monitoring-note">{report.storage.enabled ? 'Collection enabled' : 'Collection disabled'} · {report.storage.pendingBatches} batches awaiting storage · {report.storage.droppedObservations} dropped observations.
        Objectives need at least {report.objectives.minimumObservations} observations. HTTP availability covers observed requests; browser metrics include sampled updates.</p>
      {!report.series.length ? <p>No observations in this window yet.</p> : <div className="admin-table-scroll" role="region" aria-label="Service health observations" tabIndex={0}>
        <table className="lq-table"><caption className="sr-only">Latency and browser responsiveness objectives</caption>
          <thead><tr>{['Signal', 'State', 'Observations', 'Within budget', 'P95 upper bound', 'Availability'].map((label) => <th key={label} scope="col">{label}</th>)}</tr></thead>
          <tbody>{report.series.map((row) => <tr key={`${row.name} ${row.label}`}>
            <td><strong>{row.name}</strong><span>{row.label}</span></td>
            <td><span className={`monitoring-state monitoring-${row.status}`}>{row.status === 'warming' ? 'Gathering data' : row.status === 'met' ? 'Meeting objective' : 'Needs attention'}</span></td>
            <td>{row.count.toLocaleString()}</td><td>{percent(row.goodRate)}<span>Target {percent(row.targetGoodRate)} ≤ {measure(row.threshold, row.name)}</span></td>
            <td>{measure(row.p95UpperBound, row.name)}</td><td>{row.availability === null ? '—' : percent(row.availability)}</td>
          </tr>)}</tbody>
        </table>
      </div>}
      <p className="monitoring-note">Percentiles are histogram upper bounds. These observations describe recorded traffic, including Render cold starts; they do not measure external uptime.</p>
    </>}
    <h3>Recent sampled requests</h3>
    {!traces.length && !loading ? <p>No stored traces in this window yet.</p> : <ul className="monitoring-traces">{traces.map((item) => <li key={item.spanId}>
      <button className="platform-text-button" aria-pressed={selected === item.traceId} onClick={() => { setError(''); setSelected(item.traceId); }}>
        {item.name} · {measure(item.durationMs, 'http')} · {item.status === 2 ? 'Error' : 'Completed'}
      </button><span>{new Date(item.startedAt).toLocaleString()}</span>
    </li>)}</ul>}
    {selected && !detail && !error && <p role="status">Loading trace…</p>}
    {detail && <div className="monitoring-detail"><h4>Request operations</h4><code>{detail.traceId}</code>
      <ul>{detail.spans.map((span) => <li key={span.spanId}>{span.name} · {span.serviceName} · {measure(span.durationMs, 'http')} · {span.status === 2 ? 'Error' : 'Completed'}</li>)}</ul>
      {detail.truncated && <p>Showing the first 100 spans.</p>}
    </div>}
  </div>;
}
