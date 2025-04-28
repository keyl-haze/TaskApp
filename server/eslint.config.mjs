import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

export default defineConfig([
  // * JS and TS base config
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      js
    },
    rules: {
      // * Allow console.warn and console.error only
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error']
        }
      ],

      // * Unused variables config
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          caughtErrors: 'all',
          ignoreRestSiblings: true,
          reportUsedIgnorePattern: false
        }
      ]
    }
  }
]);
