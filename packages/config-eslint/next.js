const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    ...[
      "@vercel/style-guide/eslint/node",
      "@vercel/style-guide/eslint/typescript",
      "@vercel/style-guide/eslint/browser",
      "@vercel/style-guide/eslint/react",
      "@vercel/style-guide/eslint/next",
    ].map(require.resolve),
    "turbo",
  ],
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
    TSX: true,
  },
  settings: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    "import/resolver": {
      typescript: {
        project,
      },
      node: {
        "allowModules": ["next", "@repo/utils", "*"],
        extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
        node: {
          paths: ['src'], // Or an array of paths
        },
      },
    },
  },

  ignorePatterns: ["node_modules/", "dist/"],
  // add rules configurations here
  rules: {
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "jsx-a11y/label-has-associated-control": "off",
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
    "react/function-component-definition": "off",
    "eslint-comments/require-description": "off",
    "react/hook-use-state": "off",
    "import/no-cycle": "off",
    "@typescript-eslint/non-nullable-type-assertion-style": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "prefer-template": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "import/order": "off",
    "react/jsx-no-useless-fragment": "off",
    "no-unused-var": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
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
    "import/no-default-export": "off",
    // 'import/no-unresolved': [2, {
    //   "commonjs": true,
    //   "amd": true,
    //   "node": true, // Enables Node.js style resolution
    // }],
    "import/resolver": "off",
  },
};
