import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { defineConfig } from 'vite';

// One app, two sites: SECTION=talks or SECTION=projects picks the data slice and output folder.
const section = process.env.SECTION ?? 'talks';
if (!['talks', 'projects'].includes(section)) throw new Error(`Unknown SECTION "${section}"`);

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({ pages: `build-${section}`, assets: `build-${section}`, strict: true }),
      outDir: `.svelte-kit/${section}`
    })
  ],
  define: { __SECTION__: JSON.stringify(section) },
  server: { fs: { allow: ['../..'] } }
});
