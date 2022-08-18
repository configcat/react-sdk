import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AutoPollWithHookPage } from './AutoPollWithHook';

export default {
  title: 'Showcase/React Hooks',
  component: AutoPollWithHookPage,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded',
  },
} as ComponentMeta<typeof AutoPollWithHookPage>;

const Template: ComponentStory<typeof AutoPollWithHookPage> = (args) => <AutoPollWithHookPage {...args} />;

export const AutoPollWithHookTest = Template.bind({});
AutoPollWithHookTest.args = {
  sdkKey: 'tP3YCDSlzUeMVb36fHm4Fw/6ht-YPR4Hk6D6Ou0tIKpOA',
  pollIntervalSeconds: 60,
  featureFlagKey: 'isAwesomeFeatureEnabled'
};

