import type { Meta, StoryObj } from '@storybook/angular';
import { SkCheckBulletComponent } from './sk-check-bullet';

const meta: Meta<SkCheckBulletComponent> = {
  title: 'Primitives/SkCheckBullet (Angular)',
  component: SkCheckBulletComponent,
  tags: ['autodocs'],
  parameters: {
    a11y: { disable: false },
  },
  argTypes: {
    text: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<SkCheckBulletComponent>;

export const Default: Story = {
  args: {
    text: 'Feature description here',
  },
};

export const ListOfThree: Story = {
  render: () => ({
    template: `
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px">
        <sk-check-bullet text="Developers spend time building, not being blocked on finalized requirements."></sk-check-bullet>
        <sk-check-bullet text="Works with Jira, Linear, GitHub, GitLab, and Slack."></sk-check-bullet>
        <sk-check-bullet text="Zero-config setup — connect your repo and you're ready to go."></sk-check-bullet>
      </ul>
    `,
    moduleMetadata: { imports: [SkCheckBulletComponent] },
  }),
};
