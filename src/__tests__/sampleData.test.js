import { describe, it, expect } from 'vitest';
import sampleVocabulary from '../data/vocabulary.json';

describe('Sample Vocabulary Content and Tone Marks', () => {
  it('contains entries across beginner, intermediate, and advanced levels', () => {
    const levels = new Set(sampleVocabulary.map((item) => item.level));
    expect(levels.has('beginner')).toBe(true);
    expect(levels.has('intermediate')).toBe(true);
    expect(levels.has('advanced')).toBe(true);
  });

  it('matches expected sample counts by level and category', () => {
    const beginnerItems = sampleVocabulary.filter((i) => i.level === 'beginner');
    const intermediateItems = sampleVocabulary.filter((i) => i.level === 'intermediate');
    const advancedItems = sampleVocabulary.filter((i) => i.level === 'advanced');

    expect(beginnerItems.length).toBe(13);
    expect(intermediateItems.length).toBe(6);
    expect(advancedItems.length).toBe(5);

    // Verify categories
    const categories = new Set(sampleVocabulary.map((i) => i.category));
    expect(categories.has('greetings')).toBe(true);
    expect(categories.has('numbers')).toBe(true);
    expect(categories.has('family')).toBe(true);
    expect(categories.has('food')).toBe(true);
    expect(categories.has('household')).toBe(true);
    expect(categories.has('actions')).toBe(true);
    expect(categories.has('transportation')).toBe(true);
    expect(categories.has('culture')).toBe(true);
    expect(categories.has('emotions')).toBe(true);
    expect(categories.has('expressions')).toBe(true);
  });

  it('preserves Yoruba special characters and tone marks without normalization', () => {
    // Specifically test for special letters: ẹ, ọ, ṣ and accents like acute (´) and grave (`)
    const allYorubaText = sampleVocabulary.map((i) => i.yoruba).join(' ');

    const hasSpecialOrTonedChars = /[áàéèẹ́ẹ̀íìóòọ́ọ̀úùṣ]/.test(allYorubaText);
    expect(hasSpecialOrTonedChars).toBe(true);

    // Specific known entries
    const greeting = sampleVocabulary.find((i) => i.id === 'beg-greet-001');
    expect(greeting.yoruba).toBe('Báwo ni');

    const afternoon = sampleVocabulary.find((i) => i.id === 'beg-greet-002');
    expect(afternoon.yoruba).toContain('Ẹ');

    const culture = sampleVocabulary.find((i) => i.id === 'adv-cul-001');
    expect(culture.yoruba).toBe('Àṣà');
  });

  it('flags entries awaiting audio honestly with unrecorded status', () => {
    sampleVocabulary.forEach((item) => {
      expect(['unrecorded', 'pending_review', 'verified']).toContain(item.audioStatus);
      if (item.audioStatus === 'unrecorded') {
        expect(item.audioUrl).toBeNull();
      }
    });
  });
});

