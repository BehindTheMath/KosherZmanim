module.exports = {
    "transform": {
        "^.+\\.tsx?$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
    },
    "testRegex": "/test/.*test.ts$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json"
    ],
    "globals": {
        "ts-jest": {
            "tsConfigFile": "./src/tsconfig.json"
        }
    }
};
