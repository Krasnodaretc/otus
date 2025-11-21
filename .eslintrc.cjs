module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['dist', 'node_modules'],
  overrides: [
    {
      files: ['src/diplom/**/*.ts'],
      rules: {
        'padding-line-between-statements': [
          'error',
          { blankLine: 'always', prev: '*', next: 'return' },
          { blankLine: 'always', prev: 'import', next: '*' },
          { blankLine: 'any', prev: 'import', next: 'import' },
          { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
          { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
          { blankLine: 'always', prev: ['if', 'for', 'while', 'switch'], next: '*' },
          { blankLine: 'always', prev: '*', next: ['if', 'for', 'while', 'switch'] },
        ],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      },
    },
  ],
};


