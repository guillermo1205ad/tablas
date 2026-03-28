function LivesIndicator({ lives = 0, maxLives = 3 }) {
  return (
    <div className="lives-indicator" aria-label={`Vidas disponibles: ${lives}`}>
      {Array.from({ length: maxLives }, (_, index) => {
        const alive = index < lives;
        return (
          <span key={index} className={`life-dot ${alive ? 'alive' : 'lost'}`}>
            ●
          </span>
        );
      })}
    </div>
  );
}

export default LivesIndicator;
