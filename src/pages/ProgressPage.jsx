import ProgressDashboard from '../components/ProgressDashboard';
import { getWeakTableSuggestion, resolveAchievements } from '../utils/progress';

function ProgressPage({ progress, onResetProgress }) {
  const achievements = resolveAchievements(progress);
  const suggestion = getWeakTableSuggestion(progress);

  const handleReset = () => {
    const confirmed = window.confirm(
      'Se reiniciara el progreso local (puntajes, rachas y niveles). Deseas continuar?',
    );

    if (confirmed) {
      onResetProgress();
    }
  };

  return (
    <section className="progress-page">
      <header className="section-heading card">
        <h2>Panel de progreso</h2>
        <p>
          Revisa tablas dominadas, porcentaje de aciertos, record personal, niveles completados e
          insignias desbloqueadas.
        </p>
      </header>

      <ProgressDashboard
        progress={progress}
        achievements={achievements}
        suggestion={suggestion}
        onResetProgress={handleReset}
      />
    </section>
  );
}

export default ProgressPage;
