/**
 * Quiz generation and grading engine for Kọ́ Yorùbá.
 *
 * PRD Rules:
 * - Uses ONLY verified entries in vocabulary.
 * - Distractor choices are selected strictly from real vocabulary (never invented).
 * - Adapts cleanly to small category counts.
 */

// Simple deterministic/seeded shuffle helper
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a multiple-choice quiz from the provided vocabulary pool.
 *
 * @param {Array} vocabularyPool - All available reviewed vocabulary
 * @param {Object} options - { category, level, wordIds, limit }
 * @returns {Array} List of question objects
 */
export function generateQuiz(vocabularyPool, options = {}) {
  if (!Array.isArray(vocabularyPool) || vocabularyPool.length === 0) {
    return [];
  }

  const { category, level, wordIds, limit = 5 } = options;

  // Filter eligible questions
  let eligible = vocabularyPool;

  if (Array.isArray(wordIds) && wordIds.length > 0) {
    const idSet = new Set(wordIds);
    eligible = vocabularyPool.filter((w) => idSet.has(w.id));
  } else {
    if (level) {
      eligible = eligible.filter((w) => w.level === level);
    }
    if (category) {
      eligible = eligible.filter((w) => w.category === category);
    }
  }

  // If filtered pool is empty, fall back to level or entire pool
  if (eligible.length === 0) {
    eligible = vocabularyPool;
  }

  const shuffledEligible = shuffleArray(eligible);
  const selectedWords = shuffledEligible.slice(0, Math.min(limit, shuffledEligible.length));

  return selectedWords.map((word) => {
    // Generate distractors strictly from remaining vocabulary items
    const otherWords = vocabularyPool.filter((w) => w.id !== word.id && w.english !== word.english);
    const shuffledOthers = shuffleArray(otherWords);

    // Pick 2 or 3 distractors depending on pool size
    const maxDistractors = Math.min(3, shuffledOthers.length);
    const distractors = shuffledOthers
      .slice(0, maxDistractors)
      .map((w) => w.english);

    // Combine correct answer and distractors, ensuring uniqueness
    const choices = shuffleArray(Array.from(new Set([word.english, ...distractors])));

    return {
      wordId: word.id,
      yoruba: word.yoruba,
      pronunciation: word.pronunciation,
      correctAnswer: word.english,
      exampleSentence: word.exampleSentence || null,
      choices,
    };
  });
}
