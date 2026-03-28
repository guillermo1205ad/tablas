import LevelMap from '../components/LevelMap';

function LevelsPage({ progress, onStartLevel, onNavigate }) {
  return (
    <section className="levels-page">
      <header className="section-heading card">
        <h2>Niveles y progreso</h2>
        <p>
          Avanza desde tablas base hasta mezcla total. Cada nivel desbloquea el siguiente cuando lo
          superas.
        </p>
      </header>

      <section className="card levels-summary">
        <article>
          <span>Nivel desbloqueado</span>
          <strong>{progress.levelsUnlocked}</strong>
        </article>
        <article>
          <span>Niveles completados</span>
          <strong>{progress.levelsCompleted.length}</strong>
        </article>
        <article>
          <span>Tablas dominadas</span>
          <strong>{progress.dominatedTables.length}/12</strong>
        </article>
      </section>

      <LevelMap
        levelsUnlocked={progress.levelsUnlocked}
        levelsCompleted={progress.levelsCompleted}
        onStartLevel={onStartLevel}
      />

      <div className="section-actions">
        <button type="button" className="btn btn-soft" onClick={() => onNavigate('progress')}>
          Ver tablero de progreso
        </button>
      </div>
    </section>
  );
}

export default LevelsPage;
