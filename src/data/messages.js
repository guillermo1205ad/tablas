export const MESSAGES = {
  success: ['Excelente', 'Muy bien', 'Sigue asi', 'Gran respuesta', 'Lo estas logrando'],
  recovery: ['No pasa nada, intentalo otra vez', 'Cada error tambien ensena', 'Vas bien, respira y continua'],
  streak: ['Racha encendida', 'Increible consistencia', 'Nivel de campeona'],
  suggestion: [
    'Te conviene reforzar una tabla puntual en bloques cortos.',
    'Mezclar preguntas te ayudara a ganar rapidez mental.',
    'Vas lista para subir de nivel si mantienes esta precision.',
  ],
};

export const RANDOM_MOTIVATORS = [
  'Paso a paso se construye dominio real.',
  'Practicar poco y frecuente funciona mejor que estudiar todo de una vez.',
  'Tu progreso vale mas que la perfeccion inmediata.',
  'Cada intento suma memoria y confianza.',
];

export function pickRandomMessage(bucket = []) {
  if (!bucket.length) {
    return '';
  }

  const index = Math.floor(Math.random() * bucket.length);
  return bucket[index];
}
