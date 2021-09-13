module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'eslint-config-ali/typescript/react',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'prefer-const': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-no-bind': [
      'error',
      {
        ignoreDOMComponents: true,
        allowArrowFunctions: true,
      },
    ],
    'react/jsx-boolean-value': 'off',
  },
};
