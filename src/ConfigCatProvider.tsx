import React, { Component, PropsWithChildren } from "react";
import * as configcatcommon from "configcat-common";
import { PollingMode } from "./configcatclient/PollingMode";
import { HttpConfigFetcher } from "./configcatclient/ConfigFetcher";
import { LocalStorageCache } from "./configcatclient/Cache";
import CONFIGCAT_SDK_VERSION from "./configcatclient/Version";
import ConfigCatContext from "./ConfigCatContext";
import { IReactAutoPollOptions, IReactLazyLoadingOptions, IReactManualPollOptions } from "./configcatclient/Exports";

type ConfigCatProviderProps = {
  sdkKey: string;
  pollingMode?: PollingMode | undefined;
  options?: IReactAutoPollOptions | IReactLazyLoadingOptions | IReactManualPollOptions | undefined
};

type ConfigCatProviderState = {
  client: configcatcommon.IConfigCatClient;
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

  componentDidUpdate() {
    this.state?.client?.dispose();
    const client = this.initializeConfigCatClient();
    this.setState({ client });
  }

  componentWillUnmount() {
    this.state?.client?.dispose();
  }

  private initializeConfigCatClient() {
    let client: configcatcommon.IConfigCatClient;
    switch (this.props.pollingMode) {
      case PollingMode.LazyLoad:
        client = configcatcommon.createClientWithLazyLoad(
          this.props.sdkKey,
          {
            configFetcher: new HttpConfigFetcher(),
            cache: new LocalStorageCache(),
            sdkType: "ConfigCat-React",
            sdkVersion: CONFIGCAT_SDK_VERSION
          },
          this.props.options
        )
        break;
      case PollingMode.ManualPoll:
        client = configcatcommon.createClientWithManualPoll(
          this.props.sdkKey,
          {
            configFetcher: new HttpConfigFetcher(),
            cache: new LocalStorageCache(),
            sdkType: "ConfigCat-React",
            sdkVersion: CONFIGCAT_SDK_VERSION
          },
          this.props.options
        )
        break;
      case PollingMode.AutoPoll:
      default:
        client = configcatcommon.createClientWithAutoPoll(
          this.props.sdkKey,
          {
            configFetcher: new HttpConfigFetcher(),
            cache: new LocalStorageCache(),
            sdkType: "ConfigCat-React",
            sdkVersion: CONFIGCAT_SDK_VERSION
          },
          this.props.options
        )
        break;
    }
    return client;
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
