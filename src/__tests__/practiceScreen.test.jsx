import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import PracticeScreen from '../screens/PracticeScreen';
import { clearAllLearningProgress, getQuizResults } from '../utils/storage';

describe('Practice & Quiz Screen Workflow', () => {
  beforeEach(() => {
    clearAllLearningProgress();
  });

  it('allows starting a quiz and displays the first question', () => {
    render(<PracticeScreen onNavigate={() => {}} onStudyWords={() => {}} />);

    const startBtn = screen.getByRole('button', { name: /Start Quiz/i });
    fireEvent.click(startBtn);

    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Choose the Meaning/i })).toBeInTheDocument();
  });

  it('provides instant feedback on answer selection and calculates score', () => {
    render(<PracticeScreen onNavigate={() => {}} onStudyWords={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }));

    // Find all choice buttons
    const choiceButtons = screen.getAllByRole('button', { name: /^[A-D]\./i });
    expect(choiceButtons.length).toBeGreaterThanOrEqual(2);

    // Click the first choice
    fireEvent.click(choiceButtons[0]);

    // Answer feedback should now be visible (either correct or incorrect)
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Next button should be enabled
    const nextBtn = screen.getByRole('button', { name: /Next Question|See Results/i });
    expect(nextBtn).toBeInTheDocument();
  });

  it('saves quiz results and displays missed words review at the end', () => {
    let studiedWordsList = null;
    let navigatedScreen = null;

    render(
      <PracticeScreen
        onNavigate={(screen) => {
          navigatedScreen = screen;
        }}
        onStudyWords={(words) => {
          studiedWordsList = words;
        }}
      />
    );

    // Start greetings quiz (5 questions)
    const select = screen.getByLabelText(/Select Topic:/i);
    fireEvent.change(select, { target: { value: 'greetings' } });
    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }));

    // Answer all 5 questions
    for (let i = 0; i < 5; i++) {
      const choiceButtons = screen.getAllByRole('button', { name: /^[A-D]\./i });
      fireEvent.click(choiceButtons[0]);

      const advanceBtn = screen.getByRole('button', { name: /Next Question|See Results/i });
      fireEvent.click(advanceBtn);
    }

    // Now on Results screen
    expect(screen.getByRole('heading', { name: /Quiz Results/i })).toBeInTheDocument();
    expect(screen.getByText(/% Score/i)).toBeInTheDocument();

    // Result should be saved in storage
    const savedResults = getQuizResults();
    expect(savedResults.length).toBe(1);
    expect(savedResults[0].total).toBe(5);

    // If any words were missed, test the review button
    const reviewBtn = screen.queryByRole('button', { name: /Study in Flashcards/i });
    if (reviewBtn) {
      fireEvent.click(reviewBtn);
      expect(studiedWordsList.length).toBeGreaterThan(0);
      expect(navigatedScreen).toBe('flashcards');
    }
  });
});

