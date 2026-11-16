import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';
import {
  clearAllLearningProgress,
  saveLastLesson,
  markWordStudied,
  saveRating,
} from '../utils/storage';

describe('Home Screen Continue Learning and Progress Totals', () => {
  beforeEach(() => {
    clearAllLearningProgress();
  });

  it('resumes the last lesson and card position via Continue Learning', () => {
    // Seed last lesson in storage
    saveLastLesson({ level: 'beginner', category: 'numbers', cardIndex: 1 });

    render(<App />);

    // Continue Learning button should reference the numbers category
    const continueBtn = screen.getByRole('button', {
      name: /Continue learning numbers in beginner/i,
    });
    expect(continueBtn).toBeInTheDocument();

    fireEvent.click(continueBtn);

    // Should now be on flashcards screen showing card 2 of 3 (Èjì)
    expect(screen.getByText(/Card 2 of 3/i)).toBeInTheDocument();
    expect(screen.getByText('Èjì')).toBeInTheDocument();
  });

  it('updates progress numbers accurately after studying and rating words', () => {
    // Mark 2 words studied, 1 known
    markWordStudied('beg-greet-001');
    markWordStudied('beg-greet-002');
    saveRating('beg-greet-001', 'known');
    saveRating('beg-greet-002', 'again');

    render(<App />);

    // Check Home screen progress display
    expect(screen.getByText('2')).toBeInTheDocument(); // Studied
    expect(screen.getByText('1')).toBeInTheDocument(); // Known

    // Navigate to Progress tab
    const progressTab = screen.getByRole('button', { name: 'Progress' });
    fireEvent.click(progressTab);

    // Verify Progress view values
    expect(screen.getByText('Studied (8%)')).toBeInTheDocument();
    expect(screen.getByText('Known (4%)')).toBeInTheDocument();
  });
});

