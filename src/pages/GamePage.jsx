import { useEffect, useMemo, useRef, useState } from 'react';
import MotivationalMessage from '../components/MotivationalMessage';
import PracticePanel from '../components/PracticePanel';
import ProgressBar from '../components/ProgressBar';
import ResultsModal from '../components/ResultsModal';
import ScoreBoard from '../components/ScoreBoard';
import { MESSAGES, pickRandomMessage } from '../data/messages';
import { ALL_TABLE_NUMBERS } from '../data/tables';
import { generateQuestion, validateAnswer } from '../utils/questions';

const BASE_MODES = {
  mix_total: {
    id: 'mix_total',
    title: 'Modo Mezcla Total',
    description: 'Preguntas aleatorias de todas las tablas para consolidar memoria global.',
    tables: ALL_TABLE_NUMBERS,
    goalQuestions: 18,
    maxLives: null,
    timeLimit: null,
    targetStreak: null,
  },
  timer: {
    id: 'timer',
    title: 'Modo Contrarreloj',
    description: 'Responde la mayor cantidad posible antes de que termine el tiempo.',
    tables: ALL_TABLE_NUMBERS,
    goalQuestions: null,
    maxLives: null,
    timeLimit: 60,
    targetStreak: null,
  },
  survival: {
    id: 'survival',
    title: 'Modo Supervivencia',
    description: 'Tienes vidas limitadas. Cada error te acerca al final.',
    tables: ALL_TABLE_NUMBERS,
    goalQuestions: 24,
    maxLives: 3,
    timeLimit: null,
    targetStreak: null,
  },
  perfect_streak: {
    id: 'perfect_streak',
    title: 'Modo Racha Perfecta',
    description: 'Encadena respuestas correctas. Un fallo corta la partida.',
    tables: ALL_TABLE_NUMBERS,
    goalQuestions: null,
    maxLives: 1,
    timeLimit: null,
    targetStreak: 15,
  },
};

const GAME_TYPES = ['open', 'multiple_choice', 'true_false', 'missing_factor', 'choose_result', 'match_pair'];
const TIMER_TYPES = [...GAME_TYPES, 'quick_challenge', 'complete_result'];

function createEmptyGameStats(initialLives = null) {
  return {
    score: 0,
    correct: 0,
    wrong: 0,
    asked: 0,
    streak: 0,
    maxStreak: 0,
    lives: initialLives,
    answers: [],
  };
}

function calculateStars(accuracy) {
  if (accuracy >= 90) {
    return 3;
  }
  if (accuracy >= 75) {
    return 2;
  }
  if (accuracy >= 60) {
    return 1;
  }
  return 0;
}

function deriveDifficulty(stats) {
  if (stats.asked < 3) {
    return 1;
  }

  const accuracy = stats.correct / Math.max(stats.asked, 1);
  if (accuracy >= 0.9 && stats.streak >= 3) {
    return 4;
  }
  if (accuracy >= 0.78) {
    return 3;
  }
  if (accuracy <= 0.55) {
    return 2;
  }
  return 3;
}

