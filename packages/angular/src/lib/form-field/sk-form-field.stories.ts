import type { Meta, StoryObj } from '@storybook/angular';
import { userEvent, within } from 'storybook/test';
import { CommonModule } from '@angular/common';
import { SkFormFieldComponent } from './sk-form-field';
import { SkFormInputComponent } from './sk-form-input';
import { SkFormTextareaComponent } from './sk-form-textarea';

// ------------------------------------------------------------------ //
// FormInput stories
// ------------------------------------------------------------------ //

const inputMeta: Meta<SkFormInputComponent> = {
  title: 'Form/FormInput (Angular)',
  component: SkFormInputComponent,
  tags: ['autodocs'],
  parameters: {
    a11y: { disable: false },
  },
};

export default inputMeta;
type InputStory = StoryObj<SkFormInputComponent>;

/** Default: empty input with label, wrapped in a FormField. */
export const FormInputDefault: InputStory = {
  name: 'FormInput Default',
  render: () => ({
    props: {},
    moduleMetadata: { imports: [CommonModule, SkFormFieldComponent, SkFormInputComponent] },
    template: `
      <sk-form-field
        label="Email address"
        description="We'll never share your email."
        fieldId="story-default"
      >
        <sk-form-input
          inputId="story-default"
          type="email"
          placeholder="you@team.com"
        ></sk-form-input>
      </sk-form-field>
    `,
  }),
};

/** Focus: triggers focus on the input via a play function. */
export const FormInputFocus: InputStory = {
  name: 'FormInput Focus',
  render: () => ({
    props: {},
    moduleMetadata: { imports: [CommonModule, SkFormFieldComponent, SkFormInputComponent] },
    template: `
      <sk-form-field
        label="Workspace name"
        description="Your team's workspace identifier."
        fieldId="story-focus"
      >
        <sk-form-input
          inputId="story-focus"
          type="text"
          value="Acme Robotics"
        ></sk-form-input>
      </sk-form-field>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await userEvent.click(input);
  },
};

/**
 * Error: aria-invalid="true" set on the input, error message linked via
 * aria-describedby. Required for axe / WCAG 2.1 AA compliance.
 */
export const FormInputError: InputStory = {
  name: 'FormInput Error',
  render: () => ({
    props: {},
    moduleMetadata: { imports: [CommonModule, SkFormFieldComponent, SkFormInputComponent] },
    template: `
      <sk-form-field
        label="Email address"
        errorMessage="Please enter a valid email address."
        [hasError]="true"
        fieldId="story-error"
      >
        <sk-form-input
          inputId="story-error"
          type="email"
          [hasError]="true"
        ></sk-form-input>
      </sk-form-field>
    `,
  }),
};

/** Disabled: the input is non-interactive, shown at reduced opacity. */
export const FormInputDisabled: InputStory = {
  name: 'FormInput Disabled',
  render: () => ({
    props: {},
    moduleMetadata: { imports: [CommonModule, SkFormFieldComponent, SkFormInputComponent] },
    template: `
      <sk-form-field
        label="Email address"
        description="This field is currently unavailable."
        fieldId="story-disabled"
      >
        <sk-form-input
          inputId="story-disabled"
          type="email"
          placeholder="you@team.com"
          [disabled]="true"
        ></sk-form-input>
      </sk-form-field>
    `,
  }),
};

/** Filled: input already has a value (the "Filled" state from the reference). */
export const FormInputFilled: InputStory = {
  name: 'FormInput Filled',
  render: () => ({
    props: {},
    moduleMetadata: { imports: [CommonModule, SkFormFieldComponent, SkFormInputComponent] },
    template: `
      <sk-form-field
        label="Email address"
        description="We'll never share your email."
        fieldId="story-filled"
      >
        <sk-form-input
          inputId="story-filled"
          type="email"
          value="ada@team.com"
        ></sk-form-input>
      </sk-form-field>
    `,
  }),
};

// ------------------------------------------------------------------ //
// FormTextarea stories
// ------------------------------------------------------------------ //

/** Textarea Default: empty textarea with a label and helper text. */
export const FormTextareaDefault: InputStory = {
  name: 'FormTextarea Default',
  render: () => ({
    props: {},
    moduleMetadata: { imports: [CommonModule, SkFormFieldComponent, SkFormTextareaComponent] },
    template: `
      <sk-form-field
        label="What are you trying to ship?"
        description="Keep it brief — one or two sentences."
        fieldId="story-ta-default"
      >
        <sk-form-textarea
          textareaId="story-ta-default"
          placeholder="Describe your goal..."
          [rows]="4"
        ></sk-form-textarea>
      </sk-form-field>
    `,
  }),
};

/**
 * Textarea Error: aria-invalid and aria-describedby wired up for axe compliance.
 */
export const FormTextareaError: InputStory = {
  name: 'FormTextarea Error',
  render: () => ({
    props: {},
    moduleMetadata: { imports: [CommonModule, SkFormFieldComponent, SkFormTextareaComponent] },
    template: `
      <sk-form-field
        label="What are you trying to ship?"
        errorMessage="This field is required."
        [hasError]="true"
        fieldId="story-ta-error"
      >
        <sk-form-textarea
          textareaId="story-ta-error"
          [hasError]="true"
          [rows]="4"
        ></sk-form-textarea>
      </sk-form-field>
    `,
  }),
};

export const LightMode: InputStory = {
  name: 'Light Mode',
  render: () => ({
    props: {},
    moduleMetadata: { imports: [CommonModule, SkFormFieldComponent, SkFormInputComponent] },
    template: `
      <div class="sk-light" style="background:var(--sk-surface-page);padding:var(--sk-space-6);display:inline-block;min-width:320px;">
        <sk-form-field label="Your name" fieldId="story-lm-name">
          <sk-form-input inputId="story-lm-name" placeholder="Jane Smith"></sk-form-input>
        </sk-form-field>
      </div>
    `,
  }),
};
