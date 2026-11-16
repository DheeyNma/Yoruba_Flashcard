import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';
import SettingsScreen from '../screens/SettingsScreen';
import {
  clearAllLearningProgress,
  saveRating,
  getRatings,
  markWordStudied,
  getStudiedWordIds,
} from '../utils/storage';

describe('Settings, Storage Disclaimer, and Confirmed Reset', () => {
  beforeEach(() => {
    clearAllLearningProgress();
  });

  it('displays local-only storage notice on Settings and Progress screens', () => {
    render(<App />);

    // Check Settings view
    const settingsBtn = screen.getByRole('button', { name: /Settings and Preferences/i });
    fireEvent.click(settingsBtn);

    expect(screen.getByText(/Reset Learning Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear all studied and known word ratings from this browser/i)).toBeInTheDocument();

    // Check Progress view
    const progressTab = screen.getByRole('button', { name: 'Progress' });
    fireEvent.click(progressTab);
    expect(screen.getByText(/Local Progress Storage:/i)).toBeInTheDocument();
    expect(screen.getByText(/No account is required/i)).toBeInTheDocument();
  });

  it('requires confirmation to reset progress, and Cancel preserves existing records', () => {
    // Seed some progress
    saveRating('beg-greet-001', 'known');
    markWordStudied('beg-greet-001');

    render(
      <SettingsScreen
        onResetProgress={() => clearAllLearningProgress()}
      />
    );

    // Click "Reset Progress..."
    const resetTrigger = screen.getByRole('button', { name: /Reset Progress…/i });
    fireEvent.click(resetTrigger);

    // Confirmation dialog appears
    expect(screen.getByText(/Are you sure\? This will delete all your local progress records\./i)).toBeInTheDocument();

    // Click "Cancel"
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    // Records must still exist intact
    expect(getRatings()['beg-greet-001']).toBe('known');
    expect(getStudiedWordIds()).toContain('beg-greet-001');
  });

  it('clears all learning records when confirmed in reset dialog', () => {
    saveRating('beg-greet-001', 'known');
    markWordStudied('beg-greet-001');

    render(
      <SettingsScreen
        onResetProgress={() => clearAllLearningProgress()}
      />
    );

    // Trigger reset confirmation
    fireEvent.click(screen.getByRole('button', { name: /Reset Progress…/i }));

    // Confirm deletion
    const confirmBtn = screen.getByRole('button', { name: /Yes, Reset Everything/i });
    fireEvent.click(confirmBtn);

    // Records must now be completely empty
    expect(getRatings()).toEqual({});
    expect(getStudiedWordIds()).toEqual([]);
  });

  it('toggles and persists sound and direction preferences', () => {
    let currentDir = 'yoruba-to-english';
    let currentSound = true;

    const { rerender } = render(
      <SettingsScreen
        cardDirection={currentDir}
        onUpdateCardDirection={(dir) => {
          currentDir = dir;
        }}
        soundEnabled={currentSound}
        onToggleSound={(snd) => {
          currentSound = snd;
        }}
      />
    );

    // Toggle sound button
    const soundBtn = screen.getByRole('button', { name: 'On' });
    fireEvent.click(soundBtn);
    expect(currentSound).toBe(false);

    // Switch direction to English -> Yoruba
    const engRadio = screen.getByDisplayValue('english-to-yoruba');
    fireEvent.click(engRadio);
    expect(currentDir).toBe('english-to-yoruba');
  });
});

