import globals from "globals";

export default [
  {files: ['**/*.ts']},
  {  parserOptions: {
    ecmaVersion: 8,
  }},
  {languageOptions: { globals: globals.browser } },
  {rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
  }},
];