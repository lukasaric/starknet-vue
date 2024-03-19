/**
 * Shared eslint config
 * https://eslint.org/docs/latest/
 *
 * Partially based on
 * - https://github.com/antfu/eslint-config/blob/main/packages/eslint-config-basic
 */

// A patch that improves how ESLint loads plugins when
// working in a monorepo with a reusable toolchain.
// https://github.com/microsoft/rushstack/tree/main/eslint/eslint-patch
require('@rushstack/eslint-patch/modern-module-resolution')

/** @type {import('eslint').ESLint.ConfigData}  */
module.exports = {
  parserOptions: {
    ecmaVersion: '2018',
    parser: {
      js: 'espree',
      jsx: 'espree',
      // eslint-disable-next-line sonarjs/no-duplicate-string
      ts: '@typescript-eslint/parser',
      tsx: '@typescript-eslint/parser',
    },
    extraFileExtensions: ['.vue'],
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  // Reports errors for unused `eslint-disable directives`
  // when no problems would be reported in the disabled area
  // https://eslint.org/docs/latest/integrate/nodejs-api#linterverify
  reportUnusedDisableDirectives: true,
  ignorePatterns: [
    '__snapshots__',
    '.nuxt',
    '.output',
    '*.d.ts',
    '*.min.*',
    'build',
    'CHANGELOG.md',
    'coverage',
    'dist',
    'LICENSE*',
    'node_modules',
    'out',
    'output',
    'package-lock.json',
    'pnpm-lock.yaml',
    'public',
    'temp',
    'yarn.lock',
    // ignore for in lint-staged
    '*.css',
    '*.png',
    '*.ico',
    '*.toml',
    '*.patch',
    '*.txt',
    '*.crt',
    '*.csr',
    '*.key',
    'Dockerfile',
    '!.vscode',
  ],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'standard',
    // 'plugin:n/recommended', // Disabled to to config collision with 'standard'
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:eslint-comments/recommended',
    'plugin:sonarjs/recommended',
    'plugin:no-unsanitized/DOM',
    // 'plugin:unicorn/recommended',
    'prettier',
  ],
  plugins: [
    '@typescript-eslint',
    'html',
    'promise',
    'unused-imports',
    'sonarjs',
  ],
  // Shared configuration for rules
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.mjs', 'cjs', '.ts', '.tsx', '.d.ts'],
      },
    },
  },
  rules: {
    /** General Code Rules **/
    // Handled by unused-imports/no-unused-imports
    '@typescript-eslint/no-unused-vars': 'off',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': [
      'error',
      { ignoreDeclarationMerge: true },
    ],
    // 'n/no-missing-import': 0,
    // 'n/no-missing-require': 0,
    // Enforce import order
    'import/order': 'error',
    // Imports should come first
    'import/first': 'error',
    // Exporting mutable variables
    'import/no-mutable-exports': 'error',
    // Allow unresolved imports
    'import/no-unresolved': 'off',
    // Allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    // Prefer const over let
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      },
    ],
    // No single if in an "else" block
    'no-lonely-if': 'error',
    // Force curly braces for control flow, including if blocks with a single statement
    curly: 'off',
    // No async function without await
    'require-await': 'error',
    // Force dot notation when possible
    'dot-notation': 1,
    // Warn for void usage
    'no-void': 1,
    'no-var': 'error',
    // Force object shorthand where possible
    'object-shorthand': 'error',
    // No useless destructuring/importing/exporting renames
    'no-useless-rename': 'error',
    // Per the docs, the root no-unused-vars should be disabled:
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
    // '@typescript-eslint/no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_' }],
    'no-unused-vars': 'off',
    // https://github.com/typescript-eslint/typescript-eslint/blob/1cf9243/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
    'no-undef': 'off',

    /** Formatting (not handled by Prettier) **/
    // Deprecated
    'newline-before-return': 'off',
    // Deprecated
    'newline-after-var': 'off',
    // https://eslint.org/docs/latest/rules/padding-line-between-statements
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'var', next: 'return' },
      { blankLine: 'always', prev: 'var', next: 'block' },
      { blankLine: 'always', prev: 'block', next: 'return' },
    ],

    /** Performance Tweaks for ESLint ***/
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/linting/TROUBLESHOOTING.md#eslint-plugin-import
    indent: 0,
    '@typescript-eslint/indent': 0,
    // Disable to increase eslint performance as TypeScript covers its usecase
    'import/no-named-as-default-member': 0,
    // Disable to increase eslint performance as TypeScript covers its usecase
    'import/default': 0,
    // Allow unverifiable namespaces of imports
    // Disable to increase eslint performance as TypeScript covers its usecase
    'import/namespace': 0,
    // Name imports result sometimes in errors, as type definitions are incomplete
    // Disable to increase eslint performance as TypeScript covers its usecase
    'import/named': 0,
    'import/no-named-as-default': 0,

    /** Additional Rule Tweaks **/
    'eslint-comments/no-unlimited-disable': 1,
    // Use node internals and types to check for extraneous imports of dependencies
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': [
      'error',
      { includeInternal: true, includeTypes: true },
    ],

    /** Prettier Compatibility **/
    'space-before-function-paren': 0,

    /** Disallowed Imports **/
    'no-restricted-imports': [
      'error',
      // Forbid importing "Lodash" package since it's replaced with "Radash"
      {
        paths: [
          {
            name: 'lodash',
            message: 'Usage radash instead of lodash ',
          },
        ],
        patterns: [
          {
            group: ['lodash/*', 'lodash-es/*'],
            message: 'Usage radash instead of lodash',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
    },
    {
      files: ['*.ts', '*.tsx', '*.mts', '*.cts', '*.vue'],
      rules: {
        // The rule `no-unused-vars` of `eslint:recommended`
        // does not work with TypeScripts type definitions.
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
        'no-unused-vars': 'off',
        // https://github.com/typescript-eslint/typescript-eslint/blob/1cf9243/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
        ],
      },
    },
    {
      // TypeScript Definitions specific overrides
      files: ['*.d.ts'],
      rules: {
        'import/no-duplicates': 'off',
      },
    },
  ],
}
