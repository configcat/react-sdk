import type { IConfigCatClient, ProjectConfig } from "configcat-common";
import * as configcatcommon from "configcat-common";
import { PollingMode } from "configcat-common";
import type { PropsWithChildren } from "react";
import React, { Component } from "react";
import { LocalStorageCache } from "./Cache";
import ConfigCatContext from "./ConfigCatContext";
import { HttpConfigFetcher } from "./ConfigFetcher";
import CONFIGCAT_SDK_VERSION from "./Version";
import type { IReactAutoPollOptions, IReactLazyLoadingOptions, IReactManualPollOptions } from ".";

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
  /* eslint-disable @typescript-eslint/indent */
  PropsWithChildren<ConfigCatProviderProps>,
  ConfigCatProviderState,
  {}
/* eslint-enable @typescript-eslint/indent */
> {

  constructor(props: ConfigCatProviderProps) {
    super(props);
    const client = this.initializeConfigCatClient();
    this.state = { client };
  }

  componentWillUnmount(): void {
    this.state?.client?.dispose();
  }

  private initializeConfigCatClient() {
    let { pollingMode, options } = this.props;
    const { sdkKey } = this.props;
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

  reactConfigChanged(newConfig: ProjectConfig): void {
    if (!this.state) {
      // Initialization phase will set state anyway.
      return;
    }
    this.setState({ lastUpdated: new Date(newConfig.Timestamp) });
  }

  clientReady(): void {
    if (!this.state) {
      // Initialization phase will set state anyway.
      return;
    }
    this.setState({ lastUpdated: new Date() });
  }

  render(): JSX.Element {
    return (
      <ConfigCatContext.Provider value={this.state}>
        {this.props.children}
      </ConfigCatContext.Provider>
    );
  }
}

export default ConfigCatProvider;
