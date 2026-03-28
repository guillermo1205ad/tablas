import { createDefaultProgress, mergeWithDefaults } from './progress';

const STORAGE_KEY = 'multiplicago-progress-v1';

export function loadProgress() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return createDefaultProgress();
    }

    const parsed = JSON.parse(rawValue);
    return mergeWithDefaults(parsed);
  } catch (error) {
    console.error('No se pudo cargar el progreso local:', error);
    return createDefaultProgress();
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('No se pudo guardar el progreso local:', error);
  }
}

export function clearStoredProgress() {
  localStorage.removeItem(STORAGE_KEY);
  return createDefaultProgress();
}
