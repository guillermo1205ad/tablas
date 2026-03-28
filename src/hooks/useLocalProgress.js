import { useEffect, useState } from 'react';
import { applySessionToProgress } from '../utils/progress';
import { clearStoredProgress, loadProgress, saveProgress } from '../utils/storage';

export function useLocalProgress() {
  const [progress, setProgress] = useState(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const registerSession = (sessionData) => {
    setProgress((prev) => applySessionToProgress(prev, sessionData));
  };

  const resetProgress = () => {
    setProgress(clearStoredProgress());
  };

  return {
    progress,
    registerSession,
    resetProgress,
  };
}
