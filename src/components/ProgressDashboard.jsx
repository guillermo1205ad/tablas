import AchievementBadge from './AchievementBadge';

function TablePerformanceItem({ table, stats }) {
  const accuracy = stats.attempts ? Math.round((stats.correct / stats.attempts) * 100) : 0;

  return (
    <article className="table-performance-item">
      <header>
        <strong>Tabla {table}</strong>
        <span>{accuracy}%</span>
      </header>
      <div className="tiny-bar" aria-hidden="true">
        <span style={{ width: `${accuracy}%` }} />
      </div>
      <small>
        {stats.correct} aciertos · {stats.wrong} errores
      </small>
    </article>
  );
}

function ProgressDashboard({ progress, achievements, suggestion, onResetProgress }) {
  const totalAccuracy = progress.totalAnswered
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : 0;

  return (
    <section className="progress-dashboard">
      <div className="metric-grid">
        <article className="card metric-card">
          <span>Precision global</span>
          <strong>{totalAccuracy}%</strong>
        </article>
        <article className="card metric-card">
          <span>Record de puntaje</span>
          <strong>{progress.bestScore}</strong>
        </article>
        <article className="card metric-card">
          <span>Racha maxima</span>
          <strong>{progress.maxStreak}</strong>
        </article>
        <article className="card metric-card">
          <span>Niveles completados</span>
          <strong>{progress.levelsCompleted.length}</strong>
        </article>
      </div>

      <section className="card">
        <h3>Estado por tabla</h3>
        <p>{suggestion}</p>
        <div className="table-performance-grid">
          {Object.entries(progress.tableStats).map(([table, stats]) => (
            <TablePerformanceItem key={table} table={table} stats={stats} />
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Insignias</h3>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>

      <section className="card list-cards">
        <article>
          <h4>Tablas dominadas</h4>
          <p>
            {progress.dominatedTables.length
              ? progress.dominatedTables.join(', ')
              : 'Aun no hay tablas dominadas. Sigue practicando.'}
          </p>
        </article>
        <article>
          <h4>Tablas pendientes</h4>
          <p>{progress.pendingTables.join(', ')}</p>
        </article>
        <article>
          <h4>Tablas con mas errores</h4>
          <p>
            {progress.hardestTables.length
              ? progress.hardestTables.join(', ')
              : 'Todavia no hay suficientes intentos para detectar una tabla dificil.'}
          </p>
        </article>
      </section>

      <button type="button" className="btn btn-danger" onClick={onResetProgress}>
        Reiniciar progreso local
      </button>
    </section>
  );
}

export default ProgressDashboard;
