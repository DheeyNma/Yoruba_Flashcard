import React, { useState, useEffect } from 'react';
import sampleVocabulary from '../data/vocabulary.json';
import { calculateProgress, getLastLesson } from '../utils/storage';

export default function HomeScreen({ onNavigate, onResumeLesson }) {
  const [progress, setProgress] = useState(() => calculateProgress(sampleVocabulary));
  const [lastLesson, setLastLesson] = useState(() => getLastLesson());

  useEffect(() => {
    setProgress(calculateProgress(sampleVocabulary));
    setLastLesson(getLastLesson());
  }, []);

  const handleContinue = () => {
    if (lastLesson && lastLesson.category) {
      if (onResumeLesson) {
        onResumeLesson(lastLesson.category, lastLesson.level, lastLesson.cardIndex);
      }
      onNavigate('flashcards');
    } else {
      onNavigate('learn');
    }
  };

  return (
    <section className="screen-container" aria-labelledby="home-title">
      <header className="screen-header">
        <span className="gold-badge">Beginner Level</span>
        <h1 id="home-title" className="screen-title" style={{ marginTop: '0.5rem' }}>
          Ẹ ǹlẹ́ o!
        </h1>
        <p className="screen-subtitle">
          Welcome to Kọ́ Yorùbá. Master authentic vocabulary, tone marks, and pronunciations.
        </p>
      </header>

      {/* Progress Counters (Real calculated stats) */}
      <div className="card">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Your Progress</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          Saved on this browser and device.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
          <div style={{ padding: '0.75rem 0.5rem', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {progress.wordsStudied}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Studied
            </div>
          </div>
          <div style={{ padding: '0.75rem 0.5rem', backgroundColor: 'var(--color-gold-light)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#7b5808' }}>
              {progress.wordsKnown}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Known
            </div>
          </div>
          <div style={{ padding: '0.75rem 0.5rem', backgroundColor: '#eef2f7', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2c3e50' }}>
              {progress.completedCategoriesCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Completed
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Action Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.1rem' }}>
          {lastLesson ? 'Continue Where You Left Off' : 'Ready to Start?'}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          {lastLesson ? (
            <span>
              Resume studying <strong>{lastLesson.category}</strong> ({lastLesson.level} level), Card {lastLesson.cardIndex + 1}.
            </span>
          ) : (
            'Start by exploring greetings and everyday vocabulary.'
          )}
        </p>
        <button
          type="button"
          className="primary-button"
          onClick={handleContinue}
          style={{ width: '100%', fontSize: '1rem', padding: '0.75rem' }}
          aria-label={
            lastLesson
              ? `Continue learning ${lastLesson.category} in ${lastLesson.level}`
              : 'Start learning now'
          }
        >
          {lastLesson ? 'Continue Learning →' : 'Start Learning Now →'}
        </button>
      </div>

      {/* Suggested Starter Categories */}
      <div className="card">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Popular Categories</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              if (onResumeLesson) onResumeLesson('greetings', 'beginner', 0);
              onNavigate('flashcards');
            }}
            style={{ justifyContent: 'space-between', width: '100%' }}
          >
            <span>👋 Greetings (Ìkíni)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>5 words</span>
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              if (onResumeLesson) onResumeLesson('numbers', 'beginner', 0);
              onNavigate('flashcards');
            }}
            style={{ justifyContent: 'space-between', width: '100%' }}
          >
            <span>🔢 Numbers (Àwọn Nọ́ḿbà)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>3 words</span>
          </button>
        </div>
      </div>
    </section>
  );
}
