module.exports = {
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "testRegex": "/tests/.*test.ts$",
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
