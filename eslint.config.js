import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      "indent": ["error", 2],
    }
  },

  {
    files: ["**/*.json"],
    rules: {
      "indent": ["error", 2],
      "quote-props": ["error", "always"],
      "no-unused-expressions": "off",
      "comma-dangle": ["error", "never"],
    }
  },
]);
