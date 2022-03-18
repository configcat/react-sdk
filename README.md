# ConfigCat SDK for React applications (alpha version)

https://configcat.com

ConfigCat SDK for React provides easy integration for your web application to ConfigCat.

## About

Manage features and change your software configuration using <a href="https://configcat.com" target="_blank">ConfigCat feature flags</a>
, without the need to re-deploy code. A <a href="https://app.configcat.com" target="_blank">10 minute trainable Dashboard</a>
allows even non-technical team members to manage features directly. Deploy anytime, release when confident.
Target a specific group of users first with new ideas. Supports A/B/n testing and soft launching.

ConfigCat is a <a href="https://configcat.com" target="_blank">hosted feature flag service</a>. Manage feature toggles across frontend, backend, mobile, desktop apps. <a href="https://configcat.com" target="_blank">Alternative to LaunchDarkly</a>. Management app + feature flag SDKs.

## Getting Started

ConfigCat React SDK builts on our configcat-js SDK (TODO link here). It uses Context API (requires React **16.3** or later) and Hook API (requires React **16.8** or later) to provide a better integration in your React application.

### 1. Install package:

_via NPM [package](https://npmjs.com/package/configcat-react):_

```PowerShell
npm i configcat-react
```

### 2. Go to the <a href="https://app.configcat.com/sdkkey" target="_blank">ConfigCat Dashboard</a> to get your _SDK Key_:

![SDK-KEY](https://raw.githubusercontent.com/ConfigCat/react-sdk/master/media/readme02-3.png "SDK-KEY")

### 3. Import and initialize ConfigCatProvider

In most cases you should wrap your root component with `ConfigCatProvider` to access ConfigCat features in child components with Context API.

```js
import React from "react";
import { ConfigCatProvider } from "configcat-react";

function App() {
  return (
    <ConfigCatProvider
      client={/* pass your configcat instance */}
    >
      {/* your application code */}
    </ConfigCatProvider>
  );
}

export default App;
```

### 4. Get your setting value:

#### 1. Use React hooks - useFeatureFlag, useConfigCatClient

The hooks (`useFeatureFlag`) way:

```js
function ButtonComponent() {
  const isAwesomeFeatureEnabled = useFeatureFlag(
    "isawesomefeatureenabled",
    false
  );

  return (
    <button
      disabled={!isAwesomeFeatureEnabled}
      onClick={() => alert("ConfigCat <3 React")}
    >
      isAwesomeFeature
    </button>
  );
}
```

## Need help?

https://configcat.com/support

## Contributing

Contributions are welcome. For more info please read the [Contribution Guideline](CONTRIBUTING.md).

## About ConfigCat

- [Official ConfigCat SDK's for other platforms](https://github.com/configcat)
- [Documentation](https://configcat.com/docs)
- [Blog](https://blog.configcat.com)
