import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import FlashcardsScreen from '../screens/FlashcardsScreen';
import { clearAllLearningProgress, getRatings, getLastLesson, getStudiedWordIds } from '../utils/storage';

describe('Interactive Flashcards Screen', () => {
  beforeEach(() => {
    clearAllLearningProgress();
  });

  it('shows one flashcard at a time with correct position and total', () => {
    render(
      <FlashcardsScreen
        selectedCategory="greetings"
        selectedLevel="beginner"
        cardDirection="yoruba-to-english"
      />
    );

    // Greetings has 5 words
    expect(screen.getByText(/Card 1 of 5/i)).toBeInTheDocument();
    // First card word is Báwo ni
    expect(screen.getByText('Báwo ni')).toBeInTheDocument();
  });

  it('hides the answer until flipped by click or keyboard', () => {
    render(
      <FlashcardsScreen
        selectedCategory="greetings"
        selectedLevel="beginner"
        cardDirection="yoruba-to-english"
      />
    );

    // Front should show Yoruba word
    expect(screen.getByText('Báwo ni')).toBeInTheDocument();
    // Answer (English meaning "Hello / How are things?") should not be revealed yet
    expect(screen.queryByText(/Hello \/ How are things\?/i)).not.toBeInTheDocument();

    // Click to flip
    const card = screen.getByRole('button', { name: /Flashcard: Báwo ni/i });
    fireEvent.click(card);

    // Now answer is revealed
    expect(screen.getByText(/Hello \/ How are things\?/i)).toBeInTheDocument();

    // Word should now be recorded as studied
    expect(getStudiedWordIds()).toContain('beg-greet-001');

    // Flip back using Enter key
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('Báwo ni')).toBeInTheDocument();
    expect(screen.queryByText(/Hello \/ How are things\?/i)).not.toBeInTheDocument();
  });

  it('switches direction between Yoruba → English and English → Yoruba and resets to front', () => {
    let currentDirection = 'yoruba-to-english';
    const handleUpdate = (newDir) => {
      currentDirection = newDir;
    };

    const { rerender } = render(
      <FlashcardsScreen
        selectedCategory="greetings"
        selectedLevel="beginner"
        cardDirection={currentDirection}
        onUpdateCardDirection={handleUpdate}
      />
    );

    // In yoruba-to-english front shows Yoruba
    expect(screen.getByText('Báwo ni')).toBeInTheDocument();

    // Flip card to reveal answer
    const card = screen.getByRole('button', { name: /Flashcard: Báwo ni/i });
    fireEvent.click(card);
    expect(screen.getByText(/Hello \/ How are things\?/i)).toBeInTheDocument();

    // Click direction toggle
    const toggleButton = screen.getByRole('button', { name: /Switch direction/i });
    fireEvent.click(toggleButton);
    expect(currentDirection).toBe('english-to-yoruba');

    // Rerender with new direction
    rerender(
      <FlashcardsScreen
        selectedCategory="greetings"
        selectedLevel="beginner"
        cardDirection="english-to-yoruba"
        onUpdateCardDirection={handleUpdate}
      />
    );

    // Front must now show English and card must be reset to front (not showing Yoruba answer yet)
    expect(screen.getByText(/Hello \/ How are things\?/i)).toBeInTheDocument();
    expect(screen.queryByText('Báwo ni')).not.toBeInTheDocument();
  });

  it('displays written pronunciation guide and shows honest disabled audio state', () => {
    render(
      <FlashcardsScreen
        selectedCategory="greetings"
        selectedLevel="beginner"
        cardDirection="yoruba-to-english"
      />
    );

    // Written pronunciation guide
    expect(screen.getByText(/BAH-woh nee/i)).toBeInTheDocument();

    // Audio button should indicate honest disabled state
    const audioBtn = screen.getByRole('button', { name: /Audio: Awaiting recording/i });
    expect(audioBtn).toHaveAttribute('aria-disabled', 'true');

    // Clicking the audio button should show the honest native speaker notice
    fireEvent.click(audioBtn);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('updates ratings when clicking "I know this" and "Learn again"', () => {
    render(
      <FlashcardsScreen
        selectedCategory="greetings"
        selectedLevel="beginner"
        cardDirection="yoruba-to-english"
      />
    );

    // Rate "I know this" on first word
    const knowBtn = screen.getByRole('button', { name: /Mark as known: I know this/i });
    fireEvent.click(knowBtn);

    const ratings = getRatings();
    expect(ratings['beg-greet-001']).toBe('known');

    // Card should advance to next card (Card 2 of 5: Ẹ káàsán)
    expect(screen.getByText(/Card 2 of 5/i)).toBeInTheDocument();
    expect(screen.getByText('Ẹ káàsán')).toBeInTheDocument();

    // Rate "Learn again" on second word
    const againBtn = screen.getByRole('button', { name: /Mark for review: Learn again/i });
    fireEvent.click(againBtn);

    const updatedRatings = getRatings();
    expect(updatedRatings['beg-greet-002']).toBe('again');
  });

  it('persists last study location in localStorage', () => {
    render(
      <FlashcardsScreen
        selectedCategory="numbers"
        selectedLevel="beginner"
        cardDirection="yoruba-to-english"
      />
    );

    const last = getLastLesson();
    expect(last).not.toBeNull();
    expect(last.category).toBe('numbers');
    expect(last.level).toBe('beginner');
    expect(last.cardIndex).toBe(0);
  });
});



  it('displays category completion screen when rating the final card in a set', () => {
    render(
      <FlashcardsScreen
        selectedCategory="household" // Household has 2 words: Ilé and Ìlẹ̀kùn
        selectedLevel="intermediate"
        cardDirection="yoruba-to-english"
        onNavigate={() => {}}
      />
    );

    // Card 1
    expect(screen.getByText(/Card 1 of 2/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Mark as known: I know this/i }));

    // Card 2 (Last card)
    expect(screen.getByText(/Card 2 of 2/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Mark as known: I know this/i }));

    // Should now show Category Completed view
    expect(screen.getByRole('heading', { name: /Ẹ kú iṣẹ́!/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Study Again from Card 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Take Practice Quiz/i })).toBeInTheDocument();
  });
