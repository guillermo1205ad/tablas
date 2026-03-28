function StreakCounter({ streak = 0 }) {
  return (
    <div className="streak-counter" aria-label={`Racha actual: ${streak}`}>
      <span>Racha</span>
      <strong>x{streak}</strong>
    </div>
  );
}

export default StreakCounter;
