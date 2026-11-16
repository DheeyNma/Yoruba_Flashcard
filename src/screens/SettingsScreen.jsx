import React, { useState } from 'react';

export default function SettingsScreen({
  cardDirection = 'yoruba-to-english',
  onUpdateCardDirection,
  soundEnabled = true,
  onToggleSound,
  onResetProgress,
}) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleReset = () => {
    if (onResetProgress) {
      onResetProgress();
    }
    setShowConfirmReset(false);
    setResetMessage('All saved progress has been reset.');
    setTimeout(() => setResetMessage(''), 4000);
  };

  return (
    <section className="screen-container" aria-labelledby="settings-title">
      <header className="screen-header">
        <h1 id="settings-title" className="screen-title">Settings & Preferences</h1>
        <p className="screen-subtitle">Customize your flashcard study experience.</p>
      </header>

      {resetMessage && (
        <div
          role="status"
          className="card"
          style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: 600 }}
        >
          ✓ {resetMessage}
        </div>
      )}

      {/* Flashcard Direction Preference */}
      <div className="card">
        <h2 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Flashcard Direction</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
          Select which language appears first on the front of flashcards.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="cardDirection"
              value="yoruba-to-english"
              checked={cardDirection === 'yoruba-to-english'}
              onChange={() => onUpdateCardDirection && onUpdateCardDirection('yoruba-to-english')}
            />
            <span><strong>Yorùbá → English</strong> (Recommended for vocabulary recognition)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="cardDirection"
              value="english-to-yoruba"
              checked={cardDirection === 'english-to-yoruba'}
              onChange={() => onUpdateCardDirection && onUpdateCardDirection('english-to-yoruba')}
            />
            <span><strong>English → Yorùbá</strong> (Active recall & tone practice)</span>
          </label>
        </div>
      </div>

      {/* Sound Preference */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem' }}>Audio Pronunciation</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Enable playback controls for verified native speaker audio clips.
            </p>
          </div>
          <button
            type="button"
            className={soundEnabled ? 'primary-button' : 'secondary-button'}
            onClick={() => onToggleSound && onToggleSound(!soundEnabled)}
            aria-pressed={soundEnabled}
            style={{ minWidth: '70px', padding: '0.4rem 0.8rem' }}
          >
            {soundEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {/* Reset Saved Progress */}
      <div className="card" style={{ borderColor: 'var(--color-border)' }}>
        <h2 style={{ fontSize: '1.05rem', color: 'var(--color-danger)', marginBottom: '0.25rem' }}>
          Reset Learning Progress
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
          Clear all studied and known word ratings from this browser. This action cannot be undone.
        </p>

        {!showConfirmReset ? (
          <button
            type="button"
            className="secondary-button"
            onClick={() => setShowConfirmReset(true)}
            style={{ color: 'var(--color-danger)', backgroundColor: 'var(--color-danger-light)' }}
          >
            Reset Progress…
          </button>
        ) : (
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-danger-light)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-danger)' }}>
              Are you sure? This will delete all your local progress records.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="primary-button"
                onClick={handleReset}
                style={{ backgroundColor: 'var(--color-danger)', fontSize: '0.85rem' }}
              >
                Yes, Reset Everything
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowConfirmReset(false)}
                style={{ fontSize: '0.85rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

