module.exports = {
  extends: 'airbnb',
  rules: {
    'no-useless-catch': [0],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/prop-types': [0],
    quotes: [0],
  },
  env: {
    browser: true,
    node: true,
  },
};
