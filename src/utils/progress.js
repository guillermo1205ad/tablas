import { LEVELS } from '../data/levels';

export const ACHIEVEMENT_LIBRARY = [
  {
    id: 'starter',
    title: 'Primer impulso',
    description: 'Responde 20 ejercicios en total.',
    check: (progress) => progress.totalAnswered >= 20,
  },
  {
    id: 'streak_10',
    title: 'Racha 10',
    description: 'Alcanza una racha maxima de 10 respuestas correctas.',
    check: (progress) => progress.maxStreak >= 10,
  },
  {
    id: 'score_250',
    title: 'Puntaje elite',
    description: 'Consigue al menos 250 puntos en una partida.',
    check: (progress) => progress.bestScore >= 250,
  },
  {
    id: 'level_3',
    title: 'Subida de nivel',
    description: 'Desbloquea el nivel 3 o superior.',
    check: (progress) => progress.levelsUnlocked >= 3,
  },
  {
    id: 'table_master',
    title: 'Maestra de tablas',
    description: 'Domina al menos 6 tablas.',
    check: (progress) => progress.dominatedTables.length >= 6,
  },
  {
    id: 'full_focus',
    title: 'Dominio total',
    description: 'Domina las 12 tablas con buena precision.',
    check: (progress) => progress.dominatedTables.length === 12,
  },
];

function createTableStats() {
  return Object.fromEntries(
    Array.from({ length: 12 }, (_, index) => [
      index + 1,
      {
        attempts: 0,
        correct: 0,
        wrong: 0,
      },
    ]),
  );
}

export function createDefaultProgress() {
  return {
    tableStats: createTableStats(),
    totalAnswered: 0,
    totalCorrect: 0,
    totalWrong: 0,
    maxStreak: 0,
    bestScore: 0,
    modeRecords: {
      practice: 0,
      mix_total: 0,
      timer: 0,
      survival: 0,
      perfect_streak: 0,
      level_challenge: 0,
    },
    levelsUnlocked: 1,
    levelsCompleted: [],
    achievements: [],
    dominatedTables: [],
    pendingTables: Array.from({ length: 12 }, (_, index) => index + 1),
    hardestTables: [],
    mostPracticedTables: [],
    totalStars: 0,
    preferences: {
      hintsEnabled: true,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function getAccuracy(correct, attempts) {
  if (!attempts) {
    return 0;
  }
  return Math.round((correct / attempts) * 100);
}

function rankTables(tableStats, key) {
  return Object.entries(tableStats)
    .map(([table, stats]) => ({ table: Number(table), value: stats[key] }))
    .sort((a, b) => b.value - a.value)
    .filter((entry) => entry.value > 0)
    .slice(0, 3)
    .map((entry) => entry.table);
}

function calculateDominatedTables(tableStats) {
  return Object.entries(tableStats)
    .filter(([, stats]) => stats.attempts >= 10 && getAccuracy(stats.correct, stats.attempts) >= 80)
    .map(([table]) => Number(table));
}

function enrichProgress(progress) {
  const dominatedTables = calculateDominatedTables(progress.tableStats);
  const pendingTables = Array.from({ length: 12 }, (_, index) => index + 1).filter(
    (table) => !dominatedTables.includes(table),
  );

  const enriched = {
    ...progress,
    dominatedTables,
    pendingTables,
    hardestTables: rankTables(progress.tableStats, 'wrong'),
    mostPracticedTables: rankTables(progress.tableStats, 'attempts'),
    updatedAt: new Date().toISOString(),
  };

  const achievements = ACHIEVEMENT_LIBRARY.filter((item) => item.check(enriched)).map(
    (item) => item.id,
  );

  return {
    ...enriched,
    achievements,
  };
}

export function mergeWithDefaults(rawData) {
  const defaults = createDefaultProgress();
  if (!rawData || typeof rawData !== 'object') {
    return defaults;
  }

  const mergedTableStats = {
    ...defaults.tableStats,
    ...(rawData.tableStats || {}),
  };

  const merged = {
    ...defaults,
    ...rawData,
    tableStats: mergedTableStats,
    modeRecords: {
      ...defaults.modeRecords,
      ...(rawData.modeRecords || {}),
    },
    preferences: {
      ...defaults.preferences,
      ...(rawData.preferences || {}),
    },
  };

  return enrichProgress(merged);
}

export function getWeakTableSuggestion(progress) {
  if (!progress.hardestTables.length) {
    return 'Sigue explorando tablas para detectar tu mejor estrategia de estudio.';
  }

  const firstHardTable = progress.hardestTables[0];
  const stats = progress.tableStats[firstHardTable];
  const accuracy = getAccuracy(stats.correct, stats.attempts);

  if (accuracy >= 80) {
    return 'Tu rendimiento va muy bien. Puedes intentar un modo mas desafiante.';
  }

  return `Te conviene reforzar la tabla del ${firstHardTable} con sesiones cortas de practica guiada.`;
}

export function applySessionToProgress(currentProgress, session) {
  const progress = mergeWithDefaults(currentProgress);
  const next = {
    ...progress,
    tableStats: {
      ...progress.tableStats,
    },
  };

  const answers = session.answers || [];

  answers.forEach((item) => {
    const table = Number(item.table);
    if (!next.tableStats[table]) {
      return;
    }

    const tableStats = {
      ...next.tableStats[table],
      attempts: next.tableStats[table].attempts + 1,
      correct: next.tableStats[table].correct + (item.correct ? 1 : 0),
      wrong: next.tableStats[table].wrong + (item.correct ? 0 : 1),
    };

    next.tableStats[table] = tableStats;
  });

  const totalCorrect = answers.filter((item) => item.correct).length;
  const totalWrong = answers.length - totalCorrect;

  next.totalAnswered += answers.length;
  next.totalCorrect += totalCorrect;
  next.totalWrong += totalWrong;
  next.maxStreak = Math.max(next.maxStreak, session.maxStreak || 0);
  next.bestScore = Math.max(next.bestScore, session.score || 0);
  next.totalStars += session.stars || 0;

  if (session.mode && Object.prototype.hasOwnProperty.call(next.modeRecords, session.mode)) {
    next.modeRecords[session.mode] = Math.max(next.modeRecords[session.mode], session.score || 0);
  }

  if (session.levelId && session.levelPassed) {
    if (!next.levelsCompleted.includes(session.levelId)) {
      next.levelsCompleted = [...next.levelsCompleted, session.levelId].sort((a, b) => a - b);
    }

    const nextUnlock = Math.min(session.levelId + 1, LEVELS.length);
    next.levelsUnlocked = Math.max(next.levelsUnlocked, nextUnlock);
  }

  return enrichProgress(next);
}

export function resolveAchievements(progress) {
  const unlocked = new Set(progress.achievements);
  return ACHIEVEMENT_LIBRARY.map((item) => ({
    ...item,
    unlocked: unlocked.has(item.id),
  }));
}
