module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
      'react',
      'react-hooks',
      'react-native',
      'import',
      'jsx-a11y'
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:react-native/all',
      'airbnb',
      'airbnb/hooks',
    ],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
      project: './tsconfig.eslint.json',
    },
    env: {
      'react-native/react-native': true,
      browser: true,
      node: true,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Add your custom rules here
    },
  };
  