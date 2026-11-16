import React, { useState } from 'react';
import sampleVocabulary from '../data/vocabulary.json';
import { generateQuiz } from '../utils/quiz';
import { saveQuizResult, getStudiedWordIds } from '../utils/storage';

export default function PracticeScreen({ onNavigate, onStudyWords }) {
  const [quizState, setQuizState] = useState('menu'); // 'menu' | 'active' | 'results'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [missedWords, setMissedWords] = useState([]);

  // Get unique categories from sample dataset
  const categories = Array.from(new Set(sampleVocabulary.map((w) => w.category)));

  const handleStartQuiz = (categoryFilter = selectedCategory) => {
    const opts = { limit: 5 };
    if (categoryFilter !== 'all') {
      opts.category = categoryFilter;
    }
    const generated = generateQuiz(sampleVocabulary, opts);

    if (generated.length === 0) return;

    setQuestions(generated);
    setCurrentIndex(0);
    setScore(0);
    setMissedWords([]);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizState('active');
  };

  const handleSelectOption = (choice) => {
    if (isAnswered) return;

    const currentQ = questions[currentIndex];
    const isCorrect = choice === currentQ.correctAnswer;

    setSelectedAnswer(choice);
    setIsAnswered(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setMissedWords((prev) => [...prev, currentQ]);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Quiz finished
      const finalScore = score + (selectedAnswer === questions[currentIndex].correctAnswer ? 0 : 0);
      const missedIds = missedWords.map((q) => q.wordId);

      // Save to storage
      saveQuizResult({
        score,
        total: questions.length,
        category: selectedCategory,
        level: 'mixed',
        missedWordIds: missedIds,
      });

      setQuizState('results');
    }
  };

  // Review missed words in Flashcards view
  const handleReviewMissed = () => {
    if (missedWords.length > 0 && onStudyWords) {
      const missedIds = missedWords.map((q) => q.wordId);
      onStudyWords(missedIds);
      onNavigate('flashcards');
    }
  };

  /* ================= 1. MENU STATE ================= */
  if (quizState === 'menu') {
    const studiedCount = getStudiedWordIds().length;

    return (
      <section className="screen-container" aria-labelledby="practice-title">
        <header className="screen-header">
          <h1 id="practice-title" className="screen-title">Practice & Quizzes</h1>
          <p className="screen-subtitle">
            Test your recall of Yoruba words and pronunciations.
          </p>
        </header>

        {/* Quick Quiz Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Multiple-Choice Quiz</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Choose a category or test across all vocabulary. Distractors are drawn strictly from reviewed vocabulary.
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="quiz-category-select" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Select Topic:
            </label>
            <select
              id="quiz-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                backgroundColor: 'var(--color-bg)',
              }}
            >
              <option value="all">🌟 All Categories (Mixed Quiz)</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => handleStartQuiz(selectedCategory)}
            style={{ width: '100%' }}
          >
            Start Quiz →
          </button>
        </div>

        {/* Info card */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Quiz Design Guarantee</h3>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            <li>Every question has exactly one verified correct answer.</li>
            <li>Choices are never fabricated or machine-generated.</li>
            <li>Missed words can be reviewed immediately in flashcard mode.</li>
          </ul>
        </div>
      </section>
    );
  }

  /* ================= 2. ACTIVE QUIZ STATE ================= */
  if (quizState === 'active' && questions.length > 0) {
    const currentQ = questions[currentIndex];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    return (
      <section className="screen-container" aria-labelledby="quiz-question-title">
        {/* Header & Progress */}
        <header className="screen-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="gold-badge" style={{ fontSize: '0.75rem' }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <h1 id="quiz-question-title" className="screen-title" style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>
              Choose the Meaning
            </h1>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setQuizState('menu')}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
          >
            Exit Quiz
          </button>
        </header>

        {/* Question Card */}
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Yorùbá Word
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.5rem' }}>
            {currentQ.yoruba}
          </div>
          <div style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Guide: {currentQ.pronunciation}
          </div>

          {/* Choices list */}
          <div className="quiz-choices" role="group" aria-label="Answer options">
            {currentQ.choices.map((choice, i) => {
              let choiceClass = 'quiz-option';
              if (isAnswered) {
                if (choice === currentQ.correctAnswer) {
                  choiceClass += ' correct';
                } else if (choice === selectedAnswer) {
                  choiceClass += ' incorrect';
                }
              }

              return (
                <button
                  key={i}
                  type="button"
                  className={choiceClass}
                  onClick={() => handleSelectOption(choice)}
                  disabled={isAnswered}
                  aria-pressed={selectedAnswer === choice}
                >
                  <span style={{ marginRight: '0.5rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>

          {/* Immediate Answer Feedback */}
          {isAnswered && (
            <div className={`quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`} role="status">
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                {isCorrect ? '✓ O tọ́! (Correct!)' : '✗ Kò tọ́ (Incorrect)'}
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                {!isCorrect && (
                  <span>
                    The correct meaning is: <strong>{currentQ.correctAnswer}</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Proceed Button */}
          {isAnswered && (
            <div style={{ marginTop: '1.25rem' }}>
              <button
                type="button"
                className="primary-button"
                onClick={handleNextQuestion}
                style={{ width: '100%' }}
              >
                {currentIndex < questions.length - 1 ? 'Next Question →' : 'See Results →'}
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  /* ================= 3. RESULTS STATE ================= */
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <section className="screen-container" aria-labelledby="results-title">
      <header className="screen-header">
        <h1 id="results-title" className="screen-title">Quiz Results</h1>
        <p className="screen-subtitle">Here is how well you recalled the vocabulary.</p>
      </header>

      {/* Score Summary Card */}
      <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: percentage >= 70 ? 'var(--color-primary)' : '#c0392b' }}>
          {score} / {questions.length}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
          {percentage}% Score
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {percentage === 100
            ? 'Ẹ ku oriire! Perfect recall!'
            : percentage >= 60
            ? 'Ẹ kú iṣẹ́! Good progress, keep practicing!'
            : 'Keep reviewing to build familiarity with Yoruba tones.'}
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
          <button
            type="button"
            className="primary-button"
            onClick={() => handleStartQuiz(selectedCategory)}
            style={{ flex: 1 }}
          >
            Try Again ↻
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setQuizState('menu')}
            style={{ flex: 1 }}
          >
            Quiz Menu
          </button>
        </div>
      </div>

      {/* Missed Words Review Section */}
      {missedWords.length > 0 ? (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.1rem', color: '#c0392b' }}>
              Missed Words ({missedWords.length})
            </h2>
            <button
              type="button"
              className="primary-button"
              onClick={handleReviewMissed}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              Study in Flashcards →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {missedWords.map((q) => (
              <div key={q.wordId} className="missed-word-item">
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                    {q.yoruba}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Guide: {q.pronunciation}
                  </div>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {q.correctAnswer}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ backgroundColor: 'var(--color-primary-light)' }}>
          <div style={{ textAlign: 'center', padding: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🎉</span>
            <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
              No missed words in this quiz!
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
