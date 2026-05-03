import type { Meta, StoryObj } from '@storybook/angular';
import { userEvent, within } from 'storybook/test';
import { SkButtonSecondaryComponent } from './sk-button-secondary.component';

const meta: Meta<SkButtonSecondaryComponent> = {
  title: 'Components/ButtonSecondary',
  component: SkButtonSecondaryComponent,
  tags: ['autodocs'],
  parameters: {
    a11y: { disable: false },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    size: { control: 'radio', options: ['default', 'sm'] },
  },
};

export default meta;
type Story = StoryObj<SkButtonSecondaryComponent>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default secondary CTA — transparent fill, default-foreground text, hairline border. Closes #10 acceptance for the secondary button styling.',
      },
    },
  },
  render: () => ({
    template: '<sk-button-secondary>Star on GitHub</sk-button-secondary>',
  }),
};

export const Small: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Compact size modifier — same secondary palette, tighter padding and smaller type.',
      },
    },
  },
  render: () => ({
    template: '<sk-button-secondary size="sm">Read the docs</sk-button-secondary>',
  }),
};

export const Hover: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Hover state — strengthens the border colour to --sk-border-strong; no fill change.',
      },
    },
  },
  render: () => ({
    template: '<sk-button-secondary>Star on GitHub</sk-button-secondary>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.hover(button);
  },
};

export const Focus: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Keyboard-focused state — verifies the focus-ring treatment inherits from the global token.',
      },
    },
  },
  render: () => ({
    template: '<sk-button-secondary>Star on GitHub</sk-button-secondary>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    button.focus();
  },
};

export const Active: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pressed state — pointer-down on the secondary CTA. Visually identical to Hover today; reserved for press-affordance refinement.',
      },
    },
  },
  render: () => ({
    template: '<sk-button-secondary>Star on GitHub</sk-button-secondary>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.pointer({ target: button, keys: '[MouseLeft>]' });
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Non-interactive disabled state — reduces opacity and disables pointer events.',
      },
    },
  },
  render: () => ({
    template: '<sk-button-secondary [disabled]="true">Disabled</sk-button-secondary>',
  }),
};

export const LightMode: Story = {
  parameters: {
    backgrounds: { default: 'sk-light' },
    docs: {
      description: {
        story: 'Light-mode surface variant — the same secondary CTA on the light page surface for cross-theme verification.',
      },
    },
  },
  render: () => ({
    template: `
      <div data-theme="light" style="background: var(--sk-surface-page); padding: var(--sk-space-6); display: inline-block;">
        <sk-button-secondary>Star on GitHub</sk-button-secondary>
      </div>
    `,
  }),
};
