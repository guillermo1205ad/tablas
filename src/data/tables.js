export const TABLES = Array.from({ length: 12 }, (_, index) => {
  const table = index + 1;
  return {
    table,
    facts: Array.from({ length: 12 }, (_, multiplierIndex) => {
      const multiplier = multiplierIndex + 1;
      return {
        table,
        multiplier,
        result: table * multiplier,
      };
    }),
  };
});

export const ALL_TABLE_NUMBERS = TABLES.map((item) => item.table);

export const TABLE_TIPS = {
  1: {
    short: 'Todo número multiplicado por 1 se mantiene igual.',
    pattern: 'Es la tabla espejo: n × 1 = n.',
  },
  2: {
    short: 'Avanza siempre de 2 en 2.',
    pattern: 'Todos los resultados son pares.',
  },
  3: {
    short: 'Suma el mismo número tres veces.',
    pattern: 'Si 4 × 3 = 12, entonces 3 × 4 también es 12.',
  },
  4: {
    short: 'Es como duplicar dos veces.',
    pattern: 'Primero duplica y luego vuelve a duplicar.',
  },
  5: {
    short: 'Termina en 0 o en 5.',
    pattern: 'Los resultados alternan entre final 5 y final 0.',
  },
  6: {
    short: 'Combina patrones de 2 y 3.',
    pattern: 'Si es par y múltiplo de 3, suele estar en esta tabla.',
  },
  7: {
    short: 'Requiere más práctica, pero sale con ritmo.',
    pattern: 'Practicar en bloques cortos ayuda mucho con la del 7.',
  },
  8: {
    short: 'Es doblar la tabla del 4.',
    pattern: 'Puedes pensar 8 × n como (4 × n) × 2.',
  },
  9: {
    short: 'Tiene patrones visuales muy útiles.',
    pattern: 'La suma de sus dígitos casi siempre vuelve a 9.',
  },
  10: {
    short: 'Solo agrega un 0 al final.',
    pattern: '10 × n = n0.',
  },
  11: {
    short: 'Al principio parece mágica, pero es regular.',
    pattern: 'Con números del 1 al 9 se repite el dígito: 11 × 4 = 44.',
  },
  12: {
    short: 'Combina todo lo que ya aprendiste.',
    pattern: '12 × n = 10 × n + 2 × n.',
  },
};

export const STUDY_STRATEGIES = [
  'Practica 5 minutos y descansa 1 minuto para memorizar mejor.',
  'Si te equivocas, repite esa operación 3 veces seguidas.',
  'Alterna una tabla fácil con una desafiante para mantener confianza.',
  'Di la operación en voz alta para fijarla con más canales de memoria.',
];
