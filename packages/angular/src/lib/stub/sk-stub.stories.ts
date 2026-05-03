import type { Meta, StoryObj } from '@storybook/angular';
import { userEvent, within } from 'storybook/test';
import { SkStubComponent } from './sk-stub';

const meta: Meta<SkStubComponent> = {
  title: 'Primitives/SkStub (Angular)',
  component: SkStubComponent,
  tags: ['autodocs'],
  parameters: {
    a11y: { disable: false },
  },
};

export default meta;
type Story = StoryObj<SkStubComponent>;

export const Default: Story = {};

export const OnLightBackground: Story = {
  parameters: { backgrounds: { default: 'sk-light' } },
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Hover: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const stub = canvas.getByRole('generic');
    await userEvent.hover(stub);
  },
};

export const LightMode: Story = {
  render: () => ({
    template: `
      <div data-theme="light" style="background:var(--sk-surface-page);padding:var(--sk-space-6);display:inline-block;">
        <sk-stub></sk-stub>
      </div>
    `,
    moduleMetadata: { imports: [SkStubComponent] },
  }),
};
