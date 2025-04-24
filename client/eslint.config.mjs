import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      // * no-console rule
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],

      // * no-unused-vars rule
      "no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          caughtErrors: "all",
          ignoreRestSiblings: true,
          reportUsedIgnorePattern: false,
        },
      ],

      // * require-default-props rule
      "react/require-default-props": [
        "warn",
        {
          forbidDefaultForRequired: true,
          ignoreFunctionalComponents: true,
        },
      ],
    },
  },
];

export default eslintConfig;
