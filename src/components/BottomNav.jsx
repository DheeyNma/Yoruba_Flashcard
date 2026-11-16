import React from 'react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'learn', label: 'Learn', icon: '📚' },
  { id: 'practice', label: 'Practice', icon: '✏️' },
  { id: 'progress', label: 'Progress', icon: '📊' },
];

export default function BottomNav({ currentScreen, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Main Navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
          >
            <span className="nav-item-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
            {isActive && <span className="nav-item-indicator" aria-hidden="true" />}
          </button>
        );
      })}
    </nav>
  );
}

