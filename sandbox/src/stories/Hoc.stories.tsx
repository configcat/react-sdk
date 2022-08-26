import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HocPage } from './Hoc';

export default {
  title: 'Showcase',
  component: HocPage,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded',
  },
} as ComponentMeta<typeof HocPage>;

const Template: ComponentStory<typeof HocPage> = (args) => <HocPage {...args} />;

export const HocTest = Template.bind({});
HocTest.args = {
  sdkKey: 'tP3YCDSlzUeMVb36fHm4Fw/6ht-YPR4Hk6D6Ou0tIKpOA',
  pollIntervalSeconds: 5,
  featureFlagKey: 'isAwesomeFeatureEnabled'
};

