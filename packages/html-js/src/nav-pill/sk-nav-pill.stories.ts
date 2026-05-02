import type { Meta, StoryObj } from '@storybook/html';
import './sk-nav-pill.css';

const meta: Meta = {
  title: 'Navigation/SkNavPill (HTML)',
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
  render: (args) => {
    const items: Array<{ label: string; href: string; active?: boolean }> = args['items'] ?? [
      { label: 'Platform', href: '#' },
      { label: 'Getting Started', href: '#', active: true },
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
    ];

    const itemsHtml = items
      .map(
        (item) =>
          `<a href="${item.href}" class="sk-nav-pill__item${item.active ? ' sk-nav-pill__item--active' : ''}"${item.active ? ' aria-current="page"' : ''}>${item.label}</a>`
      )
      .join('\n    ');

    return `<nav class="sk-nav-pill" aria-label="Primary navigation">
  <div class="sk-nav-pill__items">
    ${itemsHtml}
  </div>
  <div class="sk-nav-pill__cta">
    <button class="sk-nav-pill__cta-btn" type="button">Book Demo</button>
  </div>
</nav>`;
  },
  argTypes: {
    items: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    items: [
      { label: 'Platform', href: '#' },
      { label: 'Getting Started', href: '#' },
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
};

export const ActiveItem: Story = {
  args: {
    items: [
      { label: 'Platform', href: '#' },
      { label: 'Getting Started', href: '#', active: true },
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
};

export const Mobile: Story = {
  args: {
    items: [
      { label: 'Platform', href: '#' },
      { label: 'Getting Started', href: '#', active: true },
      { label: 'About', href: '#' },
    ],
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
