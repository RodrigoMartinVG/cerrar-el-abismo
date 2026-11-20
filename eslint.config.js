// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  { ignores: ['**/node_modules/', '**/dist/', '**/.astro/', 'scratch/', 'coverage/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['site/src/**/*.{ts,js}'],
    languageOptions: { globals: { ...globals.browser } },
  },
  prettier,
);
