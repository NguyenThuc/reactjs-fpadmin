module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  extends: ['react-app', 'prettier'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['node_modules/*'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'array-bracket-spacing': [1, 'never'],
    'arrow-parens': [1, 'always'],
    'arrow-spacing': [1],
    'block-spacing': [1, 'always'],
    'brace-style': [1, '1tbs', { allowSingleLine: true }],
    camelcase: [0, { properties: 'always' }],
    'comma-spacing': [1, { before: false, after: true }],
    'comma-style': [1, 'last'],
    'computed-property-spacing': [1, 'never'],
    'dot-location': [1, 'property'],
    'eol-last': [1, 'always'],
    'func-call-spacing': 1,
    'key-spacing': [1, { beforeColon: false, afterColon: true }],
    'keyword-spacing': [1, { before: true, after: true }],
    'max-len': [
      0,
      {
        code: 100,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'no-array-constructor': 1,
    'no-cond-assign': 1,
    'no-console': 'warn',
    'no-const-assign': 1,
    'no-constant-condition': 1,
    'no-debugger': 1,
    'no-dupe-args': 1,
    'no-dupe-keys': 1,
    'no-duplicate-case': 1,
    'no-duplicate-imports': ['warn', { includeExports: true }],
    'no-eval': 1,
    'no-ex-assign': 1,
    'no-extend-native': 1,
    'no-extra-boolean-cast': ['warn', { enforceForLogicalOperands: true }],
    'no-else-return': 1,
    'no-floating-decimal': 1,
    'no-invalid-regexp': 1,
    'no-irregular-whitespace': 1,
    'no-lonely-if': 1,
    'no-mixed-spaces-and-tabs': 1,
    'no-multi-spaces': 1,
    'no-multiple-empty-lines': [1, { max: 3 }],
    'no-nested-ternary': 2,
    'no-new-wrappers': 2,
    'no-param-reassign': 2,
    'no-proto': 1,
    'no-return-assign': 1,
    'no-throw-literal': 1,
    'no-trailing-spaces': 1,
    'no-undef': 1,
    'no-undef-init': 1,
    'no-unneeded-ternary': 1,
    'no-unused-expressions': 1,
    'no-unused-vars': [0, { vars: 'all', args: 'after-used' }],
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-var': 1,
    'no-void': 1,
    'no-whitespace-before-property': 1,
    'object-shorthand': [1, 'always'],
    'operator-assignment': [1, 'always'],
    'operator-linebreak': [
      1,
      'after',
      { overrides: { '?': 'before', ':': 'before' } },
    ],
    'prefer-const': 1,
    'quote-props': [1, 'as-needed'],
    quotes: [1, 'single', { avoidEscape: true }],
    'rest-spread-spacing': [1, 'never'],
    semi: [1, 'always'],
    'semi-spacing': [1, { before: false, after: true }],
    'space-before-blocks': [1, 'always'],
    'space-before-function-paren': [
      1,
      { anonymous: 'always', named: 'never', asyncArrow: 'always' },
    ],
    'space-in-parens': [1, 'never'],
    'space-infix-ops': [1, { int32Hint: false }],
    'space-unary-ops': [1, { words: true, nonwords: false }],
    'spaced-comment': [1, 'always'],
    strict: [1, 'never'],
    'switch-colon-spacing': 1,
    'template-curly-spacing': [1, 'never'],
    'template-tag-spacing': 1,
    'wrap-iife': [1, 'inside'],
    'jsx-a11y/anchor-is-valid': 0,
    'react-hooks/exhaustive-deps': 0,
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
    'react/prop-types': 0,
  },
};