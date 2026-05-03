import '../../../packages/tokens/src/tokens.css';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { moduleMetadata } from '@storybook/angular';
import type { Preview } from '@storybook/angular';

// Remove the default white body background that Storybook injects into preview iframes,
// so dark-mode token colours (white text, dark borders) are visible against the canvas bg.
const bodyTransparentDecorator = (story: any) => {
  document.body.style.backgroundColor = 'transparent';
  return story();
};

const preview: Preview = {
  decorators: [
    bodyTransparentDecorator,
    // Allow HTML stories to use arbitrary elements without Angular complaining.
    moduleMetadata({ schemas: [NO_ERRORS_SCHEMA] }),
  ],
  parameters: {
    backgrounds: {
      default: 'sk-dark',
      values: [
        { name: 'sk-dark', value: '#0A0A0B' },
        { name: 'sk-card', value: '#161619' },
        { name: 'sk-light', value: '#F8F5EC' },
      ],
    },
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: true }] } },
    layout: 'centered',
  },
};

export default preview;
