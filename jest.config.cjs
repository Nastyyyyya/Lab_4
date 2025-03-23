module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/test/js/**/*.js'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './reports/junit',
        outputName: 'junit.xml',
      },
    ],
  ],
};
