import NavBar from './NavBar';

function Header({ currentView, onNavigate, progress, globalAccuracy }) {
  return (
    <header className="top-header">
      <div className="header-main">
        <div>
          <h1 className="brand-title">MultiplicaGO</h1>
          <p className="brand-subtitle">Tablas del 1 al 12 con progreso, retos y niveles</p>
        </div>

        <div className="header-stats" aria-label="Resumen de avance">
          <article className="stat-pill">
            <span>Precision</span>
            <strong>{globalAccuracy}%</strong>
          </article>
          <article className="stat-pill">
            <span>Racha max</span>
            <strong>{progress.maxStreak}</strong>
          </article>
          <article className="stat-pill">
            <span>Record</span>
            <strong>{progress.bestScore}</strong>
          </article>
        </div>
      </div>

      <NavBar currentView={currentView} onNavigate={onNavigate} />
    </header>
  );
}

export default Header;
