import React from 'react';

export default function PracticeScreen({ onNavigate }) {
  return (
    <section className="screen-container" aria-labelledby="practice-title">
      <header className="screen-header">
        <h1 id="practice-title" className="screen-title">Practice & Quizzes</h1>
        <p className="screen-subtitle">
          Test your vocabulary recall with multiple-choice questions.
        </p>
      </header>

      <div className="card empty-state">
        <span className="empty-state-icon" aria-hidden="true">✏️</span>
        <h2 className="empty-state-title">Ready to test yourself?</h2>
        <p className="empty-state-text">
          Quizzes test words you have already studied. Study a few flashcard categories first, then return here to test your recall.
        </p>
        <button
          type="button"
          className="primary-button"
          onClick={() => onNavigate('learn')}
          style={{ marginTop: '0.75rem' }}
        >
          Study Vocabulary First →
        </button>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>How Quizzes Work</h3>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
          <li>Questions are drawn strictly from reviewed vocabulary.</li>
          <li>Never fabricates fake or misleading distractor options.</li>
          <li>Review any missed words immediately after completing each quiz.</li>
        </ul>
      </div>
    </section>
  );
}

