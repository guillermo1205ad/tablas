const ITEMS = [
  { id: 'home', label: 'Inicio' },
  { id: 'learn', label: 'Aprender' },
  { id: 'practice', label: 'Practicar' },
  { id: 'game', label: 'Juego' },
  { id: 'levels', label: 'Niveles' },
  { id: 'progress', label: 'Progreso' },
];

function NavBar({ currentView, onNavigate }) {
  return (
    <nav className="top-nav" aria-label="Navegacion principal">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`nav-btn ${currentView === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

export default NavBar;
