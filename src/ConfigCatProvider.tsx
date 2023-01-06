import React, { Component, PropsWithChildren } from "react";
import * as configcatcommon from "configcat-common";
import { IConfigCatClient, PollingMode, ProjectConfig } from "configcat-common";
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
  client: IConfigCatClient;
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
    let { pollingMode, sdkKey, options } = this.props;
    const configCatKernel = {
      configFetcher: new HttpConfigFetcher(),
      cache: new LocalStorageCache(),
      sdkType: "ConfigCat-React",
      sdkVersion: CONFIGCAT_SDK_VERSION
    };

    pollingMode ??= PollingMode.AutoPoll;

    options ??= {};
    const userSetupHooks = options.setupHooks;
    options.setupHooks = hooks => {
      hooks.on("clientReady", () => this.clientReady());
      hooks.on("configChanged", newConfig => this.reactConfigChanged(newConfig));
      userSetupHooks?.(hooks);
    };

    return configcatcommon.getClient(sdkKey, pollingMode, options, configCatKernel);
  }

  reactConfigChanged(newConfig: ProjectConfig) {
    this.setState({ lastUpdated: new Date(newConfig.Timestamp) });
  }

  clientReady(){
    this.setState({ lastUpdated: new Date() });
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
