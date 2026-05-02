import type { Meta, StoryObj } from '@storybook/angular';
import { SkFeatureCardComponent } from './sk-feature-card';

const meta: Meta<SkFeatureCardComponent> = {
  title: 'Components/SkFeatureCard (Angular)',
  component: SkFeatureCardComponent,
  tags: ['autodocs'],
  parameters: {
    a11y: { disable: false },
  },
  argTypes: {
    iconVariant: {
      control: { type: 'radio' },
      options: ['yellow', 'green', 'purple'],
    },
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<SkFeatureCardComponent>;

export const Default: Story = {
  args: {
    iconVariant: 'yellow',
    title: 'Stay in flow',
  },
  render: (args) => ({
    props: args,
    template: `<sk-feature-card [iconVariant]="iconVariant" [title]="title">When requirements are scattered across meetings, tickets, and chat — Spec Kitty keeps context in one place.</sk-feature-card>`,
  }),
};

export const GreenIcon: Story = {
  args: {
    iconVariant: 'green',
    title: 'Context stays put',
  },
  render: (args) => ({
    props: args,
    template: `<sk-feature-card [iconVariant]="iconVariant" [title]="title">Decisions, alternatives, and rationale live with the feature itself — never lost in a thread.</sk-feature-card>`,
  }),
};

export const PurpleIcon: Story = {
  args: {
    iconVariant: 'purple',
    title: 'Review with confidence',
  },
  render: (args) => ({
    props: args,
    template: `<sk-feature-card [iconVariant]="iconVariant" [title]="title">Every PR comes with a spec reviewers can check against — no guessing what done looks like.</sk-feature-card>`,
  }),
};

export const LightMode: Story = {
  render: () => ({
    template: `
      <div data-theme="light" style="background: var(--sk-surface-page); padding: var(--sk-space-6); display: inline-block;">
        <sk-feature-card iconVariant="yellow" title="Stay in flow">When requirements are scattered across meetings, tickets, and chat — Spec Kitty keeps context in one place.</sk-feature-card>
      </div>
    `,
  }),
  parameters: { backgrounds: { default: 'sk-light' } },
};
