# Sandbox application for showcasing the features of the React SDK during development.

This project uses [Storybook](https://storybook.js.org/) to showcase and test the features of the React SDK.

## Usage

1. `npm i`
2. `npm run build`
3. `npm run storybook`

## Troubleshooting

When run from the Command Prompt on Windows, you may encounter the error: `importers[path] is not a function`.

This issue is caused by [a bug in the tooling](https://github.com/vitejs/vite/issues/18468) that occurs when the drive letter is lowercase.

If you run into this problem, use PowerShell instead.