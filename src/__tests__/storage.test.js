import { describe, it, expect, beforeEach } from 'vitest';
import {
  getRatings,
  saveRating,
  getStudiedWordIds,
  markWordStudied,
  getLastLesson,
  saveLastLesson,
  calculateProgress,
  clearAllLearningProgress,
} from '../utils/storage';

const mockVocabulary = [
  { id: 'w1', level: 'beginner', category: 'greetings' },
  { id: 'w2', level: 'beginner', category: 'greetings' },
  { id: 'w3', level: 'beginner', category: 'numbers' },
  { id: 'w4', level: 'intermediate', category: 'household' },
];

describe('Storage and Progress Calculation', () => {
  beforeEach(() => {
    clearAllLearningProgress();
  });

  it('saves and retrieves ratings correctly', () => {
    expect(getRatings()).toEqual({});

    saveRating('w1', 'known');
    expect(getRatings()['w1']).toBe('known');

    // Change rating to 'again'
    saveRating('w1', 'again');
    expect(getRatings()['w1']).toBe('again');

    saveRating('w2', 'known');
    expect(getRatings()['w2']).toBe('known');
  });

  it('marks words as studied without duplicate entries', () => {
    expect(getStudiedWordIds()).toEqual([]);

    markWordStudied('w1');
    markWordStudied('w1');
    markWordStudied('w2');

    const studied = getStudiedWordIds();
    expect(studied).toHaveLength(2);
    expect(studied).toContain('w1');
    expect(studied).toContain('w2');
  });

  it('saves and retrieves last lesson location', () => {
    expect(getLastLesson()).toBeNull();

    saveLastLesson({ level: 'beginner', category: 'greetings', cardIndex: 2 });
    const saved = getLastLesson();
    expect(saved.level).toBe('beginner');
    expect(saved.category).toBe('greetings');
    expect(saved.cardIndex).toBe(2);
  });

  it('calculates progress accurately according to PRD definitions', () => {
    // Reveal w1 and w2 (both words in greetings)
    markWordStudied('w1');
    markWordStudied('w2');
    saveRating('w1', 'known');
    saveRating('w2', 'again');

    const progress = calculateProgress(mockVocabulary);
    expect(progress.totalWords).toBe(4);
    expect(progress.wordsStudied).toBe(2);
    expect(progress.wordsKnown).toBe(1);
    expect(progress.wordsAgain).toBe(1);

    // greetings category should be completed because both w1 and w2 were studied
    const greetingsCategory = progress.categories.find(
      (c) => c.level === 'beginner' && c.category === 'greetings'
    );
    expect(greetingsCategory.isCompleted).toBe(true);
    expect(greetingsCategory.studied).toBe(2);
    expect(greetingsCategory.total).toBe(2);

    // numbers category should not be completed
    const numbersCategory = progress.categories.find(
      (c) => c.level === 'beginner' && c.category === 'numbers'
    );
    expect(numbersCategory.isCompleted).toBe(false);
    expect(numbersCategory.studied).toBe(0);

    expect(progress.completedCategoriesCount).toBe(1);
  });

  it('clears all progress upon reset', () => {
    markWordStudied('w1');
    saveRating('w1', 'known');
    saveLastLesson({ level: 'beginner', category: 'greetings', cardIndex: 0 });

    clearAllLearningProgress();

    expect(getRatings()).toEqual({});
    expect(getStudiedWordIds()).toEqual([]);
    expect(getLastLesson()).toBeNull();
  });
});

