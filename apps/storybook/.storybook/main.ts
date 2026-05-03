import type { StorybookConfig } from '@storybook/angular';
import { fileURLToPath } from 'url';
import path from 'path';
import type { Configuration } from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
    '../../../packages/**/*.stories.@(ts|tsx)',
    '../src/**/*.mdx',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/angular', options: {} },
  docs: { defaultName: 'Docs' },
  staticDirs: [
    {
      from: path.resolve(__dirname, '../../../packages/tokens/assets'),
      to: '/tokens-assets',
    },
    {
      from: path.resolve(__dirname, '../../../packages/tokens/fonts'),
      to: '/fonts',
    },
  ],
  webpackFinal: async (webpackConfig: Configuration) => {
    const rules = webpackConfig.module?.rules ?? [];
    const htmlJsPath = path.resolve(__dirname, '../../../packages/html-js');
    const tokensPath = path.resolve(__dirname, '../../../packages/tokens');
    // Allow direct CSS imports (ES module style) from html-js stories and tokens preview.
    // Angular component CSS files (packages/angular) go through the Angular pipeline — do NOT include them here.
    // url: true (default) so webpack rewrites ./fonts/ references in tokens.css correctly.
    rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        { loader: 'css-loader', options: { sourceMap: false, import: false } },
      ],
      include: [htmlJsPath, tokensPath],
    });
    // Serve font files referenced by tokens.css (./fonts/... relative URLs).
    rules.push({
      test: /\.(otf|ttf|woff2?)$/,
      type: 'asset/resource',
      include: [tokensPath],
    });
    if (webpackConfig.module) {
      webpackConfig.module.rules = rules;
    }
    return webpackConfig;
  },
};

export default config;
