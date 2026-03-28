function normalizeOption(option) {
  if (typeof option === 'object' && option !== null) {
    return option;
  }

  return {
    value: option,
    label: String(option),
  };
}

function MultipleChoiceOptions({
  options = [],
  onSelect,
  disabled = false,
  selectedValue,
  revealCorrect = false,
  correctAnswer,
}) {
  return (
    <div className="choice-grid" role="group" aria-label="Opciones de respuesta">
      {options.map((rawOption) => {
        const option = normalizeOption(rawOption);
        const isSelected = selectedValue === option.value;
        const isCorrect = String(option.value) === String(correctAnswer);

        let className = 'choice-btn';
        if (isSelected) {
          className += ' selected';
        }

        if (revealCorrect && isCorrect) {
          className += ' correct';
        } else if (revealCorrect && isSelected && !isCorrect) {
          className += ' incorrect';
        }

        return (
          <button
            key={option.value}
            type="button"
            className={className}
            onClick={() => onSelect(option.value)}
            disabled={disabled}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default MultipleChoiceOptions;
