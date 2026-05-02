import type { Meta, StoryObj } from '@storybook/html';
import { SkFeatureCardYellowHTML, SkFeatureCardGreenHTML, SkFeatureCardPurpleHTML } from './index';

const meta: Meta = {
  title: 'Components/SkFeatureCard (HTML)',
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => SkFeatureCardYellowHTML,
};

export const GreenIcon: Story = {
  render: () => SkFeatureCardGreenHTML,
};

export const PurpleIcon: Story = {
  render: () => SkFeatureCardPurpleHTML,
};

export const OnLightBackground: Story = {
  render: () => SkFeatureCardYellowHTML,
  parameters: { backgrounds: { default: 'sk-light' } },
};

export const Grid: Story = {
  render: () => `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:600px;">
    ${SkFeatureCardYellowHTML}
    ${SkFeatureCardGreenHTML}
    ${SkFeatureCardPurpleHTML}
  </div>`,
};
