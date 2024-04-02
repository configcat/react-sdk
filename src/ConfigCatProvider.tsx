"use client";

import type { ClientCacheState, HookEvents, IConfig, IConfigCatClient, IConfigCatClientSnapshot, IConfigCatKernel, IEvaluationDetails, RefreshResult, SettingKeyValue, SettingTypeOf, SettingValue, User } from "configcat-common";
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
  client: IConfigCatClient;
  lastUpdated?: Date;
};

const initializedClients = new Map<string, number>();

class ConfigCatProvider extends Component<PropsWithChildren<ConfigCatProviderProps>, ConfigCatProviderState, {}> {
  private configChangedHandler?: (newConfig: IConfig) => void;

  constructor(props: ConfigCatProviderProps) {
    super(props);

    const client: IConfigCatClient = !isServerContext()
      ? this.initializeConfigCatClient()
      : new ConfigCatClientStub();

    this.state = { client };
  }

  componentDidMount(): void {
    this.configChangedHandler = newConfig => this.reactConfigChanged(newConfig);

    this.state.client.waitForReady().then(() => {
      if (!this.configChangedHandler) {
        // If the component was unmounted before client initialization finished, we have nothing left to do.
        return;
      }
      this.state.client.on("configChanged", this.configChangedHandler);
      this.clientReady();
    });
  }

  componentWillUnmount(): void {
    this.state.client.off("configChanged", this.configChangedHandler!);
    delete this.configChangedHandler;

    const refCount = (initializedClients.get(this.props.sdkKey) ?? 1) - 1;
    initializedClients.set(this.props.sdkKey, refCount);

    if (refCount <= 0) {
      this.state.client.dispose();
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

declare let Deno: any;

function isServerContext() {
  if (typeof XMLHttpRequest === "undefined") {
    return true;
  }

  // Detect server runtime environment based on
  // * https://github.com/flexdinesh/browser-or-node
  // * https://bun.sh/guides/util/detect-bun
  let pv;
  if (typeof process !== "undefined" && (pv = process.versions) != null && ((pv.node ?? pv.bun) != null)) {
    return true;
  }

  if (typeof Deno !== "undefined" && Deno.version?.deno != null) {
    return true;
  }

  return false;
}

function serverContextNotSupported(): Error {
  return new Error(
    "ConfigCat SDK functionality is not available in server context. "
    + "If you need it in both server and client contexts, please consider using the JS SSR SDK instead of React SDK."
  );
}

class ConfigCatClientStub implements IConfigCatClient {
  readonly isOffline = true;

  getValueAsync<T extends SettingValue>(_key: string, _defaultValue: T, _user?: User | undefined): Promise<SettingTypeOf<T>> {
    throw serverContextNotSupported();
  }

  getValueDetailsAsync<T extends SettingValue>(_key: string, _defaultValue: T, _user?: User | undefined): Promise<IEvaluationDetails<SettingTypeOf<T>>> {
    throw serverContextNotSupported();
  }

  getAllKeysAsync(): Promise<string[]> {
    throw serverContextNotSupported();
  }

  getAllValuesAsync(_user?: User | undefined): Promise<SettingKeyValue<SettingValue>[]> {
    throw serverContextNotSupported();
  }

  getAllValueDetailsAsync(_user?: User | undefined): Promise<IEvaluationDetails<SettingValue>[]> {
    throw serverContextNotSupported();
  }

  getKeyAndValueAsync(_variationId: string): Promise<SettingKeyValue<SettingValue> | null> {
    throw serverContextNotSupported();
  }

  forceRefreshAsync(): Promise<RefreshResult> {
    throw serverContextNotSupported();
  }

  waitForReady(): Promise<ClientCacheState> {
    throw serverContextNotSupported();
  }

  snapshot(): IConfigCatClientSnapshot {
    throw serverContextNotSupported();
  }

  setDefaultUser(_defaultUser: User): void {
    throw serverContextNotSupported();
  }

  clearDefaultUser(): void {
    throw serverContextNotSupported();
  }

  setOnline(): void {
    throw serverContextNotSupported();
  }

  setOffline(): void {
    throw serverContextNotSupported();
  }

  dispose(): void { }

  addListener<TEventName extends keyof HookEvents>(_eventName: TEventName, _listener: (...args: HookEvents[TEventName]) => void): this {
    throw serverContextNotSupported();
  }

  on<TEventName extends keyof HookEvents>(_eventName: TEventName, _listener: (...args: HookEvents[TEventName]) => void): this {
    throw serverContextNotSupported();
  }

  once<TEventName extends keyof HookEvents>(_eventName: TEventName, _listener: (...args: HookEvents[TEventName]) => void): this {
    throw serverContextNotSupported();
  }

  removeListener<TEventName extends keyof HookEvents>(_eventName: TEventName, _listener: (...args: HookEvents[TEventName]) => void): this {
    throw serverContextNotSupported();
  }

  off<TEventName extends keyof HookEvents>(_eventName: TEventName, _listener: (...args: HookEvents[TEventName]) => void): this {
    throw serverContextNotSupported();
  }

  removeAllListeners(_eventName?: keyof HookEvents | undefined): this {
    throw serverContextNotSupported();
  }

  listeners(_eventName: keyof HookEvents): Function[] {
    throw serverContextNotSupported();
  }

  listenerCount(_eventName: keyof HookEvents): number {
    throw serverContextNotSupported();
  }

  eventNames(): (keyof HookEvents)[] {
    throw serverContextNotSupported();
  }
}

export default ConfigCatProvider;
