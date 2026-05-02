import type { Meta, StoryObj } from '@storybook/html';
import { SkTagHTML, SkEyebrowPillHTML, type PillTagVariant } from './index';
import './sk-pill-tag.css';

const meta: Meta = {
  title: 'Tags/SkPillTag (HTML)',
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
  render: (args) => SkTagHTML(args['label'] ?? 'v1.0.0', args['variant'] ?? 'default'),
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: 'select',
      options: ['default', 'green', 'purple', 'breaking', 'yellow'] satisfies PillTagVariant[],
    },
  },
};

export default meta;
type Story = StoryObj;

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
  render: () => `
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      ${SkTagHTML('v1.0.0')}
      ${SkTagHTML('Breaking', 'breaking')}
      ${SkTagHTML('SemVer', 'green')}
      ${SkTagHTML('Skills Pack', 'purple')}
      ${SkTagHTML('Schema Gate', 'yellow')}
    </div>
  `,
};

export const EyebrowPill: Story = {
  render: () => `
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      ${SkEyebrowPillHTML('For software teams adopting agentic coding')}
      ${SkEyebrowPillHTML('Open-source CLI quickstart')}
    </div>
  `,
};
