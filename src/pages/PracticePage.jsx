import { useEffect, useMemo, useRef, useState } from 'react';
import MotivationalMessage from '../components/MotivationalMessage';
import PracticePanel from '../components/PracticePanel';
import ProgressBar from '../components/ProgressBar';
import ScoreBoard from '../components/ScoreBoard';
import TableSelector from '../components/TableSelector';
import { MESSAGES, pickRandomMessage } from '../data/messages';
import { generateQuestion, validateAnswer } from '../utils/questions';

const TOTAL_QUESTIONS = 12;
const PRACTICE_TYPES = [
  'open',
  'multiple_choice',
  'true_false',
  'missing_factor',
  'choose_result',
  'complete_result',
  'match_pair',
];

function buildEmptyStats(table) {
  return {
    table,
    score: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    maxStreak: 0,
    answers: [],
  };
}

function calcStars(accuracy) {
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

function PracticePage({ progress, initialTable = 2, onSessionComplete, onTryMixedMode }) {
  const [selectedTable, setSelectedTable] = useState(initialTable);
  const [phase, setPhase] = useState('idle');
  const [question, setQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState(buildEmptyStats(initialTable));
  const [reported, setReported] = useState(false);

  const statsRef = useRef(stats);
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    setSelectedTable(initialTable);
  }, [initialTable]);

  const weakTables = progress.hardestTables;

  const accuracy = useMemo(() => {
    if (!stats.correct && !stats.wrong) {
      return 0;
    }

    const total = stats.correct + stats.wrong;
    return Math.round((stats.correct / total) * 100);
  }, [stats.correct, stats.wrong]);

  const buildQuestion = (index, currentStreak) => {
    const baseDifficulty = Math.min(5, 1 + Math.floor(index / 3));
    const streakBoost = currentStreak >= 3 ? 1 : 0;

    return generateQuestion({
      tables: [selectedTable],
      difficulty: Math.min(5, baseDifficulty + streakBoost),
      allowedTypes: PRACTICE_TYPES,
      weakTables,
      preferWeak: false,
    });
  };

  const startSession = () => {
    const initialStats = buildEmptyStats(selectedTable);
    setStats(initialStats);
    setReported(false);
    setQuestionIndex(0);
    setFeedback(null);
    setQuestion(buildQuestion(0, 0));
    setPhase('playing');
  };

  const finishSession = () => {
    const finalStats = statsRef.current;
    const finalAccuracy = finalStats.correct + finalStats.wrong
      ? Math.round((finalStats.correct / (finalStats.correct + finalStats.wrong)) * 100)
      : 0;
    const stars = calcStars(finalAccuracy);

    if (!reported) {
      onSessionComplete({
        mode: 'practice',
        score: finalStats.score,
        maxStreak: finalStats.maxStreak,
        answers: finalStats.answers,
        stars,
      });
      setReported(true);
    }

    setPhase('finished');
  };

  const handleAnswer = (answerValue) => {
    if (phase !== 'playing' || feedback || !question) {
      return;
    }

    const isCorrect = validateAnswer(question, answerValue);

    setStats((prev) => {
      const nextStreak = isCorrect ? prev.streak + 1 : 0;
      const scoreDelta = isCorrect ? 10 + prev.streak * 2 : 0;

      return {
        ...prev,
        score: prev.score + scoreDelta,
        correct: prev.correct + (isCorrect ? 1 : 0),
        wrong: prev.wrong + (isCorrect ? 0 : 1),
        streak: nextStreak,
        maxStreak: Math.max(prev.maxStreak, nextStreak),
        answers: [
          ...prev.answers,
          {
            table: selectedTable,
            correct: isCorrect,
          },
        ],
      };
    });

    const message = isCorrect
      ? pickRandomMessage(MESSAGES.success)
      : `La respuesta correcta era ${question.correctAnswer}. ${pickRandomMessage(MESSAGES.recovery)}`;

    setFeedback({
      correct: isCorrect,
      message,
    });
  };

  const handleContinue = () => {
    if (questionIndex + 1 >= TOTAL_QUESTIONS) {
      finishSession();
      return;
    }

    const nextIndex = questionIndex + 1;
    const nextQuestion = buildQuestion(nextIndex, statsRef.current.streak);

    setQuestionIndex(nextIndex);
    setQuestion(nextQuestion);
    setFeedback(null);
  };

  const restartSession = () => {
    setPhase('idle');
    setFeedback(null);
    setQuestion(null);
    setQuestionIndex(0);
    setStats(buildEmptyStats(selectedTable));
  };

  const summarySuggestion =
    accuracy >= 80
      ? 'Muy buen rendimiento. Puedes probar Mezcla Total o Niveles.'
      : `Conviene reforzar la tabla del ${selectedTable} con sesiones breves.`;

  return (
    <section className="practice-page">
      <header className="section-heading card">
        <h2>Practica guiada</h2>
        <p>
          Entrena una tabla especifica con ejercicios variados, feedback inmediato y progreso paso a
          paso.
        </p>
      </header>

      <div className="practice-top card">
        <TableSelector
          selected={selectedTable}
          onChange={(value) => {
            setSelectedTable(value);
            setPhase('idle');
            setFeedback(null);
            setQuestion(null);
            setQuestionIndex(0);
            setStats(buildEmptyStats(value));
          }}
          label="Tabla para practicar"
        />

        {phase !== 'playing' ? (
          <button type="button" className="btn btn-primary" onClick={startSession}>
            Iniciar practica
          </button>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={restartSession}>
            Cambiar tabla
          </button>
        )}
      </div>

      {phase === 'playing' && (
        <>
          <ScoreBoard
            score={stats.score}
            correct={stats.correct}
            wrong={stats.wrong}
            streak={stats.streak}
          />

          <ProgressBar value={questionIndex + (feedback ? 1 : 0)} max={TOTAL_QUESTIONS} label="Avance de sesion" />

          <PracticePanel
            question={question}
            feedback={feedback}
            onAnswer={handleAnswer}
            onContinue={handleContinue}
            currentIndex={questionIndex}
            totalQuestions={TOTAL_QUESTIONS}
            isLastQuestion={questionIndex + 1 >= TOTAL_QUESTIONS}
          />
        </>
      )}

      {phase === 'idle' && (
        <section className="card empty-state">
          <h3>Lista para practicar</h3>
          <p>
            En esta sesion trabajaras solo la tabla del {selectedTable}. Cuando aciertes de forma
            consistente, intenta un modo de mayor dificultad.
          </p>
          <MotivationalMessage tone="neutral" />
        </section>
      )}

      {phase === 'finished' && (
        <section className="card summary-card">
          <h3>Resumen de practica</h3>
          <p>{summarySuggestion}</p>

          <div className="results-grid inline">
            <article>
              <span>Puntaje</span>
              <strong>{stats.score}</strong>
            </article>
            <article>
              <span>Aciertos</span>
              <strong>{stats.correct}</strong>
            </article>
            <article>
              <span>Errores</span>
              <strong>{stats.wrong}</strong>
            </article>
            <article>
              <span>Precision</span>
              <strong>{accuracy}%</strong>
            </article>
          </div>

          <div className="summary-actions">
            <button type="button" className="btn btn-primary" onClick={startSession}>
              Reintentar
            </button>
            <button type="button" className="btn btn-soft" onClick={onTryMixedMode}>
              Probar Mezcla Total
            </button>
          </div>
        </section>
      )}
    </section>
  );
}

export default PracticePage;
