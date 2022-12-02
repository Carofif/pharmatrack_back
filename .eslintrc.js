
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'commonjs',
    allowImportExportEverywhere: true,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'semi': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-compare-neg-zero': 0,
    'no-trailing-space': 0,
    'linebreak-style': 0,
    'no-shadow': 0,
    'arrow-body-style': 0,
    'arrow-parens': 0,
    'no-mixed-operators': 0,
    'object-shorthand': 0,
    'prefer-template': 0,
    'no-dupe-args': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty': 'error',
    'valid-typeof': 'error',
    'no-empty-function': 'error',
    'require-await': 'error',
    'no-duplicate-imports': 'error',
    'no-multi-assign': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'vars-on-top': 'error',
    'no-unused-vars': 'error',
    'prefer-destructuring': ['error'],
    'indent': ['error', 2],
    'no-trailing-spaces': 'error'
  },
};
