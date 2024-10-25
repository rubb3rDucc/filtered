import globals from "globals";
// import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslint from '@eslint/js';
// import tseslint from 'typescript-eslint';

// export default [
//   { files: ['**/*.ts', '**/*.tsx}'] },
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
// ];

export default [
  {files: ['**/*.ts']},
  // {extends: [
      { languageOptions: { globals: globals.browser } },
  //   eslint.configs.recommended,
  //   ...tseslint.configs.strict,
  // ]},
  {rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
  }},
];