# Kọ́ Yorùbá — Learn Yoruba 🌍

A modern, mobile-first web application designed to help learners discover, practice, and master authentic Yoruba vocabulary, tone marks, and pronunciations through interactive flashcards and quizzes.

---

## ✨ Features

* **Mobile-First & Responsive:** Designed for handheld devices with clear mobile bottom navigation and clean desktop scaling.
* **Three Learning Levels:** Unlocked browsing across **Beginner**, **Intermediate**, and **Advanced** tiers organized by thematic categories (Greetings, Numbers, Household, Actions, Culture, Emotions, etc.).
* **Preserved Yoruba Orthography:** Correctly renders all Yoruba special characters (`ẹ`, `ọ`, `ṣ`) and tone marks (High `́`, Mid, Low `̀`) without normalization or clipping.
* **Interactive Flashcards:**
  * **Reversible:** Study either **Yorùbá → English** or **English → Yorùbá**. Switching directions automatically resets the card so answers never leak.
  * **Accessible:** Flip using touch, mouse click, or keyboard controls (**Space** or **Enter**).
  * **Written Pronunciation:** Every word includes syllable-by-syllable pronunciation guidance.
  * **Honest Audio Indicators:** Avoids inaccurate browser text-to-speech by providing honest "awaiting recording" status for unrecorded clips.
  * **Self-Rating:** Rate words as **"I know this"** or **"Learn again"** to guide spaced repetition.
* **Smart Progress & Continue Learning:**
  * Remembers your exact lesson and card position—the **"Continue Learning"** button on the Home screen takes you straight back.
  * Tracks words studied, words known, and category completion rates.
* **No Account Required:** All study records and preferences persist directly on your device via browser `localStorage`.
* **Deliberate Settings:** Easily switch card direction, audio preferences, or perform a confirmed progress reset.

---

## 🛠️ Tech Stack

* **Framework:** React 19
* **Build Tool:** Vite 6
* **Language:** JavaScript (ES Modules)
* **Styling:** Vanilla CSS with custom design tokens (Forest Green, Cream, Gold, White, Charcoal)
* **Testing:** Vitest + React Testing Library (with automated test suites for navigation, flashcards, storage, and data validation)
* **Storage:** Browser `localStorage` (no backend, database, or paid APIs required)

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm (bundled with Node)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DheeyNma/Yoruba_Flashcard.git
   cd Yoruba_Flashcard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   *(On Windows PowerShell with script execution restrictions, you can run `npm.cmd install`)*

### Development

Start the local development server:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Running Tests

Run the full automated test suite with Vitest:
```bash
npm test
```

### Production Build

Create an optimized production bundle in `dist/`:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 📂 Project Structure

```text
├── docs/                     # Specifications, requirements, and progress checklists
│   ├── PRD.md                # Product Requirements Document
│   ├── PLAN.md               # Implementation architecture and phases
│   └── TODO.md               # Verified task checklist
├── src/
│   ├── components/           # Reusable UI elements (AppShell, Header, BottomNav)
│   ├── data/                 # Reviewed vocabulary dataset and schema validator
│   ├── screens/              # Main views (Home, Learn, Flashcards, Practice, Progress, Settings)
│   ├── styles/               # Design tokens and global responsive styles
│   ├── utils/                # LocalStorage management and progress calculations
│   ├── __tests__/            # Unit and integration test suites
│   ├── App.jsx               # Root application component
│   └── main.jsx              # React DOM entry point
├── AGENTS.md                 # Project rules for coding agents and language standards
├── index.html                # HTML entry point with Google Fonts (Nunito & Inter)
└── vite.config.js            # Vite and Vitest configuration
```

---

## 📜 Content & Audio Policy

Yoruba is a tonal language where pitch alters meaning. In strict accordance with the project guidelines:
1. Yoruba diacritics and tone marks are strictly preserved.
2. Generic browser text-to-speech is never used as a substitute for authentic pronunciation.
3. Audio clips are flagged honestly; unavailable clips display a disabled state rather than non-functional buttons.
4. Content is expanded in verified batches with native speaker review before final release.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
