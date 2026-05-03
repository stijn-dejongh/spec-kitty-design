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

export const LightMode: Story = {
  render: () => ({
    template: `
      <div data-theme="light" style="background:var(--sk-surface-page);padding:var(--sk-space-6);display:flex;flex-direction:column;gap:var(--sk-space-4);">
        <sk-section-banner variant="neutral" label="NEUTRAL — LIGHT SURFACE"></sk-section-banner>
        <sk-section-banner variant="purple"  label="PURPLE — LIGHT SURFACE"></sk-section-banner>
        <sk-section-banner variant="green"   label="GREEN — LIGHT SURFACE"></sk-section-banner>
      </div>
    `,
    moduleMetadata: { imports: [SkSectionBannerComponent] },
  }),
};
