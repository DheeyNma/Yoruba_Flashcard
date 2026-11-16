import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App Shell & Navigation', () => {
  it('renders the Home view by default with welcome header', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Ẹ ǹlẹ́ o!/i })).toBeInTheDocument();
    expect(screen.getByText(/Welcome to Kọ́ Yorùbá/i)).toBeInTheDocument();
  });

  it('navigates to Learn screen when Learn tab is clicked', () => {
    render(<App />);
    const learnTab = screen.getByRole('button', { name: 'Learn' });
    fireEvent.click(learnTab);

    expect(screen.getByRole('heading', { name: /Learn Vocabulary/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Beginner/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Intermediate/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Advanced/i })).toBeInTheDocument();
  });

  it('navigates to Practice screen when Practice tab is clicked', () => {
    render(<App />);
    const practiceTab = screen.getByRole('button', { name: 'Practice' });
    fireEvent.click(practiceTab);

    expect(screen.getByRole('heading', { name: /Practice & Quizzes/i })).toBeInTheDocument();
    expect(screen.getByText(/Ready to test yourself\?/i)).toBeInTheDocument();
  });

  it('navigates to Progress screen when Progress tab is clicked', () => {
    render(<App />);
    const progressTab = screen.getByRole('button', { name: 'Progress' });
    fireEvent.click(progressTab);

    expect(screen.getByRole('heading', { name: /Your Progress/i })).toBeInTheDocument();
    expect(screen.getAllByText(/studied/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/known/i).length).toBeGreaterThan(0);
  });

  it('navigates to Settings when Settings button in header is clicked', () => {
    render(<App />);
    const settingsButton = screen.getByRole('button', { name: /Settings and Preferences/i });
    fireEvent.click(settingsButton);

    expect(screen.getByRole('heading', { name: /Settings & Preferences/i })).toBeInTheDocument();
    expect(screen.getByText(/Flashcard Direction/i)).toBeInTheDocument();
    expect(screen.getByText(/Audio Pronunciation/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset Learning Progress/i)).toBeInTheDocument();
  });

  it('switches to flashcards screen from Learn screen and allows flipping', () => {
    render(<App />);
    // Navigate to Learn
    fireEvent.click(screen.getByRole('button', { name: 'Learn' }));

    // Click "Study →" on the first category
    const studyButtons = screen.getAllByRole('button', { name: /Study/i });
    expect(studyButtons.length).toBeGreaterThan(0);
    fireEvent.click(studyButtons[0]);

    // Now on flashcards screen showing cards
    expect(screen.getByText(/Card 1 of /i)).toBeInTheDocument();
    const flashcard = screen.getByRole('button', { name: /Flashcard:/i });
    expect(flashcard).toBeInTheDocument();

    // Flip card
    fireEvent.click(flashcard);
    expect(screen.getByText(/Tap card to show prompt/i)).toBeInTheDocument();
  });
});

