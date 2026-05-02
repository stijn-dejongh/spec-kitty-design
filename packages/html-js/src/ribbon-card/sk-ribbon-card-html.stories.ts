import './sk-ribbon-card.css';
import type { Meta, StoryObj } from '@storybook/html';
import { skRibbonCardHTML, SkRibbonCardDefaultHTML, SkRibbonCardWithRibbonHTML } from './index';

const meta: Meta = {
  title: 'Components/SkRibbonCard (HTML)',
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => SkRibbonCardDefaultHTML,
};

export const WithRibbon: Story = {
  render: () => SkRibbonCardWithRibbonHTML,
};

export const RibbonYellow: Story = {
  render: () => skRibbonCardHTML({
    title: 'Full-day rollout workshop',
    body: 'Get product, engineering, and reviewers aligned on Spec Kitty in your environment.',
    ribbonLabel: 'Primary Workshop',
    ribbonVariant: 'yellow',
  }),
};

export const RibbonGreen: Story = {
  render: () => skRibbonCardHTML({
    title: 'SemVer release channel',
    body: 'Production-ready releases with our standard breaking-change policy.',
    ribbonLabel: 'Now stable',
    ribbonVariant: 'green',
  }),
};

export const RibbonPurple: Story = {
  render: () => skRibbonCardHTML({
    title: 'Skills Pack beta',
    body: 'Try the new evolution of Spec Kitty with reusable agent skills baked in.',
    ribbonLabel: 'v2.x Preview',
    ribbonVariant: 'purple',
  }),
};

export const LightMode: Story = {
  parameters: { backgrounds: { default: 'sk-light' } },
  render: () => `
    <div data-theme="light" style="background: var(--sk-surface-page); padding: var(--sk-space-6); display: inline-block;">
      ${SkRibbonCardWithRibbonHTML}
    </div>
  `,
};
