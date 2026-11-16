
# Kọ́ Yorùbá — Implementation Plan

## Tools and approach

- **React:** builds screens and reusable components.
- **Vite:** creates and runs the development project.
- **JavaScript:** handles card interactions, quizzes, and progress.
- **CSS:** implements the agreed mobile-first visual design.
- **JSON:** stores reviewed vocabulary and sentence-ready content.
- **Browser localStorage:** saves progress and preferences without accounts.
- **Google Antigravity:** AI coding agent, working in small reviewable steps.
- **Git:** keeps changes traceable and reversible.
- **Automated tests:** use a lightweight React test setup for component/logic tests and a browser test tool for critical user flows; choose exact packages when implementation begins.

No backend, authentication, or database is required for v1.

## Phase 1 — Foundation (build first)

1. Create the Vite + React project and basic folders.
2. Add global styles, fonts, colours, responsive page shell, and navigation.
3. Create Home, Learn, Flashcards, Practice, Progress, and Settings routes/views with meaningful empty states.
4. Define a consistent vocabulary data format and write a small **reviewed** sample dataset covering multiple levels/categories.

**Verify:** app starts locally, navigation works, small and large screens render, Yoruba text displays correctly, and sample content validates. Do not bulk-generate 300 entries before the schema and review process are proven.

## Phase 2 — Core learning (build next)

1. Build level and category browsing with real counts.
2. Build reversible, accessible flashcards with card navigation.
3. Add reviewed written pronunciation and audio controls, including honest unavailable-audio states.
4. Implement Known / Learn again ratings and browser persistence.
5. Add Home Continue Learning and basic Progress calculations.
6. Expand and review vocabulary toward the agreed 300-entry target.

**Verify:** complete the flow Home → level → category → card → flip → rate → next → reload → resume. Check both directions, audio correctness, special characters, and persistence.

## Phase 3 — Practice and completion (build last)

1. Implement multiple-choice quiz generation from eligible vocabulary.
2. Add answer feedback, scores, and missed-word review.
3. Complete Progress and Settings, including sound preference and confirmed reset.
4. Finalize and validate all 300 reviewed entries and pronunciation assets.
5. Polish mobile layouts, accessibility, loading/empty/error states, and desktop behavior.
6. Run automated tests, manual device checks, and a native-speaker content/audio review.
7. Build a production preview and prepare simple deployment instructions; deploy only after approval.

**Verify:** run every PRD acceptance check, test a fresh browser and returning learner, and confirm the production build works. Document any unfinished content or audio before release.

## Rules for sequencing

- Complete and test one phase before starting the next.
- Make small changes that can be inspected and reversed.
- Use sample content to validate the app before importing all 300 entries.
- Keep content review separate from code correctness; a working play button does not prove good pronunciation.
- Ask the project owner before changing scope, adding paid services, or introducing a backend.
