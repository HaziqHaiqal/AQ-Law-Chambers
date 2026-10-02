import { defineConfig, globalIgnores } from "eslint/config";
import eslintReact from "@eslint-react/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next";
import importX from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y-x";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

// Recreates eslint-config-next (core-web-vitals + typescript) with plugins that
// support ESLint 10. Switch back once eslint-config-next supports ESLint 10.
const eslintConfig = defineConfig([
  tseslint.configs.recommended,
  eslintReact.configs["recommended-typescript"],
  reactHooks.configs.flat.recommended,
  nextPlugin.configs["core-web-vitals"],
  {
    plugins: {
      "import-x": importX,
      "jsx-a11y-x": jsxA11y,
    },
    rules: {
      // @eslint-react re-implements the hooks rules; keep the official ones.
      "@eslint-react/error-boundaries": "off",
      "@eslint-react/exhaustive-deps": "off",
      "@eslint-react/purity": "off",
      "@eslint-react/rules-of-hooks": "off",
      "@eslint-react/set-state-in-effect": "off",
      "@eslint-react/set-state-in-render": "off",
      "@eslint-react/static-components": "off",
      "@eslint-react/unsupported-syntax": "off",
      "@eslint-react/use-memo": "off",
      // Naming style only; eslint-config-next had no equivalent.
      "@eslint-react/naming-convention-context-name": "off",
      "@eslint-react/naming-convention-id-name": "off",
      "@eslint-react/naming-convention-ref-name": "off",

      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "import-x/no-anonymous-default-export": "warn",
      "jsx-a11y-x/alt-text": ["warn", { elements: ["img"], img: ["Image"] }],
      "jsx-a11y-x/aria-props": "warn",
      "jsx-a11y-x/aria-proptypes": "warn",
      "jsx-a11y-x/aria-unsupported-elements": "warn",
      "jsx-a11y-x/role-has-required-aria-props": "warn",
      "jsx-a11y-x/role-supports-aria-props": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
