import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LearnScreen from '../screens/LearnScreen';

describe('Learn Screen Levels and Categories', () => {
  it('displays Beginner, Intermediate, and Advanced without unnecessary locking', () => {
    render(<LearnScreen onNavigate={() => {}} onSelectCategory={() => {}} />);

    const beginnerTab = screen.getByRole('tab', { name: /Beginner/i });
    const intermediateTab = screen.getByRole('tab', { name: /Intermediate/i });
    const advancedTab = screen.getByRole('tab', { name: /Advanced/i });

    expect(beginnerTab).toBeInTheDocument();
    expect(intermediateTab).toBeInTheDocument();
    expect(advancedTab).toBeInTheDocument();

    // Intermediate and Advanced can be clicked directly without any lock restrictions
    fireEvent.click(intermediateTab);
    expect(screen.getByText(/Intermediate Level/i)).toBeInTheDocument();

    fireEvent.click(advancedTab);
    expect(screen.getByText(/Advanced Level/i)).toBeInTheDocument();
  });

  it('displays categories and vocabulary counts matching the actual data', () => {
    render(<LearnScreen onNavigate={() => {}} onSelectCategory={() => {}} />);

    // In Beginner: Greetings has 5 words, Numbers has 3, Family has 3, Food has 2
    expect(screen.getByRole('heading', { name: /greetings/i })).toBeInTheDocument();
    expect(screen.getByText(/0 of 5 studied/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /numbers/i })).toBeInTheDocument();
    // Both numbers and family have 3 words
    expect(screen.getAllByText(/0 of 3 studied/i).length).toBe(2);

    // Switch to Intermediate
    fireEvent.click(screen.getByRole('tab', { name: /Intermediate/i }));
    expect(screen.getByRole('heading', { name: /household/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /actions/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /transportation/i })).toBeInTheDocument();
  });

  it('calls onSelectCategory and onNavigate when Study button is clicked', () => {
    let chosenCategory = null;
    let chosenLevel = null;
    let navigatedScreen = null;

    render(
      <LearnScreen
        onNavigate={(screen) => {
          navigatedScreen = screen;
        }}
        onSelectCategory={(cat, lvl) => {
          chosenCategory = cat;
          chosenLevel = lvl;
        }}
      />
    );

    const studyGreetingBtn = screen.getByRole('button', {
      name: /Study greetings in beginner/i,
    });
    fireEvent.click(studyGreetingBtn);

    expect(chosenCategory).toBe('greetings');
    expect(chosenLevel).toBe('beginner');
    expect(navigatedScreen).toBe('flashcards');
  });
});
