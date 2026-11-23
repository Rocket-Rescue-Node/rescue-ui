import love from "eslint-config-love";
import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import globals from "globals";

export default [
  { ignores: ["dist", "scripts/dist", "public", "docs", "node_modules"] },
  {
    ...love,
    files: ["src/**/*.{ts,tsx}", "scripts/src/**/*.ts"],
  },
  {
    ...react.configs.flat.recommended,
    files: ["src/**/*.{ts,tsx}"],
    settings: { react: { version: "detect" } },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["scripts/src/**/*.ts"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["src/**/*.{ts,tsx}", "scripts/src/**/*.ts"],
    rules: {
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      // Rules added by eslint-config-love beyond the previous
      // standard-with-typescript baseline; stylistic or too noisy here.
      "@typescript-eslint/no-magic-numbers": "off",
      "@typescript-eslint/init-declarations": "off",
      "@typescript-eslint/prefer-destructuring": "off",
      "@typescript-eslint/max-params": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-type-assertion": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "@typescript-eslint/strict-void-return": "off",
      "@eslint-community/eslint-comments/require-description": "off",
      complexity: "off",
      "no-console": "off",
      "no-negated-condition": "off",
      "no-await-in-loop": "off",
    },
  },
  prettier,
];
