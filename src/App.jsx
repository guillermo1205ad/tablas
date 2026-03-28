import { useMemo, useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import GamePage from './pages/GamePage';
import LearnPage from './pages/LearnPage';
import LevelsPage from './pages/LevelsPage';
import PracticePage from './pages/PracticePage';
import ProgressPage from './pages/ProgressPage';
import { LEVELS } from './data/levels';
import { useLocalProgress } from './hooks/useLocalProgress';

const VALID_VIEWS = ['home', 'learn', 'practice', 'game', 'levels', 'progress'];

function App() {
  const { progress, registerSession, resetProgress } = useLocalProgress();
  const [currentView, setCurrentView] = useState('home');
  const [practicePresetTable, setPracticePresetTable] = useState(2);
  const [gamePresetMode, setGamePresetMode] = useState('mix_total');
  const [activeLevelChallenge, setActiveLevelChallenge] = useState(null);

  const globalAccuracy = useMemo(() => {
    if (!progress.totalAnswered) {
      return 0;
    }

    return Math.round((progress.totalCorrect / progress.totalAnswered) * 100);
  }, [progress.totalAnswered, progress.totalCorrect]);

  const navigate = (view) => {
    if (VALID_VIEWS.includes(view)) {
      setCurrentView(view);
    }
  };

  const handleQuickMode = (mode, payload = {}) => {
    if (mode === 'learn') {
      if (payload.table) {
        setPracticePresetTable(payload.table);
      }
      setCurrentView('learn');
      return;
    }

    if (mode === 'practice') {
      if (payload.table) {
        setPracticePresetTable(payload.table);
      }
      setCurrentView('practice');
      return;
    }

    if (['mix_total', 'timer', 'survival', 'perfect_streak'].includes(mode)) {
      setGamePresetMode(mode);
      setActiveLevelChallenge(null);
      setCurrentView('game');
      return;
    }

    if (mode === 'levels') {
      setCurrentView('levels');
      return;
    }

    if (mode === 'progress') {
      setCurrentView('progress');
    }
  };

  const handleSessionComplete = (sessionData) => {
    registerSession(sessionData);
  };

  const handleStartPracticeFromLearn = (table) => {
    setPracticePresetTable(table);
    setCurrentView('practice');
  };

  const handleStartLevel = (levelId) => {
    const level = LEVELS.find((item) => item.id === levelId);
    if (!level) {
      return;
    }

    setGamePresetMode('level_challenge');
    setActiveLevelChallenge(level);
    setCurrentView('game');
  };

  const clearLevelChallenge = () => {
    setActiveLevelChallenge(null);
  };

  return (
    <div className="app-shell">
      <Header
        currentView={currentView}
        onNavigate={navigate}
        progress={progress}
        globalAccuracy={globalAccuracy}
      />

      <main className="page-container">
        {currentView === 'home' && (
          <HomeScreen onNavigate={navigate} onQuickMode={handleQuickMode} progress={progress} />
        )}

        {currentView === 'learn' && (
          <LearnPage
            initialTable={practicePresetTable}
            onPracticeTable={handleStartPracticeFromLearn}
            onNavigate={navigate}
          />
        )}

        {currentView === 'practice' && (
          <PracticePage
            progress={progress}
            initialTable={practicePresetTable}
            onSessionComplete={handleSessionComplete}
            onNavigate={navigate}
            onTryMixedMode={() => handleQuickMode('mix_total')}
          />
        )}

        {currentView === 'game' && (
          <GamePage
            progress={progress}
            presetMode={gamePresetMode}
            levelChallenge={activeLevelChallenge}
            onSessionComplete={handleSessionComplete}
            onClearLevelChallenge={clearLevelChallenge}
            onNavigate={navigate}
          />
        )}

        {currentView === 'levels' && (
          <LevelsPage
            progress={progress}
            onStartLevel={handleStartLevel}
            onNavigate={navigate}
          />
        )}

        {currentView === 'progress' && (
          <ProgressPage progress={progress} onResetProgress={resetProgress} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
