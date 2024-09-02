import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MicroFePage } from './MicroFe';

export default {
  title: 'Showcase',
  component: MicroFePage,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded',
  },
} as ComponentMeta<typeof MicroFePage>;

const Template: ComponentStory<typeof MicroFePage> = (args) => <MicroFePage />;

export const MicroFe = Template.bind({});



