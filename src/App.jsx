import React, { useState, useEffect } from 'react';
import AppShell from './components/AppShell';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import FlashcardsScreen from './screens/FlashcardsScreen';
import PracticeScreen from './screens/PracticeScreen';
import ProgressScreen from './screens/ProgressScreen';
import SettingsScreen from './screens/SettingsScreen';
import { clearAllLearningProgress, getLastLesson } from './utils/storage';

function getStoredItem(key, fallback) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem(key);
      return val !== null ? val : fallback;
    }
  } catch {
    // Return fallback if storage is inaccessible
  }
  return fallback;
}

function setStoredItem(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Ignore storage quota/permission errors gracefully
  }
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Load last lesson on initial mount if available
  useEffect(() => {
    const savedLesson = getLastLesson();
    if (savedLesson) {
      if (savedLesson.category) setSelectedCategory(savedLesson.category);
      if (savedLesson.level) setSelectedLevel(savedLesson.level);
      if (typeof savedLesson.cardIndex === 'number') {
        setActiveCardIndex(savedLesson.cardIndex);
      }
    }
  }, []);

  // Preferences with localStorage persistence
  const [cardDirection, setCardDirection] = useState(() => {
    return getStoredItem('ko_yoruba_card_direction', 'yoruba-to-english');
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = getStoredItem('ko_yoruba_sound_enabled', null);
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    setStoredItem('ko_yoruba_card_direction', cardDirection);
  }, [cardDirection]);

  useEffect(() => {
    setStoredItem('ko_yoruba_sound_enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const handleCategorySelect = (category, level, cardIndex = 0) => {
    setSelectedCategory(category);
    setSelectedLevel(level);
    setActiveCardIndex(cardIndex);
  };

  const handleResetProgress = () => {
    clearAllLearningProgress();
    setSelectedCategory(null);
    setSelectedLevel('beginner');
    setActiveCardIndex(0);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNavigate={setCurrentScreen}
            onResumeLesson={handleCategorySelect}
          />
        );
      case 'learn':
        return (
          <LearnScreen
            onNavigate={setCurrentScreen}
            onSelectCategory={handleCategorySelect}
          />
        );
      case 'flashcards':
        return (
          <FlashcardsScreen
            selectedCategory={selectedCategory}
            selectedLevel={selectedLevel}
            cardDirection={cardDirection}
            onUpdateCardDirection={setCardDirection}
            initialCardIndex={activeCardIndex}
            onNavigate={setCurrentScreen}
          />
        );
      case 'practice':
        return <PracticeScreen onNavigate={setCurrentScreen} />;
      case 'progress':
        return (
          <ProgressScreen
            onNavigate={setCurrentScreen}
            onResumeLesson={handleCategorySelect}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            cardDirection={cardDirection}
            onUpdateCardDirection={setCardDirection}
            soundEnabled={soundEnabled}
            onToggleSound={setSoundEnabled}
            onResetProgress={handleResetProgress}
          />
        );
      default:
        return (
          <HomeScreen
            onNavigate={setCurrentScreen}
            onResumeLesson={handleCategorySelect}
          />
        );
    }
  };

  return (
    <AppShell currentScreen={currentScreen} onNavigate={setCurrentScreen}>
      {renderScreen()}
    </AppShell>
  );
}
