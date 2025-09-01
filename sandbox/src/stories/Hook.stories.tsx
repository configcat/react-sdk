import type { Meta, StoryObj } from '@storybook/react';
import { HookPage } from './Hook';

const meta: Meta<typeof HookPage> = {
  title: 'Showcase',
  component: HookPage,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded',
  },
};
export default meta;

type Story = StoryObj<typeof HookPage>;

export const HookTest: Story = {
  args: {
    sdkKey: 'tP3YCDSlzUeMVb36fHm4Fw/6ht-YPR4Hk6D6Ou0tIKpOA',
    pollIntervalSeconds: 5,
    featureFlagKey: 'isAwesomeFeatureEnabled'
  },
};
