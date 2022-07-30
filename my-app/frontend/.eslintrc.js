/* eslint-disable */
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react", "jest"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "eqeqeq": 2,
        "no-trailing-spaces": 2,
        "object-curly-spacing": [
            "error", "always"
        ],
        "arrow-spacing": [
            "error", { "before": true, "after": true }
        ],
        "no-console": 0,
        "react/prop-types": 1,
        "no-unused-vars": 1,
        "no-duplicate-imports": 2,
        "camelcase": 1,
        "capitalized-comments": 1,
        "no-var": 1,
        "require-await": 2,
        "yoda": 1
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    }
}