import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    rules: [{ 'react-hooks/incompatible-library': false }],
    extends: [
      js.configs.recommended,
      reactRefresh.configs.vite,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
  },
]);
