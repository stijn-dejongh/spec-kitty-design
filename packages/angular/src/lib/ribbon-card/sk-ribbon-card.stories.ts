import type { Meta, StoryObj } from '@storybook/angular';
import { SkRibbonCardComponent } from './sk-ribbon-card';

const meta: Meta<SkRibbonCardComponent> = {
  title: 'Components/SkRibbonCard (Angular)',
  component: SkRibbonCardComponent,
  tags: ['autodocs'],
  parameters: {
    a11y: { disable: false },
  },
  argTypes: {
    ribbonLabel: { control: 'text' },
    ribbonVariant: {
      control: { type: 'radio' },
      options: ['yellow', 'green', 'purple', 'blue', 'red'],
    },
  },
};

export default meta;
type Story = StoryObj<SkRibbonCardComponent>;

export const Default: Story = {
  args: {
    ribbonLabel: null,
    ribbonVariant: 'yellow',
  },
  render: (args) => ({
    props: args,
    template: `<sk-ribbon-card [ribbonLabel]="ribbonLabel" [ribbonVariant]="ribbonVariant">
      <h4>SemVer release channel</h4>
      <p>Production-ready releases with our standard breaking-change policy.</p>
    </sk-ribbon-card>`,
  }),
};

export const WithRibbon: Story = {
  args: {
    ribbonLabel: 'Primary Workshop',
    ribbonVariant: 'yellow',
  },
  render: (args) => ({
    props: args,
    template: `<sk-ribbon-card [ribbonLabel]="ribbonLabel" [ribbonVariant]="ribbonVariant">
      <h4>Full-day rollout workshop</h4>
      <p>Get product, engineering, and reviewers aligned on Spec Kitty in your environment.</p>
    </sk-ribbon-card>`,
  }),
};

export const RibbonGreen: Story = {
  args: {
    ribbonLabel: 'Now stable',
    ribbonVariant: 'green',
  },
  render: (args) => ({
    props: args,
    template: `<sk-ribbon-card [ribbonLabel]="ribbonLabel" [ribbonVariant]="ribbonVariant">
      <h4>SemVer release channel</h4>
      <p>Production-ready releases with our standard breaking-change policy.</p>
    </sk-ribbon-card>`,
  }),
};

export const RibbonPurple: Story = {
  args: {
    ribbonLabel: 'v2.x Preview',
    ribbonVariant: 'purple',
  },
  render: (args) => ({
    props: args,
    template: `<sk-ribbon-card [ribbonLabel]="ribbonLabel" [ribbonVariant]="ribbonVariant">
      <h4>Skills Pack beta</h4>
      <p>Try the new evolution of Spec Kitty with reusable agent skills baked in.</p>
    </sk-ribbon-card>`,
  }),
};

export const LightMode: Story = {
  render: () => ({
    template: `
      <div data-theme="light" style="background: var(--sk-surface-page); padding: var(--sk-space-6); display: inline-block;">
        <sk-ribbon-card ribbonLabel="Primary Workshop" ribbonVariant="yellow">
          <h4>Full-day rollout workshop</h4>
          <p>Get product, engineering, and reviewers aligned on Spec Kitty in your environment.</p>
        </sk-ribbon-card>
      </div>
    `,
  }),
  parameters: { backgrounds: { default: 'sk-light' } },
};
