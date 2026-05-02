import type { Meta, StoryObj } from '@storybook/angular';
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
  render: () => ({
    template: '<sk-button-secondary>Star on GitHub</sk-button-secondary>',
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: '<sk-button-secondary [disabled]="true">Disabled</sk-button-secondary>',
  }),
};

export const Small: Story = {
  render: () => ({
    template: '<sk-button-secondary size="sm">Small</sk-button-secondary>',
  }),
};

export const LightMode: Story = {
  parameters: {
    backgrounds: { default: 'sk-light' },
  },
  render: () => ({
    template: `
      <div data-theme="light" style="background: var(--sk-surface-page); padding: var(--sk-space-6); display: inline-block;">
        <sk-button-secondary>Star on GitHub</sk-button-secondary>
      </div>
    `,
  }),
};
