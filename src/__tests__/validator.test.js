import { describe, it, expect } from 'vitest';
import {
  validateVocabularyItem,
  validateVocabularyDataset,
} from '../data/validator';
import sampleVocabulary from '../data/vocabulary.json';

describe('Vocabulary Data Validation', () => {
  it('validates a correct vocabulary item without errors', () => {
    const validItem = {
      id: 'test-001',
      level: 'beginner',
      category: 'greetings',
      yoruba: 'Báwo ni',
      english: 'Hello',
      pronunciation: 'BAH-woh nee',
      audioStatus: 'unrecorded',
    };
    const errors = validateVocabularyItem(validItem);
    expect(errors).toHaveLength(0);
  });

  it('flags missing required fields', () => {
    const invalidItem = {
      id: 'test-002',
      yoruba: 'Báwo ni',
      // missing level, category, english, pronunciation, audioStatus
    };
    const errors = validateVocabularyItem(invalidItem);
    expect(errors.some((e) => e.includes('level'))).toBe(true);
    expect(errors.some((e) => e.includes('category'))).toBe(true);
    expect(errors.some((e) => e.includes('english'))).toBe(true);
    expect(errors.some((e) => e.includes('pronunciation'))).toBe(true);
    expect(errors.some((e) => e.includes('audioStatus'))).toBe(true);
  });

  it('flags duplicate IDs in a dataset', () => {
    const duplicateData = [
      {
        id: 'dup-001',
        level: 'beginner',
        category: 'greetings',
        yoruba: 'Báwo ni',
        english: 'Hello',
        pronunciation: 'BAH-woh nee',
        audioStatus: 'unrecorded',
      },
      {
        id: 'dup-001',
        level: 'beginner',
        category: 'greetings',
        yoruba: 'Ẹ káàsán',
        english: 'Good afternoon',
        pronunciation: 'Eh KAH-ah-sahn',
        audioStatus: 'unrecorded',
      },
    ];
    const result = validateVocabularyDataset(duplicateData);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].errors.some((e) => e.includes('Duplicate ID'))).toBe(true);
  });

  it('flags invalid levels', () => {
    const invalidLevelItem = {
      id: 'test-003',
      level: 'expert', // invalid
      category: 'greetings',
      yoruba: 'Báwo ni',
      english: 'Hello',
      pronunciation: 'BAH-woh nee',
      audioStatus: 'unrecorded',
    };
    const errors = validateVocabularyItem(invalidLevelItem);
    expect(errors.some((e) => e.includes('Invalid level'))).toBe(true);
  });

  it('validates that the sample vocabulary JSON dataset is 100% valid', () => {
    const result = validateVocabularyDataset(sampleVocabulary);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.totalEntries).toBeGreaterThan(0);
  });
});

