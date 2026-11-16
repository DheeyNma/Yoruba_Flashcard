
# Kọ́ Yorùbá — Product Requirements Document

## 1. Purpose and audience

Kọ́ Yorùbá is a mobile-first website that helps anyone interested in Yoruba learn vocabulary, pronunciation, and eventually everyday sentences through flashcards and short quizzes. It should welcome complete beginners while offering intermediate and advanced material. The first release prioritizes words and vocabulary, not a full conversation course.

**Primary goal:** Help learners discover words, understand meanings, hear and read pronunciations, recall them, and see their progress without creating an account.

## 2. Release scope

- React + Vite website, usable on modern mobile and desktop browsers.
- No registration or login.
- Three levels: Beginner, Intermediate, Advanced.
- Vocabulary organized into categories within levels.
- Initial target: **300 reviewed words**: 150 Beginner, 100 Intermediate, 50 Advanced. Counts are content targets, not a reason to publish unverified entries.
- Each entry has an ID, level, category, correctly marked Yoruba spelling, English meaning, learner-friendly written pronunciation guidance, and an audio reference when verified. Include an example sentence and its English translation where useful.
- A small, reviewed collection of common sentences can be prepared in the content structure for future sentence-focused lessons. Vocabulary remains the main learning experience in v1.
- Flashcards work in either direction: Yoruba → English or English → Yoruba; tap or click to flip.
- On each card, learners can play pronunciation, reveal the answer, mark **I know this** or **Learn again**, and move to another card.
- Multiple-choice vocabulary quizzes with clear correct/incorrect feedback, final score, and a way to review missed words.
- Progress page: words studied, words marked known, category completion, quiz results, and a difficult-word review entry point.
- Browser-based progress saving without an account, including selected learning direction and other settings.
- Settings: change card direction, toggle sound preference, and deliberately reset saved progress with confirmation.

## 3. Main screens and navigation

1. **Home:** welcome, current level, words learned, continue-learning action, and suggested lessons.
2. **Learn:** level selection followed by categories; show each category's word count and progress.
3. **Flashcards:** one readable card at a time, flip action, direction switch, pronunciation guide, audio control, known/again actions, and card position.
4. **Practice:** multiple-choice quiz from learned or selected vocabulary, answer feedback, score, and review missed items.
5. **Progress:** learning totals, completed categories, recent quiz scores, and review of difficult words.
6. **Settings:** preferences and reset action, reached from the Home header.

**Mobile bottom navigation:** Home, Learn, Practice, Progress. On desktop, use an equally clear navigation layout. Settings need not be a fifth bottom tab.

## 4. Learning behavior and rules

- Learners may browse any level and category; levels organize difficulty but are not locked.
- A new learner can begin immediately without onboarding or sign-in.
- The app remembers the last learning location so **Continue Learning** returns to it.
- A flashcard's front follows the selected direction; its reverse shows the answer and helpful context. Changing direction resets the current card to its front.
- **I know this** marks the entry known. **Learn again** marks it for review; learners can change a previous rating later.
- Quiz questions use only entries with verified correct answers. Offer a sensible smaller quiz if the selected category has few entries; never fabricate distractors.
- Progress counts must have explicit definitions: *studied* = opened/revealed at least once; *known* = latest rating is known; *category completed* = every entry in it has been studied. Show quiz scores separately.
- Data remains in the current browser/device. Clearly explain that clearing browser storage or changing devices may remove progress.
- Yoruba tone marks and special letters must be preserved everywhere. Never silently strip accents to simplify display, search, or audio.

## 5. Content and pronunciation quality

Initial category suggestions:

- **Beginner (150):** greetings, numbers, colours, family, food, animals, body parts.
- **Intermediate (100):** household items, occupations, transportation, places, shopping, everyday actions.
- **Advanced (50):** abstract vocabulary, emotions, expressions, culture, and complex vocabulary.

Every entry needs human review for Yoruba spelling, tone marks, meaning, level, and written pronunciation. Example sentences must be reviewed too. Yoruba is tonal: written guides are learning aids, not substitutes for authentic speech.

**Audio requirement:** each published learning entry should have an accessible, verified pronunciation clip or a proven Yoruba-capable speech source. Do not present generic browser text-to-speech as accurate by default. If reliable audio is unavailable during development, visibly mark that entry as awaiting audio; do not ship the release as audio-complete until coverage and quality checks pass. Do not generate made-up audio files or misleading play buttons.

## 6. Agreed design notes

- **Style:** calm, minimal, modern, welcoming, with subtle Yoruba cultural details rather than heavy decoration.
- **Palette:** forest green `#245C45` for primary actions; warm cream `#F8F5ED` for backgrounds; gold `#E8B84A` for restrained highlights; white `#FFFFFF` for cards; charcoal `#252C28` for text.
- **Fonts:** Nunito for headings and Inter for interface/body text. Verify that loaded font variants render Yoruba characters and tone marks correctly; use an appropriate fallback if needed.
- **Layout:** mobile-first, generous spacing, rounded cards, readable type, large tap targets, clear contrast, and a fixed bottom navigation on mobile that never covers content.
- **Flashcard:** prominent single word, simple flip affordance, unobtrusive card count, obvious pronunciation control, and two distinct recall buttons.
- **Accessibility:** keyboard navigation, visible focus states, meaningful control labels, reduced-motion support for flips, and no information conveyed only by colour.
- **Responsive:** check narrow phones, typical phones, tablets, and desktop widths; no sideways scrolling or clipped tone marks.

## 7. Acceptance checks

| Feature | How we know it works |
|---|---|
| Navigation | All four main tabs open the correct screens; Settings opens from Home; browser Back behaves sensibly. |
| Levels/categories | All three levels display, category counts match data, and every category opens its own words. |
| Content | 300 unique, reviewed vocabulary entries meet the 150/100/50 targets; required fields and Yoruba characters are valid. |
| Flashcard flip | Tapping and keyboard activation reveal the right meaning and flip back reliably. |
| Direction switch | Both language directions display the correct front/back without leaking the answer. |
| Written pronunciation | Guides are present, reviewed, readable, and show correct Yoruba tone marks. |
| Audio | Play controls work for all published entries; clips are audible, match the displayed text, and pass native-speaker review. |
| Recall actions | Known and Again update the correct entry and its review status; switching categories does not corrupt ratings. |
| Quizzes | Answers are correctly graded; score equals correct answers / total; missed items are reviewable. |
| Progress | Counts match actual study actions and persist after page reload. |
| Continue Learning | Returning to Home resumes the most recent level/category and appropriate card. |
| Settings | Direction and sound preferences persist; reset requires confirmation and clears learning progress. |
| No login | A new visitor can study, quiz, and save progress without an account or server. |
| Responsive/accessibility | Phone and desktop layouts work; controls are keyboard-usable and labelled; no content is obscured. |

## 8. Out of scope for first release

Accounts, cloud sync, native Android/iOS apps, paid plans, social leaderboards, speech recognition, and a complete sentence/conversation course. These may be considered later.

## 9. Release gate

Do not call v1 complete until the agreed features pass their checks and the Yoruba content and pronunciation have been reviewed. If content/audio review is pending, label the build a prototype or beta rather than claiming full coverage.
