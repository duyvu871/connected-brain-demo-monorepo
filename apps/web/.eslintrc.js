module.exports = {
  extends: ["@repo/eslint-config/next.js"],
  rules: {
    "import/no-extraneous-dependencies": "off",
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  },
};
