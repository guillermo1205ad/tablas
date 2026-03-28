import LivesIndicator from './LivesIndicator';
import StreakCounter from './StreakCounter';

function ScoreBoard({ score, correct, wrong, streak, lives, maxLives, timeLeft }) {
  return (
    <section className="scoreboard card" aria-label="Panel de puntaje">
      <article>
        <span>Puntaje</span>
        <strong>{score}</strong>
      </article>
      <article>
        <span>Aciertos</span>
        <strong>{correct}</strong>
      </article>
      <article>
        <span>Errores</span>
        <strong>{wrong}</strong>
      </article>

      <StreakCounter streak={streak} />

      {typeof timeLeft === 'number' && (
        <article>
          <span>Tiempo</span>
          <strong>{timeLeft}s</strong>
        </article>
      )}

      {typeof lives === 'number' && typeof maxLives === 'number' && (
        <article>
          <span>Vidas</span>
          <LivesIndicator lives={lives} maxLives={maxLives} />
        </article>
      )}
    </section>
  );
}

export default ScoreBoard;
