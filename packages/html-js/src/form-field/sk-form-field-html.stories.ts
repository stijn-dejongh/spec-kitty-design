import './sk-form-field.css';
import type { Meta, StoryObj } from '@storybook/angular';
import {
  SkFormInputDefaultHTML,
  SkFormInputFocusHTML,
  SkFormInputErrorHTML,
  SkFormInputDisabledHTML,
  SkFormInputFilledHTML,
  SkFormTextareaDefaultHTML,
  SkFormTextareaErrorHTML,
} from './index';

const meta: Meta = {
  title: 'Form/FormField (HTML)',
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
};

export default meta;
type Story = StoryObj;

export const FormInputDefault: Story = {
  name: 'FormInput Default',
  render: () => ({ template: SkFormInputDefaultHTML }),
};

export const FormInputFocus: Story = {
  name: 'FormInput Focus',
  render: () => ({ template: SkFormInputFocusHTML }),
};

export const FormInputError: Story = {
  name: 'FormInput Error',
  render: () => ({ template: SkFormInputErrorHTML }),
};

export const FormInputDisabled: Story = {
  name: 'FormInput Disabled',
  render: () => ({ template: SkFormInputDisabledHTML }),
};

export const FormInputFilled: Story = {
  name: 'FormInput Filled',
  render: () => ({ template: SkFormInputFilledHTML }),
};

export const FormTextareaDefault: Story = {
  name: 'FormTextarea Default',
  render: () => ({ template: SkFormTextareaDefaultHTML }),
};

export const FormTextareaError: Story = {
  name: 'FormTextarea Error',
  render: () => ({ template: SkFormTextareaErrorHTML }),
};

export const LightMode: Story = {
  parameters: { backgrounds: { default: 'sk-light' } },
  render: () => ({ template: `
    <div class="sk-light" style="background: var(--sk-surface-page); padding: var(--sk-space-6); display: inline-block;">
      ${SkFormInputDefaultHTML}
    </div>
  ` }),
};
