export default {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "js", "json", "node"],
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    testPathIgnorePatterns: ["/node_modules/", "/dist/"], // Ignore compiled files
    moduleNameMapper: {
        // If you are using absolute imports, map them here
        "^@/(.*)$": "<rootDir>/src/$1",
    },
};
