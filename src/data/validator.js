/**
 * Validates vocabulary items against the Kọ́ Yorùbá specification.
 * Flags:
 * - Duplicate IDs
 * - Missing required fields (id, level, category, yoruba, english, pronunciation, audioStatus)
 * - Invalid levels
 * - Empty string fields
 */

export const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'];

export const REQUIRED_FIELDS = [
  'id',
  'level',
  'category',
  'yoruba',
  'english',
  'pronunciation',
  'audioStatus',
];

export function validateVocabularyItem(item, seenIds = new Set()) {
  const errors = [];

  if (!item || typeof item !== 'object') {
    return ['Entry must be an object'];
  }

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (item[field] === undefined || item[field] === null || item[field] === '') {
      errors.push(`Missing or empty required field: "${field}"`);
    }
  }

  // Check ID validity & uniqueness
  if (item.id) {
    if (typeof item.id !== 'string' || item.id.trim() === '') {
      errors.push('Field "id" must be a non-empty string');
    } else if (seenIds.has(item.id)) {
      errors.push(`Duplicate ID found: "${item.id}"`);
    } else {
      seenIds.add(item.id);
    }
  }

  // Check level
  if (item.level && !VALID_LEVELS.includes(item.level)) {
    errors.push(
      `Invalid level "${item.level}". Must be one of: ${VALID_LEVELS.join(', ')}`
    );
  }

  // Validate example sentence if provided
  if (item.exampleSentence) {
    if (typeof item.exampleSentence !== 'object') {
      errors.push('Field "exampleSentence" must be an object if provided');
    } else {
      if (!item.exampleSentence.yoruba || !item.exampleSentence.english) {
        errors.push(
          'Field "exampleSentence" must include both "yoruba" and "english" text'
        );
      }
    }
  }

  return errors;
}

export function validateVocabularyDataset(dataset) {
  if (!Array.isArray(dataset)) {
    return {
      isValid: false,
      totalEntries: 0,
      errors: ['Dataset must be an array of vocabulary entries'],
    };
  }

  const seenIds = new Set();
  const allErrors = [];

  dataset.forEach((entry, index) => {
    const entryErrors = validateVocabularyItem(entry, seenIds);
    if (entryErrors.length > 0) {
      allErrors.push({
        index,
        id: entry?.id || `entry-${index}`,
        errors: entryErrors,
      });
    }
  });

  return {
    isValid: allErrors.length === 0,
    totalEntries: dataset.length,
    errors: allErrors,
  };
}

