import type { Meta, StoryObj } from '@storybook/angular';
import { SkSectionBannerComponent } from './sk-section-banner';

const meta: Meta<SkSectionBannerComponent> = {
  title: 'Primitives/SkSectionBanner (Angular)',
  component: SkSectionBannerComponent,
  tags: ['autodocs'],
  parameters: {
    a11y: { disable: false },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'purple', 'green'],
    },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<SkSectionBannerComponent>;

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    label: 'VERSION 1.X — FIRST STABLE RELEASE',
  },
};

export const Purple: Story = {
  args: {
    variant: 'purple',
    label: 'VERSION 2.X — EVENT ARCHITECTURE & SKILLS',
  },
};

export const Green: Story = {
  args: {
    variant: 'green',
    label: 'VERSION 3.X — STABLE RELEASE',
  },
};
