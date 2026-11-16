import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

export default function AppShell({ currentScreen, onNavigate, children }) {
  return (
    <div className="app-container">
      <Header currentScreen={currentScreen} onNavigate={onNavigate} />
      <main className="app-main" id="main-content" role="main">
        {children}
      </main>
      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}

