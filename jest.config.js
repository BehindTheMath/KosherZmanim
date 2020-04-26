module.exports = {
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "testRegex": "/tests/.*test.ts$",
    "moduleFileExtensions": [
        "ts",
        "js",
    ],
    "globals": {
        "ts-jest": {
            "tsConfig": "./src/tsconfig.json"
        }
    },
    preset: 'ts-jest',
};
