module.exports = {
  ci: {
    collect: {
      staticDistDir: 'apps/storybook/storybook-static',
      numberOfRuns: 1,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:performance':   ['warn', { minScore: 0.7 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
