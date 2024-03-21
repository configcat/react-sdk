import type { IConfig, IConfigCatClient, IConfigCatKernel } from "configcat-common";
import { PollingMode, getClient } from "configcat-common";
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
  client?: IConfigCatClient;
  lastUpdated?: Date;
};

const initializedClients = new Map<string, number>();

class ConfigCatProvider extends Component<PropsWithChildren<ConfigCatProviderProps>, ConfigCatProviderState, {}> {

  constructor(props: ConfigCatProviderProps) {
    super(props);
    this.state = {};
  }

  componentDidMount(): void {
    this.setState({ client: this.initializeConfigCatClient(), lastUpdated: new Date() });
    this.state.client?.on("clientReady", () => this.clientReady());
    this.state.client?.on("configChanged", newConfig => this.reactConfigChanged(newConfig));
  }

  componentWillUnmount(): void {
    this.state.client?.removeListener("clientReady", () => this.clientReady());
    this.state.client?.removeListener("configChanged", newConfig => this.reactConfigChanged(newConfig));

    initializedClients.set(this.props.sdkKey, (initializedClients.get(this.props.sdkKey) ?? 1) - 1);

    if (initializedClients.get(this.props.sdkKey) === 0) {
      this.state?.client?.dispose();
      initializedClients.delete(this.props.sdkKey);
    }
  }

  private initializeConfigCatClient() {
    const { pollingMode, options } = this.props;
    const { sdkKey } = this.props;
    const configCatKernel: IConfigCatKernel = LocalStorageCache.setup({
      configFetcher: new HttpConfigFetcher(),
      sdkType: "ConfigCat-React",
      sdkVersion: CONFIGCAT_SDK_VERSION,
    });

    initializedClients.set(sdkKey, (initializedClients.get(sdkKey) ?? 0) + 1);
    return getClient(sdkKey, pollingMode ?? PollingMode.AutoPoll, options, configCatKernel);
  }

  reactConfigChanged(_newConfig: IConfig): void {
    this.setState({ lastUpdated: new Date() });
  }

  clientReady(): void {
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
