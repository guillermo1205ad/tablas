import MotivationalMessage from './MotivationalMessage';

function ResultsModal({
  open,
  title,
  stats,
  summary,
  primaryActionLabel = 'Jugar otra vez',
  onPrimaryAction,
  onSecondaryAction,
  secondaryActionLabel = 'Cerrar',
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="results-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <article className="results-modal card">
        <h3>{title}</h3>
        <p>{summary}</p>

        <div className="results-grid">
          <article>
            <span>Puntaje</span>
            <strong>{stats.score}</strong>
          </article>
          <article>
            <span>Aciertos</span>
            <strong>{stats.correct}</strong>
          </article>
          <article>
            <span>Errores</span>
            <strong>{stats.wrong}</strong>
          </article>
          <article>
            <span>Precision</span>
            <strong>{stats.accuracy}%</strong>
          </article>
          <article>
            <span>Racha maxima</span>
            <strong>{stats.maxStreak}</strong>
          </article>
          <article>
            <span>Estrellas</span>
            <strong>{stats.stars}</strong>
          </article>
        </div>

        <MotivationalMessage tone={stats.accuracy >= 70 ? 'success' : 'recovery'} />

        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onPrimaryAction}>
            {primaryActionLabel}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </button>
        </div>
      </article>
    </div>
  );
}

export default ResultsModal;
