import { useEffect, useState } from 'react';
import AnswerInput from './AnswerInput';
import MultipleChoiceOptions from './MultipleChoiceOptions';
import QuestionCard from './QuestionCard';

function PracticePanel({
  question,
  feedback,
  onAnswer,
  onContinue,
  currentIndex,
  totalQuestions,
  isLastQuestion,
}) {
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    setSelectedValue(null);
  }, [question?.id]);

  if (!question) {
    return null;
  }

  const handleOptionSelect = (value) => {
    if (feedback) {
      return;
    }
    setSelectedValue(value);
    onAnswer(value);
  };

  return (
    <section className="practice-panel">
      <QuestionCard
        question={question}
        feedback={feedback}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
      >
        {question.inputKind === 'input' ? (
          <AnswerInput questionId={question.id} onSubmit={onAnswer} disabled={Boolean(feedback)} />
        ) : (
          <MultipleChoiceOptions
            options={question.options}
            onSelect={handleOptionSelect}
            selectedValue={selectedValue}
            disabled={Boolean(feedback)}
            revealCorrect={Boolean(feedback)}
            correctAnswer={question.correctAnswer}
          />
        )}
      </QuestionCard>

      {feedback && (
        <button type="button" className="btn btn-primary" onClick={onContinue}>
          {isLastQuestion ? 'Ver resultados' : 'Siguiente pregunta'}
        </button>
      )}
    </section>
  );
}

export default PracticePanel;
