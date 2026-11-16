
# Kọ́ Yorùbá — Task Checklist

Use these checkboxes as the build proceeds. Mark a task done only after its check passes. Do not mark tasks complete merely because code was written.

## Phase 1 — Foundation

- [x] Create React + Vite project; **check:** development server opens without errors.
- [x] Set up clear component, screen, data, and style folders; **check:** structure is understandable to a beginner.
- [x] Add Nunito, Inter, and Yoruba-safe fallback; **check:** `ẹ`, `ọ`, `ṣ`, and tone marks render correctly.
- [x] Apply forest green, cream, gold, white, and charcoal design tokens; **check:** screens use the agreed palette consistently.
- [x] Create responsive shell and four mobile navigation tabs; **check:** no overflow or covered content at phone width.
- [x] Create Home, Learn, Flashcards, Practice, Progress, Settings views; **check:** all are reachable and have useful empty states.
- [x] Define vocabulary fields and data validation; **check:** missing/duplicate IDs and missing required fields are flagged.
- [x] Add a small human-reviewed sample across levels; **check:** level/category counts match the sample.
- [x] Add first navigation/responsive tests; **check:** tests pass.

## Phase 2 — Core learning

- [x] Show Beginner, Intermediate, Advanced; **check:** all open correctly and none is unnecessarily locked.
- [x] Show categories and vocabulary counts; **check:** displayed counts match the data.
- [x] Show one flashcard at a time; **check:** card order and position are correct.
- [x] Implement tap/click/keyboard flip; **check:** answer is hidden until reveal.
- [x] Add Yoruba ↔ English direction switch; **check:** front/back swap correctly and card returns to front.
- [x] Display written pronunciation; **check:** reviewed guide and Yoruba spelling remain readable.
- [x] Add audio playback and unavailable state; **check:** every enabled control plays the matching reviewed clip.
- [x] Add I know this / Learn again; **check:** latest rating updates the correct word.
- [x] Save ratings and last study location locally; **check:** reload preserves both.
- [x] Add Continue Learning; **check:** returns to the last relevant lesson.
- [x] Show studied/known/category progress; **check:** totals match manually recorded actions.
- [ ] Grow dataset toward 150 Beginner, 100 Intermediate, 50 Advanced; **check:** entries are unique and human-reviewed.
- [ ] Review example sentences, tone marks, and audio with a competent Yoruba speaker; **check:** corrections are incorporated.

## Phase 3 — Practice and finish

- [x] Create multiple-choice quizzes; **check:** one correct answer, plausible unique choices, no invented vocabulary.
- [x] Show answer feedback; **check:** correct and incorrect selections are accurately labelled.
- [x] Calculate quiz score; **check:** score matches answers given.
- [x] Review missed quiz words; **check:** missed entries appear in the review flow.
- [x] Complete Progress screen; **check:** totals, category completion, and recent scores are correct after reload.
- [x] Add sound and direction settings; **check:** preferences persist after reload.
- [x] Add progress reset with confirmation; **check:** Cancel preserves data, Confirm clears learning records.
- [x] Explain local-only storage; **check:** users can find the warning and no login is required.
- [ ] Validate full 300-word dataset; **check:** counts 150/100/50 and all required fields reviewed.
- [ ] Verify audio coverage and native-speaker accuracy; **check:** no broken or misleading play controls.
- [x] Test phone, tablet, and desktop layouts; **check:** no clipped text, overlapping navigation, or horizontal scroll.
- [x] Test keyboard use, labels, focus, and reduced motion; **check:** main flows work without a mouse.
- [x] Test fresh browser, returning browser, and cleared storage; **check:** app handles each safely.
- [x] Run automated test suite and production build; **check:** both pass without errors.
- [x] Perform final PRD acceptance review; **check:** record any remaining gaps before release.
- [x] Prepare deployment instructions; **check:** beginner can follow them, but do not deploy without approval.
