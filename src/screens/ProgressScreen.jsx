import React, { useState, useEffect } from 'react';
import sampleVocabulary from '../data/vocabulary.json';
import { calculateProgress } from '../utils/storage';

export default function ProgressScreen({ onNavigate, onResumeLesson }) {
  const [progress, setProgress] = useState(() => calculateProgress(sampleVocabulary));

  useEffect(() => {
    setProgress(calculateProgress(sampleVocabulary));
  }, []);

  return (
    <section className="screen-container" aria-labelledby="progress-title">
      <header className="screen-header">
        <h1 id="progress-title" className="screen-title">Your Progress</h1>
        <p className="screen-subtitle">
          Track your studied vocabulary, mastery level, and category completion.
        </p>
      </header>

      {/* Main KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '0.75rem 0.5rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {progress.wordsStudied}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Studied ({progress.overallStudiedPercentage}%)
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '0.75rem 0.5rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7b5808' }}>
            {progress.wordsKnown}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Known ({progress.overallKnownPercentage}%)
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '0.75rem 0.5rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#c0392b' }}>
            {progress.wordsAgain}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            To Review
          </div>
        </div>
      </div>

      {/* Category Progress Breakdown */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.1rem' }}>Category Completion</h2>
          <span className="gold-badge">
            {progress.completedCategoriesCount} of {progress.categories.length} completed
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {progress.categories.map((cat) => (
            <div
              key={`${cat.level}-${cat.category}`}
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>
                    {cat.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                    ({cat.level})
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {cat.studied} / {cat.total} studied ({cat.completionPercentage}%)
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {cat.isCompleted ? (
                  <span
                    className="gold-badge"
                    style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                  >
                    ✓ Complete
                  </span>
                ) : (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      if (onResumeLesson) {
                        onResumeLesson(cat.category, cat.level, 0);
                      }
                      onNavigate('flashcards');
                    }}
                    style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', minHeight: '36px' }}
                  >
                    Study →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Storage Notice */}
      <div className="card" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-border)' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <span aria-hidden="true" style={{ fontSize: '1.2rem' }}>ℹ️</span>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>
            <strong>Local Progress:</strong> Your ratings and study history are stored on this browser only. Resetting or clearing site data will reset these totals.
          </div>
        </div>
      </div>
    </section>
  );
}
