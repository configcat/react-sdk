import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HookPage } from './Hook';

export default {
  title: 'Showcase',
  component: HookPage,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded',
  },
} as ComponentMeta<typeof HookPage>;

const Template: ComponentStory<typeof HookPage> = (args) => <HookPage {...args} />;

export const HookTest = Template.bind({});
HookTest.args = {
  sdkKey: 'tP3YCDSlzUeMVb36fHm4Fw/6ht-YPR4Hk6D6Ou0tIKpOA',
  pollIntervalSeconds: 5,
  featureFlagKey: 'isAwesomeFeatureEnabled'
};

