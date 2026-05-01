module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [
      'tokens', 'angular', 'html-js', 'storybook',
      'doctrine', 'ci', 'docs', 'release', 'deps', 'security',
    ]],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
  },
};
