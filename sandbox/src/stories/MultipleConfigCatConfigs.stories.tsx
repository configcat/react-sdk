import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MultipleConfigCatConfigs } from './MultipleConfigCatConfigs';

export default {
  title: 'Showcase',
  component: MultipleConfigCatConfigs,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded',
  },
} as ComponentMeta<typeof MultipleConfigCatConfigs>;

const Template: ComponentStory<typeof MultipleConfigCatConfigs> = (args) => <MultipleConfigCatConfigs />;

export const MultipleConfigcatConfigs = Template.bind({});



