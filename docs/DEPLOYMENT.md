# Kọ́ Yorùbá — Beginner Deployment Guide

Because Kọ́ Yorùbá is built with React, Vite, and localStorage, it is a 100% static client-side web application. It requires **no server, database, or backend**, which means it can be hosted completely free on platforms like **GitHub Pages**, **Vercel**, or **Netlify**.

> **Note per AGENTS.md:** Do not trigger production deployment without explicit project owner approval.

---

## Option 1: GitHub Pages (Recommended)

GitHub Pages can host your repository directly from GitHub.

### Step 1: Add Base Path to `vite.config.js`
In `vite.config.js`, set the `base` property to your GitHub repository name:
```javascript
export default defineConfig({
  base: '/Yoruba_Flashcard/',
  plugins: [react()],
  // ...
});
```

### Step 2: Install gh-pages
In your terminal, run:
```bash
npm install --save-dev gh-pages
```

### Step 3: Add Deploy Scripts in `package.json`
Add these two scripts to the `"scripts"` section of `package.json`:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

### Step 4: Deploy
Run:
```bash
npm run deploy
```
Then go to your GitHub repository settings under **Pages** and ensure the source branch is set to `gh-pages`. Your website will be live at:
`https://dheeynma.github.io/Yoruba_Flashcard/`

---

## Option 2: Vercel (One-Click Deploy)

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Select your repository `Yoruba_Flashcard`.
4. Leave the default Vite build settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**. Vercel will give you a live `.vercel.app` URL with automatic updates every time you push to GitHub!

---

## Option 3: Netlify

1. Go to [netlify.com](https://netlify.com) and log in with GitHub.
2. Click **"Add new site"** → **"Import an existing project"**.
3. Authorize GitHub and select `Yoruba_Flashcard`.
4. Netlify will auto-detect Vite:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy Yoruba_Flashcard**.

---

## Pre-Deployment Verification Checklist
Before deploying:
- [x] All 41 automated tests pass (`npm test`).
- [x] Production build passes without errors (`npm run build`).
- [x] Responsive layout verified on mobile screens.
- [x] Yoruba special characters and tone marks render without clipping.
