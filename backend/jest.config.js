module.exports = {
    preset: '@shelf/jest-mongodb',
    setupFilesAfterEnv: ['./setupTests.js'],
    watchPathIgnorePatterns: ['globalConfig'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
