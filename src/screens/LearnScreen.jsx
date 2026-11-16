import React, { useState } from 'react';
import sampleVocabulary from '../data/vocabulary.json';
import { calculateProgress } from '../utils/storage';

const LEVELS = [
  { id: 'beginner', label: 'Beginner', targetCount: 150, description: 'Greetings, numbers, family, food, body parts' },
  { id: 'intermediate', label: 'Intermediate', targetCount: 100, description: 'Household, actions, transportation, places' },
  { id: 'advanced', label: 'Advanced', targetCount: 50, description: 'Culture, emotions, expressions, abstract concepts' },
];

export default function LearnScreen({ onNavigate, onSelectCategory }) {
  const [selectedLevel, setSelectedLevel] = useState('beginner');

  // Compute live progress for categories
  const progress = calculateProgress(sampleVocabulary);

  // Filter sample entries by the chosen level
  const levelEntries = sampleVocabulary.filter((item) => item.level === selectedLevel);

  // Group entries by category
  const categoriesMap = levelEntries.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const categoryNames = Object.keys(categoriesMap);

  return (
    <section className="screen-container" aria-labelledby="learn-title">
      <header className="screen-header">
        <h1 id="learn-title" className="screen-title">Learn Vocabulary</h1>
        <p className="screen-subtitle">
          Choose a difficulty level and pick a category to study with flashcards.
        </p>
      </header>

      {/* Level Selector Tabs: All unlocked and browsable */}
      <div
        role="tablist"
        aria-label="Difficulty levels"
        style={{
          display: 'flex',
          gap: '0.5rem',
          backgroundColor: 'var(--color-card)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
        }}
      >
        {LEVELS.map((level) => {
          const isSelected = selectedLevel === level.id;
          return (
            <button
              key={level.id}
              role="tab"
              aria-selected={isSelected}
              type="button"
              onClick={() => setSelectedLevel(level.id)}
              style={{
                flex: 1,
                fontSize: '0.9rem',
                fontWeight: 700,
                backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                color: isSelected ? '#ffffff' : 'var(--color-text)',
                borderRadius: 'var(--radius-sm)',
                minHeight: '40px',
              }}
            >
              {level.label}
            </button>
          );
        })}
      </div>

      {/* Current Level Info */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', textTransform: 'capitalize' }}>
              {selectedLevel} Level
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {LEVELS.find((l) => l.id === selectedLevel)?.description}
            </p>
          </div>
          <span className="gold-badge">{levelEntries.length} words available</span>
        </div>
      </div>

      {/* Categories List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>
          Categories in {selectedLevel}
        </h3>

        {categoryNames.length === 0 ? (
          <div className="card empty-state">
            <span className="empty-state-icon" aria-hidden="true">📂</span>
            <div className="empty-state-title">No categories yet</div>
            <div className="empty-state-text">
              Vocabulary for this level is being compiled and reviewed.
            </div>
          </div>
        ) : (
          categoryNames.map((category) => {
            const count = categoriesMap[category];
            const catProgress = progress.categories.find(
              (c) => c.level === selectedLevel && c.category === category
            );
            const studied = catProgress?.studied || 0;
            const isCompleted = catProgress?.isCompleted || false;

            return (
              <div
                key={category}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.05rem', textTransform: 'capitalize' }}>
                      {category}
                    </h4>
                    {isCompleted && (
                      <span
                        className="gold-badge"
                        style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                      >
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {studied} of {count} studied
                  </p>
                </div>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    if (onSelectCategory) {
                      onSelectCategory(category, selectedLevel);
                    }
                    onNavigate('flashcards');
                  }}
                  aria-label={`Study ${category} in ${selectedLevel}`}
                >
                  Study →
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
