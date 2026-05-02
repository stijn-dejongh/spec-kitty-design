import type { Meta, StoryObj } from '@storybook/angular';
import { SkPillTagComponent, type PillTagVariant } from './sk-pill-tag';
import { SkEyebrowPillComponent } from './sk-eyebrow-pill';

const meta: Meta<SkPillTagComponent> = {
  title: 'Tags/SkPillTag (Angular)',
  component: SkPillTagComponent,
  tags: ['autodocs'],
  parameters: {
    a11y: { disable: false },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'green', 'purple', 'breaking', 'yellow'] satisfies PillTagVariant[],
    },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<SkPillTagComponent>;

export const Default: Story = {
  args: { label: 'v1.0.0', variant: 'default' },
};

export const Green: Story = {
  args: { label: 'SemVer', variant: 'green' },
};

export const Purple: Story = {
  args: { label: 'Skills Pack', variant: 'purple' },
};

export const Breaking: Story = {
  args: { label: 'Breaking', variant: 'breaking' },
};

export const Yellow: Story = {
  args: { label: 'Schema Gate', variant: 'yellow' },
};

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [SkPillTagComponent] },
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <sk-pill-tag label="v1.0.0"></sk-pill-tag>
        <sk-pill-tag label="Breaking" variant="breaking"></sk-pill-tag>
        <sk-pill-tag label="SemVer" variant="green"></sk-pill-tag>
        <sk-pill-tag label="Skills Pack" variant="purple"></sk-pill-tag>
        <sk-pill-tag label="Schema Gate" variant="yellow"></sk-pill-tag>
      </div>
    `,
  }),
};

export const LightMode: Story = {
  render: () => ({
    moduleMetadata: { imports: [SkPillTagComponent] },
    template: `
      <div data-theme="light" style="background: var(--sk-surface-page); padding: var(--sk-space-6); display: inline-block;">
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
          <sk-pill-tag label="v1.0.0"></sk-pill-tag>
          <sk-pill-tag label="Breaking" variant="breaking"></sk-pill-tag>
          <sk-pill-tag label="SemVer" variant="green"></sk-pill-tag>
          <sk-pill-tag label="Skills Pack" variant="purple"></sk-pill-tag>
          <sk-pill-tag label="Schema Gate" variant="yellow"></sk-pill-tag>
        </div>
      </div>
    `,
  }),
  parameters: { backgrounds: { default: 'sk-light' } },
};

export const EyebrowPill: Story = {
  render: () => ({
    moduleMetadata: { imports: [SkEyebrowPillComponent] },
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <sk-eyebrow-pill label="For software teams adopting agentic coding"></sk-eyebrow-pill>
        <sk-eyebrow-pill label="Open-source CLI quickstart"></sk-eyebrow-pill>
      </div>
    `,
  }),
};
