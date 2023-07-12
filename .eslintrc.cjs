module.exports = {
  root: true,
  extends: [
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  parserOptions: {
    project: './src/tsconfig.json',
  },
  rules: {
    '@typescript-eslint/indent': ['error', 2, {
      FunctionExpression: {
        parameters: 2,
      },
      SwitchCase: 1,
    }],
    'import/prefer-default-export': 'off',
    'lines-between-class-members': ['error', 'always', {
      exceptAfterSingleLine: true,
    }],
    // TODO: Change to 100
    'max-len': ['off', 120],
    'no-plusplus': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'variable',
        'format': [
          'camelCase',
          'PascalCase',
          'UPPER_CASE',
        ],
        filter: {
          regex: '^Long_MIN_VALUE$',
          match: false,
        },
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    'object-curly-newline': ['error', {
      multiline: true,
      consistent: true,
    }],
    'prefer-destructuring': ['error', {
      AssignmentExpression: {
        array: false,
      },
    }],
    'no-else-return': ['error', {
      allowElseIf: true,
    }],
    'no-underscore-dangle': 'off',
    'operator-assignment': 'off',
    '@typescript-eslint/no-use-before-define': ['error', {
      functions: false,
    }],
  }
};
