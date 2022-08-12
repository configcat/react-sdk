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

  private client: configcatcommon.IConfigCatClient;
  constructor(props: ConfigCatProviderProps) {
    super(props);

    switch (props.pollingMode) {
      case PollingMode.LazyLoad:
        this.client = configcatcommon.createClientWithLazyLoad(
          props.sdkKey,
          {
            configFetcher: new HttpConfigFetcher(),
            cache: new LocalStorageCache(),
            sdkType: "ConfigCat-React",
            sdkVersion: CONFIGCAT_SDK_VERSION
          },
          props.options
        )
        break;
      case PollingMode.ManualPoll:
        this.client = configcatcommon.createClientWithManualPoll(
          props.sdkKey,
          {
            configFetcher: new HttpConfigFetcher(),
            cache: new LocalStorageCache(),
            sdkType: "ConfigCat-React",
            sdkVersion: CONFIGCAT_SDK_VERSION
          },
          props.options
        )
        break;
      case PollingMode.AutoPoll:
      default:
        this.client = configcatcommon.createClientWithAutoPoll(
          props.sdkKey,
          {
            configFetcher: new HttpConfigFetcher(),
            cache: new LocalStorageCache(),
            sdkType: "ConfigCat-React",
            sdkVersion: CONFIGCAT_SDK_VERSION
          },
          props.options
        )
        break;
    }
    // TODO remove when client supports 'ready' callback
    this.setState({
      client: this.client,
    });
  }

  componentDidUpdate() {
    this.setState({
      client: this.client,
    });
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
