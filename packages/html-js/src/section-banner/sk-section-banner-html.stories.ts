import './sk-section-banner.css';
import type { Meta, StoryObj } from '@storybook/html';
import { SkSectionBannerNeutralHTML, SkSectionBannerPurpleHTML, SkSectionBannerGreenHTML } from './index';

const meta: Meta = {
  title: 'Primitives/SkSectionBanner (HTML)',
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
};

export default meta;
type Story = StoryObj;

export const Neutral: Story = {
  render: () => SkSectionBannerNeutralHTML,
};

export const Purple: Story = {
  render: () => SkSectionBannerPurpleHTML,
};

export const Green: Story = {
  render: () => SkSectionBannerGreenHTML,
};
