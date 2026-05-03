import type { Meta, StoryObj } from '@storybook/angular';
import { userEvent, within } from 'storybook/test';
import { SkButtonPrimaryComponent } from './sk-button-primary.component';

const meta: Meta<SkButtonPrimaryComponent> = {
  title: 'Components/ButtonPrimary',
  component: SkButtonPrimaryComponent,
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
type Story = StoryObj<SkButtonPrimaryComponent>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default primary CTA — yellow fill, dark ink text, pill shape. Closes #10 acceptance for the primary button styling.',
      },
    },
  },
  render: () => ({
    template: '<sk-button-primary>Get started</sk-button-primary>',
  }),
};

export const Small: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Compact size modifier — same primary palette, tighter padding and smaller type.',
      },
    },
  },
  render: () => ({
    template: '<sk-button-primary size="sm">Book demo</sk-button-primary>',
  }),
};

export const Hover: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Hover state — surfaces the primary glow shadow defined by --sk-shadow-glow-primary.',
      },
    },
  },
  render: () => ({
    template: '<sk-button-primary>Get started</sk-button-primary>',
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
    template: '<sk-button-primary>Get started</sk-button-primary>',
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
        story: 'Pressed state — exercises the scale(0.97) press-affordance defined on .sk-btn--primary:active.',
      },
    },
  },
  render: () => ({
    template: '<sk-button-primary>Get started</sk-button-primary>',
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
    template: '<sk-button-primary [disabled]="true">Disabled</sk-button-primary>',
  }),
};

export const LightMode: Story = {
  parameters: {
    backgrounds: { default: 'sk-light' },
    docs: {
      description: {
        story: 'Light-mode surface variant — the same primary CTA on the light page surface for cross-theme verification.',
      },
    },
  },
  render: () => ({
    template: `
      <div data-theme="light" style="background: var(--sk-surface-page); padding: var(--sk-space-6); display: inline-block;">
        <sk-button-primary>Get started</sk-button-primary>
      </div>
    `,
  }),
};
