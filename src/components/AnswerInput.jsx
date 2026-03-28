import { useEffect, useState } from 'react';

function AnswerInput({ questionId, onSubmit, disabled }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue('');
  }, [questionId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim() || disabled) {
      return;
    }
    onSubmit(value.trim());
  };

  return (
    <form className="answer-input" onSubmit={handleSubmit}>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(event) => setValue(event.target.value.replace(/[^0-9]/g, ''))}
        placeholder="Escribe tu respuesta"
        disabled={disabled}
      />
      <button type="submit" className="btn btn-primary" disabled={disabled || !value.trim()}>
        Responder
      </button>
    </form>
  );
}

export default AnswerInput;
