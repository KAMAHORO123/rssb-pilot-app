/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.spec.json"
      }
    ]
  },
  moduleNameMapper: {
    "\\.(css|less|scss)$": "<rootDir>/src/__mocks__/styleMock.js"
  },
  testMatch: ["<rootDir>/src/**/*.spec.{ts,tsx}"]
};
