import type { Meta, StoryObj } from '@storybook/angular';
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
  render: () => ({
    template: '<sk-button-primary>Get started</sk-button-primary>',
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: '<sk-button-primary [disabled]="true">Disabled</sk-button-primary>',
  }),
};

export const Small: Story = {
  render: () => ({
    template: '<sk-button-primary size="sm">Small</sk-button-primary>',
  }),
};

export const LightBackground: Story = {
  parameters: {
    backgrounds: { default: 'sk-light' },
  },
  render: () => ({
    template: '<sk-button-primary>On light</sk-button-primary>',
  }),
};
