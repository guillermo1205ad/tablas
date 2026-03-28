function ProgressBar({ value, max, label = 'Progreso' }) {
  const safeMax = max || 1;
  const percent = Math.min(100, Math.round((value / safeMax) * 100));

  return (
    <div className="progress-wrap" role="group" aria-label={label}>
      <div className="progress-label-row">
        <span>{label}</span>
        <strong>{percent}%</strong>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
