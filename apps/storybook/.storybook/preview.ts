import '../../../packages/tokens/src/tokens.css';
import type { Preview } from '@storybook/angular';

const preview: Preview = {
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
