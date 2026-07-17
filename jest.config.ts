import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  roots: ["<rootDir>/src"],

  testMatch: ["**/tests/**/*.e2e.spec.ts"],

  moduleFileExtensions: ["ts", "js", "json"],

  setupFiles: ["<rootDir>/jest.setup.ts"],

  clearMocks: true,
  verbose: true,
};

export default config;
