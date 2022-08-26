import React, { Component, PropsWithChildren } from "react";
import * as configcatcommon from "configcat-common";
import { PollingMode } from "./PollingMode";
import { HttpConfigFetcher } from "./ConfigFetcher";
import { LocalStorageCache } from "./Cache";
import CONFIGCAT_SDK_VERSION from "./Version";
import ConfigCatContext from "./ConfigCatContext";
import { IReactAutoPollOptions, IReactLazyLoadingOptions, IReactManualPollOptions } from ".";

type ConfigCatProviderProps = {
  sdkKey: string;
  pollingMode?: PollingMode;
  options?: IReactAutoPollOptions | IReactLazyLoadingOptions | IReactManualPollOptions;
};

type ConfigCatProviderState = {
  client: configcatcommon.IConfigCatClient;
  lastUpdated?: Date;
};

class ConfigCatProvider extends Component<
  PropsWithChildren<ConfigCatProviderProps>,
  ConfigCatProviderState,
  {}
> {

  constructor(props: ConfigCatProviderProps) {
    super(props);
    const client = this.initializeConfigCatClient();
    this.state = { client };
  }

  componentWillUnmount() {
    this.state?.client?.dispose();
  }

  private initializeConfigCatClient() {
    const { pollingMode, sdkKey, options } = this.props;
    const configCatKernel = {
      configFetcher: new HttpConfigFetcher(),
      cache: new LocalStorageCache(),
      sdkType: "ConfigCat-React",
      sdkVersion: CONFIGCAT_SDK_VERSION
    };

    switch (pollingMode) {
      case PollingMode.LazyLoad:
        return configcatcommon.createClientWithLazyLoad(sdkKey, configCatKernel, options);
      case PollingMode.ManualPoll:
        return configcatcommon.createClientWithManualPoll(sdkKey, configCatKernel, options);
      case PollingMode.AutoPoll:
      default:
        const autoPollOptions: IReactAutoPollOptions = { ...options };
        autoPollOptions.configChanged = this.reactConfigChanged(autoPollOptions.configChanged);
        return configcatcommon.createClientWithAutoPoll(sdkKey, configCatKernel, autoPollOptions);
    }
  }

  reactConfigChanged: (originalConfigChanged?: () => void) => (() => void) = (originalConfigChanged?: () => void) => {
    return () => {
      this.setState({ lastUpdated: new Date() });
      if (originalConfigChanged) {
        originalConfigChanged();
      }
    }
  }

  render() {
    return (
      <ConfigCatContext.Provider value={this.state}>
        {this.props.children}
      </ConfigCatContext.Provider>
    );
  }
}

export default ConfigCatProvider;
