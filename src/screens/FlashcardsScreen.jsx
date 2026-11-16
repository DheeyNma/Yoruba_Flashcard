import React, { useState, useEffect } from 'react';
import sampleVocabulary from '../data/vocabulary.json';
import {
  getRatings,
  saveRating,
  markWordStudied,
  saveLastLesson,
} from '../utils/storage';

export default function FlashcardsScreen({
  selectedCategory,
  selectedLevel = 'beginner',
  targetWordIds = null,
  cardDirection = 'yoruba-to-english',
  onUpdateCardDirection,
  soundEnabled = true,
  initialCardIndex = 0,
  onNavigate,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialCardIndex);
  const [ratings, setRatings] = useState(() => getRatings());
  const [audioFeedback, setAudioFeedback] = useState('');

  // Filter words: either by targetWordIds (custom review pool) or by selected level/category
  const words = sampleVocabulary.filter((w) => {
    if (Array.isArray(targetWordIds) && targetWordIds.length > 0) {
      return targetWordIds.includes(w.id);
    }
    const matchesLevel = !selectedLevel || w.level === selectedLevel;
    const matchesCategory = !selectedCategory || w.category === selectedCategory;
    return matchesLevel && matchesCategory;
  });

  // Ensure current index is within bounds if category changes
  const safeIndex = words.length > 0 ? Math.min(currentIndex, words.length - 1) : 0;
  const activeWord = words[safeIndex];

  // Save last lesson location whenever location or card index changes (unless in custom review mode)
  useEffect(() => {
    if (activeWord && !targetWordIds) {
      saveLastLesson({
        level: selectedLevel,
        category: selectedCategory || activeWord.category,
        cardIndex: safeIndex,
      });
    }
  }, [selectedLevel, selectedCategory, safeIndex, activeWord, targetWordIds]);

  // Mark word as studied when card is flipped to reveal answer
  useEffect(() => {
    if (isFlipped && activeWord) {
      markWordStudied(activeWord.id);
    }
  }, [isFlipped, activeWord]);

  const goToCard = (newIndex) => {
    setIsFlipped(false);
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    if (safeIndex < words.length - 1) {
      goToCard(safeIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (safeIndex > 0) {
      goToCard(safeIndex - 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFlip();
    }
  };

  const handleDirectionToggle = () => {
    const newDirection =
      cardDirection === 'yoruba-to-english'
        ? 'english-to-yoruba'
        : 'yoruba-to-english';
    if (onUpdateCardDirection) {
      onUpdateCardDirection(newDirection);
    }
    // PRD: Changing direction resets current card to its front
    setIsFlipped(false);
  };

  const handleRate = (rating) => {
    if (!activeWord) return;
    saveRating(activeWord.id, rating);
    markWordStudied(activeWord.id);
    setRatings(getRatings());

    if (safeIndex < words.length - 1) {
      goToCard(safeIndex + 1);
    }
  };

  const handlePlayAudio = (e) => {
    e.stopPropagation();
    if (!activeWord) return;

    if (!soundEnabled) {
      setAudioFeedback('Audio is turned off in Settings');
      setTimeout(() => setAudioFeedback(''), 3000);
      return;
    }

    if (activeWord.audioUrl && activeWord.audioStatus === 'verified') {
      try {
        const audio = new Audio(activeWord.audioUrl);
        audio.play().catch(() => {
          setAudioFeedback('Audio playback error');
        });
      } catch {
        setAudioFeedback('Audio could not be loaded');
      }
    } else {
      setAudioFeedback('Audio is awaiting verified native speaker recording');
      setTimeout(() => setAudioFeedback(''), 3000);
    }
  };

  if (words.length === 0) {
    return (
      <section className="screen-container" aria-labelledby="flashcards-title">
        <header className="screen-header">
          <h1 id="flashcards-title" className="screen-title">Flashcards</h1>
        </header>
        <div className="card empty-state">
          <span className="empty-state-icon" aria-hidden="true">📂</span>
          <h2 className="empty-state-title">No vocabulary selected</h2>
          <p className="empty-state-text">
            Choose a category from the Learn screen to begin studying flashcards.
          </p>
          <button
            type="button"
            className="primary-button"
            onClick={() => onNavigate('learn')}
            style={{ marginTop: '1rem' }}
          >
            Browse Categories
          </button>
        </div>
      </section>
    );
  }

  const currentRating = activeWord ? ratings[activeWord.id] : null;

  return (
    <section className="screen-container" aria-labelledby="flashcards-title">
      {/* Top Header & Navigation */}
      <header className="screen-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 id="flashcards-title" className="screen-title" style={{ fontSize: '1.35rem' }}>
            {targetWordIds ? (
              'Review Pool'
            ) : selectedCategory ? (
              <span style={{ textTransform: 'capitalize' }}>{selectedCategory}</span>
            ) : (
              'All Flashcards'
            )}
          </h1>
          <p className="screen-subtitle" style={{ textTransform: 'capitalize' }}>
            {targetWordIds ? 'Custom Review' : `${selectedLevel} Level`}
          </p>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() => onNavigate('learn')}
          style={{ fontSize: '0.85rem' }}
        >
          Categories
        </button>
      </header>

      {/* Direction Switch and Card Position Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={handleDirectionToggle}
          className="secondary-button"
          style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', gap: '4px' }}
          aria-label={`Switch direction. Current: ${
            cardDirection === 'yoruba-to-english'
              ? 'Yoruba to English'
              : 'English to Yoruba'
          }`}
          title="Click to switch flashcard direction"
        >
          <span aria-hidden="true">⇄</span>
          <span>
            {cardDirection === 'yoruba-to-english'
              ? 'Yorùbá → English'
              : 'English → Yorùbá'}
          </span>
        </button>

        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
          Card {safeIndex + 1} of {words.length}
        </span>
      </div>

      {/* Rating badge if word already has a rating */}
      {currentRating && (
        <div style={{ textAlign: 'center' }}>
          <span
            className="gold-badge"
            style={{
              backgroundColor: currentRating === 'known' ? 'var(--color-primary-light)' : '#fbeae8',
              color: currentRating === 'known' ? 'var(--color-primary)' : '#c0392b',
            }}
          >
            {currentRating === 'known' ? '✓ Marked: I know this' : '↻ Marked: Learn again'}
          </span>
        </div>
      )}

      {/* Interactive Flashcard */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Flashcard: ${
          cardDirection === 'yoruba-to-english' ? activeWord.yoruba : activeWord.english
        }. ${isFlipped ? 'Answer revealed.' : 'Prompt showing.'} Click or press Enter to flip.`}
        aria-expanded={isFlipped}
        onClick={handleFlip}
        onKeyDown={handleCardKeyDown}
        className="flashcard-card"
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isFlipped ? 'Answer (Reverse)' : 'Prompt (Front)'}
          </div>

          {/* FRONT */}
          {!isFlipped ? (
            <div style={{ marginTop: '1rem' }}>
              <div className="flashcard-word">
                {cardDirection === 'yoruba-to-english'
                  ? activeWord.yoruba
                  : activeWord.english}
              </div>

              {cardDirection === 'yoruba-to-english' && (
                <>
                  <div className="flashcard-pronunciation">
                    Written guide: <strong>{activeWord.pronunciation}</strong>
                  </div>
                  <button
                    type="button"
                    className="audio-button"
                    disabled={!soundEnabled || !activeWord.audioUrl || activeWord.audioStatus !== 'verified'}
                    aria-disabled={!soundEnabled || !activeWord.audioUrl || activeWord.audioStatus !== 'verified'}
                    onClick={handlePlayAudio}
                    title={
                      !soundEnabled
                        ? 'Audio is disabled in Settings'
                        : activeWord.audioStatus === 'verified'
                        ? 'Play verified pronunciation'
                        : 'Audio clip awaiting native speaker recording'
                    }
                  >
                    <span aria-hidden="true">🔈</span>
                    <span>
                      {!soundEnabled
                        ? 'Audio: Disabled in settings'
                        : activeWord.audioStatus === 'verified'
                        ? 'Play Pronunciation'
                        : 'Audio: Awaiting recording'}
                    </span>
                  </button>
                </>
              )}
            </div>
          ) : (
            /* BACK */
            <div style={{ marginTop: '1rem' }}>
              <div className="flashcard-word" style={{ color: 'var(--color-text)' }}>
                {cardDirection === 'yoruba-to-english'
                  ? activeWord.english
                  : activeWord.yoruba}
              </div>

              {cardDirection === 'english-to-yoruba' && (
                <>
                  <div className="flashcard-pronunciation">
                    Pronunciation: <strong>{activeWord.pronunciation}</strong>
                  </div>
                  <button
                    type="button"
                    className="audio-button"
                    disabled={!soundEnabled || !activeWord.audioUrl || activeWord.audioStatus !== 'verified'}
                    aria-disabled={!soundEnabled || !activeWord.audioUrl || activeWord.audioStatus !== 'verified'}
                    onClick={handlePlayAudio}
                  >
                    <span aria-hidden="true">🔈</span>
                    <span>
                      {!soundEnabled
                        ? 'Audio: Disabled in settings'
                        : activeWord.audioStatus === 'verified'
                        ? 'Play Pronunciation'
                        : 'Audio: Awaiting recording'}
                    </span>
                  </button>
                </>
              )}

              {activeWord.exampleSentence && (
                <div style={{ marginTop: '1.25rem', padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Example Sentence:</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginTop: '2px' }}>
                    {activeWord.exampleSentence.yoruba}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {activeWord.exampleSentence.english}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Flip Instruction Hint */}
        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {isFlipped ? 'Tap card to show prompt' : 'Tap card or press Space to reveal answer'}
        </div>
      </div>

      {audioFeedback && (
        <div role="status" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          {audioFeedback}
        </div>
      )}

      {/* Recall Action Buttons (I know this / Learn again) */}
      <div className="recall-actions" role="group" aria-label="Self rating">
        <button
          type="button"
          className="recall-button-again"
          onClick={() => handleRate('again')}
          aria-label="Mark for review: Learn again"
        >
          ↻ Learn Again
        </button>
        <button
          type="button"
          className="recall-button-known"
          onClick={() => handleRate('known')}
          aria-label="Mark as known: I know this"
        >
          ✓ I Know This
        </button>
      </div>

      {/* Card Carousel Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button
          type="button"
          className="secondary-button"
          onClick={handlePrevious}
          disabled={safeIndex === 0}
          aria-label="Previous flashcard"
          style={{ flex: 1, opacity: safeIndex === 0 ? 0.4 : 1, cursor: safeIndex === 0 ? 'not-allowed' : 'pointer' }}
        >
          ← Previous
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={handleNext}
          disabled={safeIndex === words.length - 1}
          aria-label="Next flashcard"
          style={{ flex: 1, opacity: safeIndex === words.length - 1 ? 0.4 : 1, cursor: safeIndex === words.length - 1 ? 'not-allowed' : 'pointer' }}
        >
          Next →
        </button>
      </div>
    </section>
  );
}
