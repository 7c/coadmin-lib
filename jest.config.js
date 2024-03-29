const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
      preset: 'ts-jest',
      testEnvironment: 'node',
      verbose: true,
      // silent: true,
      randomize: true,
      testTimeout: 20000,
      // collectCoverage: true,
      // debug:true,
      maxWorkers: 1,
      testMatch: [
            "**/?(*.)+(jest|test).(ts|js)"
      ],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
      modulePaths: [compilerOptions.baseUrl],
      setupFilesAfterEnv: ["<rootDir>/jest/jestsetup.js"],
}
