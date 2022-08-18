import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AutoPollPage } from './AutoPoll';

export default {
  title: 'Showcase/Hook/AutoPoll',
  component: AutoPollPage,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded',
  },
} as ComponentMeta<typeof AutoPollPage>;

const Template: ComponentStory<typeof AutoPollPage> = (args) => <AutoPollPage {...args} />;

export const AutoPollTest = Template.bind({});
AutoPollTest.args = {
  sdkKey: 'tP3YCDSlzUeMVb36fHm4Fw/6ht-YPR4Hk6D6Ou0tIKpOA',
  pollIntervalSeconds: 60,
  featureFlagKey: 'isAwesomeFeatureEnabled'
};

