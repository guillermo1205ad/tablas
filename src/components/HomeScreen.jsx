import { useState } from 'react';
import MotivationalMessage from './MotivationalMessage';

const QUICK_MODES = [
  {
    id: 'learn',
    title: 'Modo Aprender',
    description: 'Explora tabla por tabla con patrones y tips de memoria.',
  },
  {
    id: 'practice',
    title: 'Practica Guiada',
    description: 'Entrena una tabla especifica con feedback instantaneo.',
  },
  {
    id: 'mix_total',
    title: 'Mezcla Total',
    description: 'Resuelve preguntas aleatorias de todas las tablas.',
  },
  {
    id: 'timer',
    title: 'Contrarreloj',
    description: 'Consigue el mayor puntaje antes de que termine el tiempo.',
  },
  {
    id: 'survival',
    title: 'Supervivencia',
    description: 'Cuida tus vidas y avanza todo lo que puedas.',
  },
  {
    id: 'perfect_streak',
    title: 'Racha Perfecta',
    description: 'Encadena aciertos sin fallar para batir tu marca.',
  },
];

function HomeScreen({ onNavigate, onQuickMode, progress }) {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <section className="hero-screen">
      <div className="hero-content card gradient-card">
        <p className="hero-kicker">Aprender + juego + constancia</p>
        <h2>Domina las tablas y sube de nivel en cada sesion</h2>
        <p>
          Disenada para estudiar de forma entretenida: practica corta, refuerzo positivo y avance
          real desde la tabla del 1 hasta la del 12.
        </p>

        <div className="hero-actions">
          <button type="button" className="btn btn-primary" onClick={() => onNavigate('learn')}>
            Comenzar
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setShowGuide((prev) => !prev)}>
            Como jugar
          </button>
          <button type="button" className="btn btn-soft" onClick={() => onNavigate('progress')}>
            Ver progreso
          </button>
        </div>

        {showGuide && (
          <div className="guide-box">
            <h3>Flujo recomendado</h3>
            <ol>
              <li>Aprender una tabla y observar sus patrones.</li>
              <li>Practicar esa tabla con preguntas variadas.</li>
              <li>Pasar a un modo de juego para consolidar velocidad.</li>
            </ol>
            <p>
              Si una tabla cuesta, vuelve a Practica Guiada. Si aciertas seguido, intenta Niveles.
            </p>
          </div>
        )}
      </div>

      <div className="home-grid">
        <section className="card">
          <h3>Accesos rapidos</h3>
          <div className="mode-grid">
            {QUICK_MODES.map((mode) => (
              <article key={mode.id} className="mode-card">
                <h4>{mode.title}</h4>
                <p>{mode.description}</p>
                <button type="button" className="btn btn-inline" onClick={() => onQuickMode(mode.id)}>
                  Ir a este modo
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <h3>Tu estado actual</h3>
          <div className="mini-metrics">
            <article>
              <span>Preguntas respondidas</span>
              <strong>{progress.totalAnswered}</strong>
            </article>
            <article>
              <span>Niveles completados</span>
              <strong>{progress.levelsCompleted.length}</strong>
            </article>
            <article>
              <span>Tablas dominadas</span>
              <strong>{progress.dominatedTables.length}/12</strong>
            </article>
          </div>
          <MotivationalMessage tone="neutral" />
        </section>
      </div>
    </section>
  );
}

export default HomeScreen;