function GamePage({
  progress,
  presetMode = 'mix_total',
  levelChallenge,
  onSessionComplete,
  onClearLevelChallenge,
  onNavigate,
}) {
  const [selectedMode, setSelectedMode] = useState(presetMode);
  const [phase, setPhase] = useState('select');
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [pendingFinish, setPendingFinish] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [stats, setStats] = useState(createEmptyGameStats());
  const [result, setResult] = useState(null);
  const [reported, setReported] = useState(false);

  const statsRef = useRef(stats);
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    setSelectedMode(presetMode);
  }, [presetMode]);

  const availableModes = useMemo(() => {
    const base = Object.values(BASE_MODES);

    if (levelChallenge) {
      return [
        {
          id: 'level_challenge',
          title: `Desafio ${levelChallenge.title}`,
          description: `Tablas ${levelChallenge.tables.join(', ')} · meta ${levelChallenge.targetAccuracy}%`,
          tables: levelChallenge.tables,
          goalQuestions: 15,
          maxLives: 3,
          timeLimit: null,
          targetStreak: null,
        },
        ...base,
      ];
    }

    return base;
  }, [levelChallenge]);

  const activeMode = useMemo(() => {
    const found = availableModes.find((mode) => mode.id === selectedMode);
    return found || availableModes[0];
  }, [availableModes, selectedMode]);

  useEffect(() => {
    if (!activeMode) {
      return;
    }

    if (phase === 'playing' && activeMode.timeLimit && timeLeft > 0) {
      const timerId = window.setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0));
      }, 1000);

      return () => window.clearInterval(timerId);
    }

    return undefined;
  }, [phase, activeMode, timeLeft]);

  const createQuestion = (statsSnapshot) => {
    const difficulty = deriveDifficulty(statsSnapshot);
    const allowedTypes = activeMode.id === 'timer' ? TIMER_TYPES : GAME_TYPES;
    const weakTables = progress.hardestTables.filter((table) => activeMode.tables.includes(table));

    return generateQuestion({
      tables: activeMode.tables,
      difficulty,
      allowedTypes,
      weakTables,
      preferWeak: weakTables.length > 0,
    });
  };

  const resetBoard = () => {
    const initialStats = createEmptyGameStats(activeMode.maxLives);
    setStats(initialStats);
    setQuestion(createQuestion(initialStats));
    setQuestionIndex(0);
    setFeedback(null);
    setPendingFinish(false);
    setTimeLeft(activeMode.timeLimit);
    setResult(null);
    setReported(false);
  };

  const startGame = () => {
    if (selectedMode !== activeMode.id) {
      setSelectedMode(activeMode.id);
    }

    resetBoard();
    setPhase('playing');
  };

  const shouldFinishNow = (nextStats, mode, wasCorrect) => {
    if (mode.id === 'perfect_streak' && !wasCorrect) {
      return true;
    }

    if (typeof mode.maxLives === 'number' && nextStats.lives <= 0) {
      return true;
    }

    if (mode.goalQuestions && nextStats.asked >= mode.goalQuestions) {
      return true;
    }

    if (mode.targetStreak && nextStats.streak >= mode.targetStreak) {
      return true;
    }

    return false;
  };

  const finishGame = (reason = 'completed') => {
    const finalStats = statsRef.current;
    const accuracy = finalStats.asked
      ? Math.round((finalStats.correct / finalStats.asked) * 100)
      : 0;
    const stars = calculateStars(accuracy);

    const levelPassed =
      activeMode.id === 'level_challenge'
        ? accuracy >= levelChallenge.targetAccuracy && finalStats.asked >= activeMode.goalQuestions
        : false;

    if (!reported) {
      onSessionComplete({
        mode: activeMode.id,
        score: finalStats.score,
        maxStreak: finalStats.maxStreak,
        answers: finalStats.answers,
        stars,
        levelId: activeMode.id === 'level_challenge' ? levelChallenge.id : undefined,
        levelPassed,
      });
      setReported(true);
    }

    setResult({
      ...finalStats,
      accuracy,
      stars,
      reason,
      levelPassed,
    });

    setPhase('result');
    setFeedback(null);
    setPendingFinish(false);
  };

  useEffect(() => {
    if (phase === 'playing' && activeMode.timeLimit && timeLeft === 0) {
      finishGame('time_up');
    }
  }, [phase, activeMode, timeLeft]);

  const handleAnswer = (answerValue) => {
    if (phase !== 'playing' || feedback || !question) {
      return;
    }

    const isCorrect = validateAnswer(question, answerValue);

    setStats((prev) => {
      const nextStreak = isCorrect ? prev.streak + 1 : 0;
      const scoreBase = isCorrect ? 12 + prev.streak * 2 : 0;
      const speedBonus = activeMode.id === 'timer' && isCorrect ? 3 : 0;
      const scoreDelta = scoreBase + speedBonus;

      const next = {
        ...prev,
        score: prev.score + scoreDelta,
        correct: prev.correct + (isCorrect ? 1 : 0),
        wrong: prev.wrong + (isCorrect ? 0 : 1),
        asked: prev.asked + 1,
        streak: nextStreak,
        maxStreak: Math.max(prev.maxStreak, nextStreak),
        lives: typeof prev.lives === 'number' ? prev.lives - (isCorrect ? 0 : 1) : prev.lives,
        answers: [
          ...prev.answers,
          {
            table: question.table,
            correct: isCorrect,
          },
        ],
      };

      setPendingFinish(shouldFinishNow(next, activeMode, isCorrect));
      return next;
    });

    const message = isCorrect
      ? pickRandomMessage(MESSAGES.success)
      : `Respuesta correcta: ${question.correctAnswer}. ${pickRandomMessage(MESSAGES.recovery)}`;

    setFeedback({
      correct: isCorrect,
      message,
    });
  };

  const handleContinue = () => {
    if (pendingFinish) {
      finishGame('objective_reached');
      return;
    }

    const nextStats = statsRef.current;
    setQuestion(createQuestion(nextStats));
    setQuestionIndex((prev) => prev + 1);
    setFeedback(null);
  };

  const closeResult = () => {
    setPhase('select');
    setResult(null);
    setQuestion(null);
    setFeedback(null);
    setQuestionIndex(0);
    setTimeLeft(null);

    if (activeMode.id === 'level_challenge') {
      onClearLevelChallenge();
    }
  };

  const replay = () => {
    resetBoard();
    setPhase('playing');
  };

  const progressValue =
    activeMode.goalQuestions && phase === 'playing'
      ? Math.min(stats.asked + (feedback ? 1 : 0), activeMode.goalQuestions)
      : 0;

  const resultSummary = result
    ? result.levelPassed
      ? 'Superaste el desafio del nivel. Sigue avanzando.'
      : result.reason === 'time_up'
        ? 'El tiempo termino. Buena practica bajo presion.'
        : 'Partida completada. Cada intento mejora tu memoria matematica.'
    : '';

  return (
    <section className="game-page">
      <header className="section-heading card">
        <h2>Zona de juego</h2>
        <p>
          Puntaje, vidas, rachas y dificultad progresiva para entrenar precision y velocidad.
        </p>
      </header>

      {phase === 'select' && (
        <section className="card mode-selector">
          <h3>Elige un modo</h3>
          <div className="mode-grid">
            {availableModes.map((mode) => (
              <article
                key={mode.id}
                className={`mode-card selectable ${selectedMode === mode.id ? 'selected' : ''}`}
                onClick={() => setSelectedMode(mode.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    setSelectedMode(mode.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <h4>{mode.title}</h4>
                <p>{mode.description}</p>
              </article>
            ))}
          </div>

          <div className="mode-actions">
            <button type="button" className="btn btn-primary" onClick={startGame}>
              Iniciar partida
            </button>
            <button type="button" className="btn btn-soft" onClick={() => onNavigate('levels')}>
              Ver niveles
            </button>
          </div>
        </section>
      )}

      {phase === 'playing' && (
        <>
          <ScoreBoard
            score={stats.score}
            correct={stats.correct}
            wrong={stats.wrong}
            streak={stats.streak}
            lives={activeMode.maxLives ? stats.lives : undefined}
            maxLives={activeMode.maxLives || undefined}
            timeLeft={activeMode.timeLimit ? timeLeft : undefined}
          />

          {activeMode.goalQuestions && (
            <ProgressBar
              value={progressValue}
              max={activeMode.goalQuestions}
              label="Avance de partida"
            />
          )}

          <PracticePanel
            question={question}
            feedback={feedback}
            onAnswer={handleAnswer}
            onContinue={handleContinue}
            currentIndex={questionIndex}
            totalQuestions={activeMode.goalQuestions || undefined}
            isLastQuestion={pendingFinish}
          />

          {!feedback && <MotivationalMessage tone={stats.streak >= 3 ? 'streak' : 'neutral'} />}
        </>
      )}

      <ResultsModal
        open={phase === 'result' && Boolean(result)}
        title="Resultados de la partida"
        summary={resultSummary}
        stats={{
          score: result?.score || 0,
          correct: result?.correct || 0,
          wrong: result?.wrong || 0,
          accuracy: result?.accuracy || 0,
          maxStreak: result?.maxStreak || 0,
          stars: result?.stars || 0,
        }}
        primaryActionLabel="Jugar de nuevo"
        onPrimaryAction={replay}
        onSecondaryAction={closeResult}
        secondaryActionLabel="Volver"
      />
    </section>
  );
}

export default GamePage;
