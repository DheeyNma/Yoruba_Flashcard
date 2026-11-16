import { describe, it, expect } from 'vitest';
import { generateQuiz } from '../utils/quiz';
import sampleVocabulary from '../data/vocabulary.json';

describe('Quiz Generation Engine', () => {
  it('generates questions with one verified correct answer and unique distractors', () => {
    const questions = generateQuiz(sampleVocabulary, { limit: 5 });

    expect(questions.length).toBeGreaterThan(0);
    expect(questions.length).toBeLessThanOrEqual(5);

    questions.forEach((q) => {
      // Must have yoruba prompt and pronunciation
      expect(q.yoruba).toBeTruthy();
      expect(q.pronunciation).toBeTruthy();
      expect(q.correctAnswer).toBeTruthy();

      // Choices array must include the correct answer
      expect(q.choices).toContain(q.correctAnswer);

      // Choices must be unique
      const uniqueChoices = new Set(q.choices);
      expect(uniqueChoices.size).toBe(q.choices.length);

      // Distractor choices must come strictly from existing vocabulary meanings (no invented words)
      const allMeanings = new Set(sampleVocabulary.map((w) => w.english));
      q.choices.forEach((choice) => {
        expect(allMeanings.has(choice)).toBe(true);
      });
    });
  });

  it('filters questions by category when specified', () => {
    const categoryQuestions = generateQuiz(sampleVocabulary, {
      category: 'greetings',
      limit: 3,
    });

    const greetingWordIds = sampleVocabulary
      .filter((w) => w.category === 'greetings')
      .map((w) => w.id);

    categoryQuestions.forEach((q) => {
      expect(greetingWordIds).toContain(q.wordId);
    });
  });

  it('handles small categories without crashing or inventing words', () => {
    const smallQuestions = generateQuiz(sampleVocabulary, {
      category: 'household', // has 2 words
      limit: 5,
    });

    expect(smallQuestions.length).toBe(2);
    smallQuestions.forEach((q) => {
      expect(q.choices.length).toBeGreaterThanOrEqual(2);
    });
  });
});
