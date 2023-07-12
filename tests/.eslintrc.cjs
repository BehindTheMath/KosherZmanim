const path = require('path');

module.exports = {
  extends: path.resolve(__dirname, '../.eslintrc.cjs'),
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
  },
  rules: {
    'prefer-arrow-callback': 'off',
    'func-names': 'off',
  },
};
