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

const initializedClients = new Map<string, number>();

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

  componentDidMount(): void {
    this.state?.client?.on("clientReady", () => this.clientReady());
    this.state?.client?.on("configChanged", newConfig => this.reactConfigChanged(newConfig));
  }

  componentWillUnmount(): void {
    this.state?.client?.removeListener("clientReady", () => this.clientReady());
    this.state?.client?.removeListener("configChanged", newConfig => this.reactConfigChanged(newConfig));

    initializedClients.set(this.props.sdkKey, (initializedClients.get(this.props.sdkKey) ?? 1) - 1);

    if (initializedClients.get(this.props.sdkKey) === 0) {
      this.state?.client?.dispose();
      initializedClients.delete(this.props.sdkKey);
    }
  }

  private initializeConfigCatClient() {
    const { pollingMode, options } = this.props;
    const { sdkKey } = this.props;
    const configCatKernel = {
      configFetcher: new HttpConfigFetcher(),
      cache: new LocalStorageCache(),
      sdkType: "ConfigCat-React",
      sdkVersion: CONFIGCAT_SDK_VERSION
    };

    initializedClients.set(sdkKey, (initializedClients.get(sdkKey) ?? 0) + 1);
    return configcatcommon.getClient(sdkKey, pollingMode ?? PollingMode.AutoPoll, options, configCatKernel);
  }

  reactConfigChanged(newConfig: ProjectConfig): void {
    this.setState({ lastUpdated: new Date(newConfig.Timestamp) });
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
