import type { Meta, StoryObj } from '@storybook/react-vite';
import { MultipleConfigCatConfigs } from './MultipleConfigCatConfigs';

const meta: Meta<typeof MultipleConfigCatConfigs> = {
  title: 'Showcase',
  component: MultipleConfigCatConfigs,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded',
  },
};
export default meta;

type Story = StoryObj<typeof MultipleConfigCatConfigs>;

export const MultipleConfigcatConfigs: Story = {
};
