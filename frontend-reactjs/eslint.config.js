// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config(
  [
    globalIgnores(['dist']),
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        js.configs.recommended,
        tseslint.configs.recommended,
        reactHooks.configs['recommended-latest'],
        reactRefresh.configs.vite
      ],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser
      },
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_'
          }
        ],

        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
        'no-console': 'warn',
        'no-debugger': 'error',
        'no-unused-vars': ['error', { argsIgnorePattern: '^_', args: 'none' }],
        eqeqeq: ['error', 'always'],
        'prefer-const': 'warn',
        'no-var': 'error',
        'no-useless-catch': 'off'
      }
    }
  ],
  storybook.configs['flat/recommended']
);
