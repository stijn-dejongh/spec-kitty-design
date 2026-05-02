import type { Meta, StoryObj } from '@storybook/angular';
import { SkNavPillComponent } from './sk-nav-pill';

const meta: Meta<SkNavPillComponent> = {
  title: 'Navigation/SkNavPill (Angular)',
  component: SkNavPillComponent,
  tags: ['autodocs'],
  parameters: {
    a11y: { disable: false },
  },
};

export default meta;
type Story = StoryObj<SkNavPillComponent>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Platform', href: '#' },
      { label: 'Getting Started', href: '#' },
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
    ],
    ctaLabel: 'Book Demo',
  },
};

export const ActiveItem: Story = {
  args: {
    items: [
      { label: 'Platform', href: '#' },
      { label: 'Getting Started', href: '#', active: true },
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
    ],
    ctaLabel: 'Book Demo',
  },
};

export const FirstItemActive: Story = {
  args: {
    items: [
      { label: 'Platform', href: '#', active: true },
      { label: 'Getting Started', href: '#' },
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
    ],
    ctaLabel: 'Book Demo',
  },
};

export const LightMode: Story = {
  render: () => ({
    template: `
      <div data-theme="light" style="background: var(--sk-surface-page); padding: var(--sk-space-6); display: inline-block;">
        <sk-nav-pill></sk-nav-pill>
      </div>
    `,
  }),
  parameters: { backgrounds: { default: 'sk-light' } },
};

export const Mobile: Story = {
  args: {
    items: [
      { label: 'Platform', href: '#' },
      { label: 'About', href: '#', active: true },
      { label: 'Blog', href: '#' },
    ],
    ctaLabel: 'Book Demo',
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
