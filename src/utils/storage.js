/**
 * Storage utility for Kọ́ Yorùbá.
 * Handles ratings, studied words tracking, quiz scores, and settings using localStorage.
 *
 * PRD definitions:
 * - studied = opened/revealed at least once
 * - known = latest rating is 'known'
 * - category completed = every entry in it has been studied
 */

const STORAGE_KEYS = {
  RATINGS: 'ko_yoruba_ratings',
  STUDIED: 'ko_yoruba_studied',
  LAST_LESSON: 'ko_yoruba_last_lesson',
  CARD_DIRECTION: 'ko_yoruba_card_direction',
  SOUND_ENABLED: 'ko_yoruba_sound_enabled',
  QUIZ_RESULTS: 'ko_yoruba_quiz_results',
};

function safeGet(key, fallback) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    }
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
  }
  return fallback;
}

function safeSet(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.warn(`Error writing ${key} to storage:`, err);
  }
}

/**
 * Returns a map of wordId -> 'known' | 'again'
 */
export function getRatings() {
  return safeGet(STORAGE_KEYS.RATINGS, {});
}

/**
 * Saves or updates a word's rating.
 * Rating is 'known' or 'again'.
 */
export function saveRating(wordId, rating) {
  if (!wordId || (rating !== 'known' && rating !== 'again')) return;
  const ratings = getRatings();
  ratings[wordId] = rating;
  safeSet(STORAGE_KEYS.RATINGS, ratings);
}

/**
 * Returns an array of word IDs that have been revealed/flipped at least once.
 */
export function getStudiedWordIds() {
  return safeGet(STORAGE_KEYS.STUDIED, []);
}

/**
 * Marks a word as studied (opened/revealed).
 */
export function markWordStudied(wordId) {
  if (!wordId) return;
  const studied = new Set(getStudiedWordIds());
  if (!studied.has(wordId)) {
    studied.add(wordId);
    safeSet(STORAGE_KEYS.STUDIED, Array.from(studied));
  }
}

/**
 * Returns the last lesson location: { level, category, cardIndex }
 */
export function getLastLesson() {
  return safeGet(STORAGE_KEYS.LAST_LESSON, null);
}

/**
 * Saves the last lesson location.
 */
export function saveLastLesson(location) {
  if (!location) return;
  safeSet(STORAGE_KEYS.LAST_LESSON, {
    level: location.level || 'beginner',
    category: location.category || null,
    cardIndex: typeof location.cardIndex === 'number' ? location.cardIndex : 0,
    timestamp: Date.now(),
  });
}

/**
 * Saves a quiz attempt result.
 */
export function saveQuizResult(result) {
  if (!result) return;
  const history = getQuizResults();
  const entry = {
    id: `quiz-${Date.now()}`,
    score: result.score || 0,
    total: result.total || 0,
    percentage: result.total > 0 ? Math.round((result.score / result.total) * 100) : 0,
    category: result.category || 'mixed',
    level: result.level || 'beginner',
    missedWordIds: Array.isArray(result.missedWordIds) ? result.missedWordIds : [],
    timestamp: Date.now(),
  };
  history.unshift(entry);
  // Keep last 20 quiz results
  safeSet(STORAGE_KEYS.QUIZ_RESULTS, history.slice(0, 20));
  return entry;
}

/**
 * Returns the array of recent quiz results (newest first).
 */
export function getQuizResults() {
  return safeGet(STORAGE_KEYS.QUIZ_RESULTS, []);
}

/**
 * Calculates learning totals, category completion, and difficult words.
 */
export function calculateProgress(vocabularyList) {
  const ratings = getRatings();
  const studiedSet = new Set(getStudiedWordIds());

  let totalWords = vocabularyList.length;
  let wordsStudied = 0;
  let wordsKnown = 0;
  let wordsAgain = 0;
  const difficultWords = [];

  // Track categories: key is `${level}::${category}`
  const categoriesMap = {};

  vocabularyList.forEach((word) => {
    const isStudied = studiedSet.has(word.id);
    const rating = ratings[word.id];

    if (isStudied) {
      wordsStudied += 1;
    }
    if (rating === 'known') {
      wordsKnown += 1;
    } else if (rating === 'again') {
      wordsAgain += 1;
      difficultWords.push(word);
    }

    const key = `${word.level}::${word.category}`;
    if (!categoriesMap[key]) {
      categoriesMap[key] = {
        level: word.level,
        category: word.category,
        total: 0,
        studied: 0,
        known: 0,
      };
    }

    categoriesMap[key].total += 1;
    if (isStudied) {
      categoriesMap[key].studied += 1;
    }
    if (rating === 'known') {
      categoriesMap[key].known += 1;
    }
  });

  const categories = Object.values(categoriesMap).map((cat) => ({
    ...cat,
    isCompleted: cat.total > 0 && cat.studied >= cat.total,
    completionPercentage: cat.total > 0 ? Math.round((cat.studied / cat.total) * 100) : 0,
  }));

  const completedCategoriesCount = categories.filter((c) => c.isCompleted).length;
  const quizHistory = getQuizResults();

  return {
    totalWords,
    wordsStudied,
    wordsKnown,
    wordsAgain,
    difficultWords,
    categories,
    completedCategoriesCount,
    quizHistory,
    overallStudiedPercentage: totalWords > 0 ? Math.round((wordsStudied / totalWords) * 100) : 0,
    overallKnownPercentage: totalWords > 0 ? Math.round((wordsKnown / totalWords) * 100) : 0,
  };
}

/**
 * Clears all learning ratings, studied marks, last lesson location, and quiz records.
 */
export function clearAllLearningProgress() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEYS.RATINGS);
      window.localStorage.removeItem(STORAGE_KEYS.STUDIED);
      window.localStorage.removeItem(STORAGE_KEYS.LAST_LESSON);
      window.localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULTS);
    }
  } catch (err) {
    console.warn('Error clearing learning progress:', err);
  }
}
