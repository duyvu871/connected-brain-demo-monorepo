const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use a library
 * that utilizes React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/typescript",
    "@vercel/style-guide/eslint/react",
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  globals: {
    JSX: true,
  },
  settings: {
    "import/no-extraneous-dependencies": ["error", {"devDependencies": false, "optionalDependencies": false, "peerDependencies": false}],
    "import/resolver": {
      typescript: {
        project,
      },
      // node: {
      //   "allowModules": ["next", "@repo/utils", "framer-motion", "*"],
      //   extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
      //   node: {
      //     paths: ['src'], // Or an array of paths
      //   },
      // },
    },
  },
  ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js", "**/*.css"],
  // add rules configurations here
  rules: {
    "jsx-a11y/media-has-caption": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "import/no-mutable-exports": "off",
    "no-case-declarations": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/default-param-last": "off",
    "camelcase": "off",
    "no-nested-ternary": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "no-undef": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "tsdoc/syntax": "off",
    "@typescript-eslint/prefer-ts-expect-error": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "turbo/no-undeclared-env-vars": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-console": "off",
    "typescript-eslint/ban-ts-comment": "off",
    "no-unused-var": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "react/no-unknown-property": ["error", { ignore: ["class"] }],
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/prefer-for-of": "off",
    "prefer-const": "off",
    "prefer-named-capture-group": "off",
    "@typescript-eslint/no-confusing-void-expression": "off",
    'unicorn/filename-case': [
      'error',
      {
        case: 'kebabCase',
        ignore: ['ts'], // Ignore TypeScript files
      },
    ],
    '@typescript-eslint/no-unnecessary-condition': 'off',
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/label-has-for": "off",
    "import/no-default-export": "off",
  },
  overrides: [
    {
      files: ["*.config.js"],
      env: {
        node: true,
      },
    },
  ],
};
