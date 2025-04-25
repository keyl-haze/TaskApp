import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import globals from 'globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      js
    },
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      // * no-console rule
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error']
        }
      ],

      // * no-unused-vars rule
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          caughtErrors: 'all',
          ignoreRestSiblings: true,
          reportUsedIgnorePattern: false
        }
      ],

      // * require-default-props rule
      'react/require-default-props': [
        'warn',
        {
          forbidDefaultForRequired: true,
          ignoreFunctionalComponents: true
        }
      ]
    }
  }
]
