function AchievementBadge({ achievement }) {
  return (
    <article className={`achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
      <h4>{achievement.title}</h4>
      <p>{achievement.description}</p>
      <span>{achievement.unlocked ? 'Desbloqueada' : 'Bloqueada'}</span>
    </article>
  );
}

export default AchievementBadge;
