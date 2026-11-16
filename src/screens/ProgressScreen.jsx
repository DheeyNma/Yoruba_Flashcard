import React, { useState, useEffect } from 'react';
import sampleVocabulary from '../data/vocabulary.json';
import { calculateProgress } from '../utils/storage';

export default function ProgressScreen({ onNavigate, onResumeLesson, onStudyWords }) {
  const [progress, setProgress] = useState(() => calculateProgress(sampleVocabulary));

  useEffect(() => {
    setProgress(calculateProgress(sampleVocabulary));
  }, []);

  const handleStudyDifficult = () => {
    if (progress.difficultWords && progress.difficultWords.length > 0 && onStudyWords) {
      const ids = progress.difficultWords.map((w) => w.id);
      onStudyWords(ids);
      onNavigate('flashcards');
    }
  };

  return (
    <section className="screen-container" aria-labelledby="progress-title">
      <header className="screen-header">
        <h1 id="progress-title" className="screen-title">Your Progress</h1>
        <p className="screen-subtitle">
          Track studied vocabulary, category completion, and quiz history.
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

      {/* Words to Review (Difficult Words) */}
      {progress.difficultWords && progress.difficultWords.length > 0 && (
        <div className="card" style={{ borderLeft: '4px solid #c0392b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', color: '#c0392b' }}>
                Words to Review ({progress.difficultWords.length})
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Words you marked "Learn again" during flashcard study.
              </p>
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={handleStudyDifficult}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', backgroundColor: '#c0392b' }}
            >
              Study Now →
            </button>
          </div>
        </div>
      )}

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

      {/* Recent Quiz Scores */}
      <div className="card">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Recent Quiz Scores</h2>
        {progress.quizHistory && progress.quizHistory.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {progress.quizHistory.slice(0, 5).map((q) => (
              <div
                key={q.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.6rem 0.75rem',
                  backgroundColor: 'var(--color-bg)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize' }}>
                    {q.category === 'all' ? 'Mixed Quiz' : `${q.category} Quiz`}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {new Date(q.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    className="gold-badge"
                    style={{
                      backgroundColor: q.percentage >= 70 ? 'var(--color-primary-light)' : '#fbeae8',
                      color: q.percentage >= 70 ? 'var(--color-primary)' : '#c0392b',
                      fontSize: '0.85rem',
                    }}
                  >
                    {q.score} / {q.total} ({q.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            No quizzes taken yet. Visit the Practice tab to test your recall!
          </p>
        )}
      </div>

      {/* Local Storage Notice */}
      <div className="card" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-border)' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <span aria-hidden="true" style={{ fontSize: '1.2rem' }}>ℹ️</span>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>
            <strong>Local Progress Storage:</strong> Your ratings, studied words, and quiz results are stored directly in this browser. No account is required.
          </div>
        </div>
      </div>
    </section>
  );
}
