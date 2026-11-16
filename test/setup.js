import '@testing-library/jest-dom';

// Polyfill/mock localStorage for Node 26 + jsdom compatibility
const storage = {};
const localStorageMock = {
  getItem: (key) => storage[key] ?? null,
  setItem: (key, value) => {
    storage[key] = String(value);
  },
  removeItem: (key) => {
    delete storage[key];
  },
  clear: () => {
    Object.keys(storage).forEach((k) => delete storage[k]);
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
  writable: true,
});
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    configurable: true,
    writable: true,
  });
}
