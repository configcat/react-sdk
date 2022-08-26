# ConfigCat SDK for React applications (alpha version)

https://configcat.com

ConfigCat SDK for React provides easy integration for your web application to ConfigCat.

## About

Manage features and change your software configuration using <a href="https://configcat.com" target="_blank">ConfigCat feature flags</a>
, without the need to re-deploy code. A <a href="https://app.configcat.com" target="_blank">10 minute trainable Dashboard</a>
allows even non-technical team members to manage features directly. Deploy anytime, release when confident.
Target a specific group of users first with new ideas. Supports A/B/n testing and soft launching.

ConfigCat is a <a href="https://configcat.com" target="_blank">hosted feature flag service</a>. Manage feature toggles across frontend, backend, mobile, desktop apps. <a href="https://configcat.com" target="_blank">Alternative to LaunchDarkly</a>. Management app + feature flag SDKs.


[![REACT CI](https://github.com/configcat/react-sdk/actions/workflows/react-ci.yml/badge.svg)](https://github.com/configcat/react-sdk/actions/workflows/react-ci.yml)
[![codecov](https://codecov.io/gh/configcat/react-sdk/branch/main/graph/badge.svg)](https://codecov.io/gh/configcat/react-sdk) 
[![Known Vulnerabilities](https://snyk.io/test/github/configcat/react-sdk/badge.svg?targetFile=package.json)](https://snyk.io/test/github/configcat/react-sdk?targetFile=package.json) 
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=configcat_react-sdk&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=configcat_react-sdk) 
[![Tree Shaking](https://badgen.net/bundlephobia/tree-shaking/configcat-react)](https://bundlephobia.com/result?p=configcat-react) 
![License](https://img.shields.io/github/license/configcat/react-sdk.svg) 
[![](https://data.jsdelivr.com/v1/package/npm/configcat-react/badge)](https://www.jsdelivr.com/package/npm/configcat-react)
[![NPM](https://nodei.co/npm/configcat-react.png)](https://nodei.co/npm/configcat-react/)

## Getting Started

The ConfigCat React SDK uses the Context API (requires React **16.3** or later) and Hook API (requires React **16.8** or later) to provide a better integration in your React application.

### 1. Install package:

_via NPM [package](https://npmjs.com/package/configcat-react):_

```PowerShell
npm i configcat-react
```

### 2. Go to the <a href="https://app.configcat.com/sdkkey" target="_blank">ConfigCat Dashboard</a> to get your *SDK Key*:

![SDK-KEY](https://raw.githubusercontent.com/ConfigCat/react-sdk/master/media/readme02-3.png  "SDK-KEY")

### 3. Import and initialize ConfigCatProvider

In most cases you should wrap your root component with `ConfigCatProvider` to access ConfigCat features in child components with Context API.

```js
import React from "react";
import { ConfigCatProvider } from "configcat-react";

function App() {
  return (
    <ConfigCatProvider sdkKey="#YOUR_SDK_KEY#">
      {/* your application code */}
    </ConfigCatProvider>
  );
}

export default App;
```

### 4. Get your setting value:

The React hooks (`useFeatureFlag`) way:
```js
function ButtonComponent() {
  const { value: isAwesomeFeatureEnabled, loading } = useFeatureFlag("isAwesomeFeatureEnabled", false);

  return loading ? (<div>Loading...</div>) : (
    <div>Feature flag value: {isAwesomeFeatureEnabled ? 'ON' : 'OFF'}</div>
  );
}
```

The React HOC (`WithConfigCatClientProps`) way:
```js
class TestHOCComponent extends React.Component<
    WithConfigCatClientProps,
    { isAwesomeFeatureEnabled: string }
> {
    constructor(props: WithConfigCatClientProps) {
        super(props);

        this.state = { isAwesomeFeatureEnabled: false, loading: true };
    }

    componentDidMount() {
        this.evaluateFeatureFlag();
    }

    componentDidUpdate(prevProps: any) {
      // To achieve hot reload on config.json updates.
      if (prevProps?.lastUpdated !== this.props.lastUpdated) {
        this.evaluateFeatureFlag();
      }
    }

    evaluateFeatureFlag(){
        this.props
            .getValue("isAwesomeFeatureEnabled", false)
            .then((v: boolean) => this.setState({ isAwesomeFeatureEnabled: v, loading: false }));
    }
    
    render() {
        return loading ? (<div>Loading...</div>) : (
            <div>Feature flag value: {this.state.isAwesomeFeatureEnabled ? 'ON' : 'OFF'}</div>
        );
    }
}
```

## Sample/Demo app
  - [React](https://github.com/configcat/react-sdk/tree/main/samples/react-sdk-sample)

## Polling Modes
The ConfigCat SDK supports 3 different polling mechanisms to acquire the setting values from ConfigCat. After latest setting values are downloaded, they are stored in the internal cache then all requests are served from there. Read more about Polling Modes and how to use them at [ConfigCat Docs](https://configcat.com/docs/sdk-reference/react/).

## Sensitive information handling

The frontend/mobile SDKs are running in your users' browsers/devices. The SDK is downloading a [config.json](https://configcat.com/docs/requests/) file from ConfigCat's CDN servers. The URL path for this config.json file contains your SDK key, so the SDK key and the content of your config.json file (feature flag keys, feature flag values, targeting rules, % rules) can be visible to your users. 
This SDK key is read-only, it only allows downloading your config.json file, but nobody can make any changes with it in your ConfigCat account.  
Suppose you don't want your SDK key or the content of your config.json file visible to your users. In that case, we recommend you use the SDK only in your backend applications and call a backend endpoint in your frontend/mobile application to evaluate the feature flags for a specific application customer.  
Also, we recommend using [sensitive targeting comparators](https://configcat.com/docs/advanced/targeting/#sensitive-text-comparators) in the targeting rules of those feature flags that are used in the frontend/mobile SDKs.

## Need help?
https://configcat.com/support

## Contributing
Contributions are welcome. For more info please read the [Contribution Guideline](CONTRIBUTING.md).

## About ConfigCat
- [Official ConfigCat SDK's for other platforms](https://github.com/configcat)
- [Documentation](https://configcat.com/docs)
- [Blog](https://blog.configcat.com)
