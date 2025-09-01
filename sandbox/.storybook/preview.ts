import addonLinks from "@storybook/addon-links";
import { definePreview } from '@storybook/react-vite'

const preview = definePreview({
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  addons: [addonLinks()]
});

export default preview;