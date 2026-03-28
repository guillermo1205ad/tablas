import { LEVELS } from '../data/levels';

function LevelMap({ levelsUnlocked, levelsCompleted, onStartLevel }) {
  return (
    <section className="level-map">
      {LEVELS.map((level) => {
        const unlocked = level.id <= levelsUnlocked;
        const completed = levelsCompleted.includes(level.id);

        return (
          <article
            key={level.id}
            className={`level-card card ${unlocked ? 'open' : 'locked'} ${completed ? 'done' : ''}`}
          >
            <header>
              <p>{level.title}</p>
              <h3>{level.subtitle}</h3>
            </header>

            <p>{level.description}</p>

            <div className="level-tables">
              {level.tables.map((table) => (
                <span key={table}>x{table}</span>
              ))}
            </div>

            <p className="level-target">Meta de precision: {level.targetAccuracy}%</p>

            {unlocked ? (
              <button type="button" className="btn btn-primary" onClick={() => onStartLevel(level.id)}>
                {completed ? 'Repetir nivel' : 'Jugar nivel'}
              </button>
            ) : (
              <button type="button" className="btn btn-disabled" disabled>
                Bloqueado
              </button>
            )}
          </article>
        );
      })}
    </section>
  );
}

export default LevelMap;
