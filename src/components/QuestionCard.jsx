function QuestionCard({ question, feedback, currentIndex, totalQuestions, children }) {
  if (!question) {
    return null;
  }

  return (
    <section className="question-card card" aria-live="polite">
      <header className="question-top">
        <span className="question-tag">{question.label}</span>
        {typeof currentIndex === 'number' && typeof totalQuestions === 'number' && (
          <span className="question-progress">
            Pregunta {currentIndex + 1}/{totalQuestions}
          </span>
        )}
      </header>

      <h3>{question.prompt}</h3>

      <div className="question-body">{children}</div>

      {feedback && (
        <p className={`feedback-line ${feedback.correct ? 'ok' : 'error'}`}>
          {feedback.message}
        </p>
      )}
    </section>
  );
}

export default QuestionCard;
