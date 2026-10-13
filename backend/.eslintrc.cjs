module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module"
  },
  env: {
    node: true,
    es2021: true
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  overrides: [
    {
      files: ["src/**/*.spec.ts"],
      rules: {
        // Tests frequently use `any` for mocks; keep lint focused on production code.
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ],
  ignorePatterns: ["dist", "node_modules"]
};
