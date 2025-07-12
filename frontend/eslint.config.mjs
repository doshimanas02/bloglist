import js from '@eslint/js'
import globals from 'globals'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactHooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.jest, ...globals.vitest },
      parserOptions: {
        'ecmaVersion': 2018,
        'sourceType': 'module',
        'ecmaFeatures': {
          'jsx': true,
          'modules': true,
          'experimentalObjectRestSpread': true
        }
      },
    },
    plugins: { js, reactRefresh, react, reactHooks },
    extends: ['js/recommended'],
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 0,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 0,
      'no-unused-vars': 0,
    },
  },
  globalIgnores(['dist*', 'eslint*', 'vite*'])
])
