import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    '../../../packages/**/*.stories.@(ts|tsx)',
    '../../../packages/**/*.stories.html.ts',
    '../src/**/*.mdx',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/angular', options: {} },
  docs: { defaultName: 'Docs' },
};

export default config;
