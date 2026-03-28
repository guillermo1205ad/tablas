import { ALL_TABLE_NUMBERS } from '../data/tables';
import { clamp, randomInt, sample, shuffle, weightedSample } from './math';

const QUESTION_TYPES_BY_DIFFICULTY = {
  1: ['open', 'multiple_choice', 'complete_result'],
  2: ['open', 'multiple_choice', 'complete_result', 'true_false', 'choose_result'],
  3: ['open', 'multiple_choice', 'true_false', 'missing_factor', 'choose_result'],
  4: ['open', 'multiple_choice', 'true_false', 'missing_factor', 'match_pair', 'quick_challenge'],
  5: ['multiple_choice', 'true_false', 'missing_factor', 'match_pair', 'quick_challenge', 'complete_result'],
};

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function pickTable(tables, weakTables = [], preferWeak = false) {
  const safeTables = tables.length ? tables : ALL_TABLE_NUMBERS;

  if (!preferWeak || !weakTables.length) {
    return sample(safeTables);
  }

  const weakSet = new Set(weakTables);
  return weightedSample(safeTables, (table) => (weakSet.has(table) ? 2.8 : 1));
}

function makeOperation(table, difficulty) {
  const maxMultiplier = difficulty <= 2 ? 10 : 12;
  const multiplier = randomInt(1, maxMultiplier);
  return {
    table,
    multiplier,
    result: table * multiplier,
  };
}

function numberDistractors(correctAnswer, table, multiplier) {
  const options = new Set([correctAnswer]);

  while (options.size < 4) {
    const nearResult = correctAnswer + randomInt(-12, 12);
    const patternResult = table * randomInt(1, 12);
    const mirrored = multiplier * randomInt(1, 12);
    const candidate = sample([nearResult, patternResult, mirrored]);

    if (candidate >= 0 && candidate !== correctAnswer) {
      options.add(candidate);
    }
  }

  return shuffle([...options]);
}

function operationDistractors(correctOperation, result, tables) {
  const options = new Set([correctOperation]);

  while (options.size < 4) {
    const table = sample(tables);
    const multiplier = randomInt(1, 12);
    const operation = `${table} × ${multiplier}`;

    if (table * multiplier !== result) {
      options.add(operation);
    }
  }

  return shuffle([...options]);
}

function chooseQuestionType(difficulty, forcedTypes = []) {
  if (forcedTypes.length) {
    return sample(forcedTypes);
  }

  const normalizedDifficulty = clamp(Math.round(difficulty), 1, 5);
  return sample(QUESTION_TYPES_BY_DIFFICULTY[normalizedDifficulty]);
}

export function generateQuestion({
  tables = ALL_TABLE_NUMBERS,
  difficulty = 1,
  weakTables = [],
  preferWeak = false,
  allowedTypes = [],
}) {
  const table = pickTable(tables, weakTables, preferWeak);
  const operation = makeOperation(table, difficulty);
  const type = chooseQuestionType(difficulty, allowedTypes);
  const { multiplier, result } = operation;

  if (type === 'multiple_choice' || type === 'choose_result') {
    return {
      id: createId(),
      type,
      label: type === 'choose_result' ? 'Elegir resultado' : 'Seleccion multiple',
      prompt: `${table} × ${multiplier} = ?`,
      table,
      multiplier,
      correctAnswer: result,
      options: numberDistractors(result, table, multiplier),
      inputKind: 'options',
    };
  }

  if (type === 'true_false') {
    const isTrue = Math.random() >= 0.45;
    const shownResult = isTrue ? result : result + sample([-3, -2, -1, 1, 2, 3]);

    return {
      id: createId(),
      type,
      label: 'Verdadero o falso',
      prompt: `${table} × ${multiplier} = ${shownResult}`,
      table,
      multiplier,
      correctAnswer: isTrue ? 'true' : 'false',
      options: [
        { value: 'true', label: 'Verdadero' },
        { value: 'false', label: 'Falso' },
      ],
      inputKind: 'options',
    };
  }

  if (type === 'missing_factor') {
    const hidden = Math.random() >= 0.5 ? table : multiplier;
    const visible = hidden === table ? multiplier : table;

    const options = shuffle([
      hidden,
      Math.max(1, hidden + sample([-3, -2, -1, 1, 2, 3])),
      Math.max(1, hidden + sample([-2, -1, 1, 2])),
      randomInt(1, 12),
    ]).slice(0, 4);

    return {
      id: createId(),
      type,
      label: 'Completa factor faltante',
      prompt: `${visible} × ? = ${result}`,
      table,
      multiplier,
      correctAnswer: hidden,
      options: shuffle([...new Set(options)]),
      inputKind: 'options',
    };
  }

  if (type === 'match_pair') {
    const correctOperation = `${table} × ${multiplier}`;

    return {
      id: createId(),
      type,
      label: 'Relacionar operacion',
      prompt: `Elige la operacion que da ${result}`,
      table,
      multiplier,
      correctAnswer: correctOperation,
      options: operationDistractors(correctOperation, result, tables),
      inputKind: 'options',
    };
  }

  if (type === 'quick_challenge') {
    return {
      id: createId(),
      type,
      label: 'Reto rapido',
      prompt: `Reto rapido: ${table} × ${multiplier} = ?`,
      table,
      multiplier,
      correctAnswer: result,
      inputKind: 'input',
      quick: true,
    };
  }

  if (type === 'complete_result') {
    return {
      id: createId(),
      type,
      label: 'Completar resultado',
      prompt: `Completa: ${table} × ${multiplier} = __`,
      table,
      multiplier,
      correctAnswer: result,
      inputKind: 'input',
    };
  }

  return {
    id: createId(),
    type: 'open',
    label: 'Respuesta abierta',
    prompt: `${table} × ${multiplier} = ?`,
    table,
    multiplier,
    correctAnswer: result,
    inputKind: 'input',
  };
}

export function validateAnswer(question, userAnswer) {
  if (userAnswer === null || userAnswer === undefined || userAnswer === '') {
    return false;
  }

  const normalized = `${userAnswer}`.trim().toLowerCase();

  if (question.type === 'true_false') {
    return normalized === `${question.correctAnswer}`;
  }

  if (question.type === 'match_pair') {
    return normalized === `${question.correctAnswer}`.toLowerCase();
  }

  const numericAnswer = Number(normalized);
  return Number.isFinite(numericAnswer) && numericAnswer === Number(question.correctAnswer);
}
