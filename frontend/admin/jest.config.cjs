module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],

  moduleNameMapper: {
    "^.*services/axios$": "<rootDir>/tests/__mocks__/axiosInstance.ts",
  },

  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json",
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: { 
                metaObjectReplacement: { 
                  env: { VITE_BACKEND_URL: 'http://localhost:3001' } 
                } 
              }
            }
          ]
        }
      }
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};