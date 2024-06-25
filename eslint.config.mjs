import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsdoc from 'eslint-plugin-tsdoc';
import _import from 'eslint-plugin-import';
import preferArrow from 'eslint-plugin-prefer-arrow';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import fileExtensionInImportTs from 'eslint-plugin-file-extension-in-import-ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: [
      'coverage/**/*',
      'lib/**/*',
      'bin-src/*.ts',
      'bin-src/**/*.ts',
      '**/eslint.config.mjs',
      '**/jest.config.mjs',
      '.prettierrc.mjs'
    ]
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:prettier/recommended',
      'prettier'
    )
  ),
  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      tsdoc,
      'file-extension-in-import-ts': fixupPluginRules(fileExtensionInImportTs),
      import: fixupPluginRules(_import),
      'prefer-arrow': preferArrow,
      prettier: fixupPluginRules(prettier),
      'simple-import-sort': simpleImportSort
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: 'module',

      parserOptions: {
        project: ['tsconfig.json'],

        ecmaFeatures: {
          jsx: true,
          modules: true
        }
      }
    },

    settings: {
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', 'src']
        }
      }
    },

    rules: {
      'import/namespace': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],

      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'no-constant-condition': 'off',
      'no-extra-boolean-cast': 'off',
      eqeqeq: ['error', 'always'],

      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'import/no-unresolved': ['error', { ignore: ['\\.js$'] }],
      'file-extension-in-import-ts/file-extension-in-import-ts': 'error',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'tsdoc/syntax': 'warn'
    }
  }
];
