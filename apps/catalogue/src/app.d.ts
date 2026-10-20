declare global {
  namespace App {}
  /** 'talks' or 'projects', set by vite.config.ts from the SECTION env var. */
  const __SECTION__: 'talks' | 'projects';
}
export {};
