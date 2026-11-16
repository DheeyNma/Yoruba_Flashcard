
# Instructions for Coding Agents — Kọ́ Yorùbá

## Read before changing anything

1. Read `docs/PRD.md` for product requirements and design.
2. Read `docs/PLAN.md` for the implementation order.
3. Read `docs/TODO.md` for the current small tasks and their checks.
4. Explain in plain English what you plan to change before editing code.

## Work style

- Assume the project owner is new to coding. Avoid jargon; explain unavoidable technical words briefly.
- Work on **one small TODO task or tightly related group** at a time. State the task, files to change, and how you will test it.
- Do not start later phases before the earlier phase is tested and accepted.
- Keep the app simple: React, Vite, JavaScript, CSS, JSON, and localStorage. Do not introduce a backend, accounts, database, paid API, or large framework without asking first.
- Prefer readable, maintainable components over clever abstractions. Use descriptive names and brief comments only where helpful.
- Do not remove agreed features or alter the design palette, typography, or navigation without approval.
- Do not overwrite unrelated work. Keep changes small and reviewable.
- Never claim a feature works without actually checking it.

## Yoruba content and audio rules

- Preserve Yoruba characters and tone marks exactly. Do not normalize them away.
- Do not invent 300 words, pronunciation guides, example sentences, or audio and call them verified.
- Use clearly labelled sample data while building. Flag entries awaiting review.
- Require competent Yoruba-language review before treating content as final.
- Never assume default browser text-to-speech correctly handles Yoruba tones. Use only validated audio or a verified Yoruba-capable source.
- An unavailable clip must show an honest disabled/unavailable state, not a fake working button.

## Testing and quality

- For each completed TODO, run its specified check and report the result.
- Test both flashcard directions, quiz grading, localStorage persistence, and reset confirmation.
- Test narrow mobile screens and keyboard accessibility, not just desktop mouse use.
- Check that progress calculations follow definitions in the PRD.
- Keep automated tests for critical logic and user flows; run the production build before suggesting release.
- If tests cannot run, say exactly why and leave the TODO unchecked.

## Communication after each task

Give a short beginner-friendly report:

1. **What changed** — the user-visible result.
2. **Files changed** — exact paths.
3. **How I checked it** — commands and manual steps, with pass/fail status.
4. **What remains** — next TODO item and any blockers.

Only tick a TODO checkbox after verifying it. Ask for approval before deployment, significant scope changes, or spending money. Do not start application implementation until the project owner explicitly authorizes it.
