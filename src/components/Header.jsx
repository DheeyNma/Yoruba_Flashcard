import React from 'react';

export default function Header({ currentScreen, onNavigate }) {
  return (
    <header className="app-header" role="banner">
      <button
        type="button"
        className="app-header-title"
        onClick={() => onNavigate('home')}
        aria-label="Kọ́ Yorùbá — Return to Home"
        style={{ border: 'none', background: 'none', padding: 0 }}
      >
        <span>Kọ́ Yorùbá</span>
        <span className="tagline">Learn Yoruba</span>
      </button>

      <div className="app-header-actions">
        <button
          type="button"
          className={`icon-button ${currentScreen === 'settings' ? 'active' : ''}`}
          onClick={() => onNavigate('settings')}
          aria-label="Settings and Preferences"
          title="Settings"
        >
          <span aria-hidden="true" style={{ fontSize: '1.2rem' }}>⚙️</span>
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
}

