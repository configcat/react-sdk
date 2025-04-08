"use client";

import type { ClientCacheState, HookEvents, IConfig, IConfigCatClient, IConfigCatClientSnapshot, IEvaluationDetails, RefreshResult, SettingKeyValue, SettingTypeOf, SettingValue, User } from "@configcat/sdk";
import { Internals, PollingMode } from "@configcat/sdk";
import React, { Component, type PropsWithChildren } from "react";
import { type ConfigCatContextData, ensureConfigCatContext } from "./ConfigCatContext";
import CONFIGCAT_SDK_VERSION from "./Version";
import type { IReactAutoPollOptions, IReactLazyLoadingOptions, IReactManualPollOptions } from ".";

type ConfigCatProviderProps = {
  sdkKey: string;
  pollingMode?: PollingMode;
  options?: IReactAutoPollOptions | IReactLazyLoadingOptions | IReactManualPollOptions;
  id?: string;
};

type ConfigCatProviderState = ConfigCatContextData;

type AugmentedConfigCatClient = IConfigCatClient & {
  $reactSdk_providers?: Set<ConfigCatProvider>;
}

class ConfigCatProvider extends Component<PropsWithChildren<ConfigCatProviderProps>, ConfigCatProviderState, {}> {
  private configChangedHandler?: (newConfig: IConfig) => void;

  constructor(props: ConfigCatProviderProps) {
    super(props);

    const client = (!isServerContext()
      ? this.initializeConfigCatClient()
      : new ConfigCatClientStub()
    ) as AugmentedConfigCatClient;

    const providers = client.$reactSdk_providers ??= new Set();
    providers.add(this);

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
    if (this.configChangedHandler) {
      this.state.client.off("configChanged", this.configChangedHandler);
      delete this.configChangedHandler;
    }

    const providers = (this.state.client as AugmentedConfigCatClient).$reactSdk_providers;
    if (providers?.delete(this) && !providers.size) {
      this.state.client.dispose();
    }
  }

  private initializeConfigCatClient() {
    const { pollingMode, options, sdkKey } = this.props;
    const configCatKernel: Internals.IConfigCatKernel = {
      configFetcher: new Internals.XmlHttpRequestConfigFetcher(),
      sdkType: "ConfigCat-React",
      sdkVersion: CONFIGCAT_SDK_VERSION,
      eventEmitterFactory: () => new Internals.DefaultEventEmitter(),
      defaultCacheFactory: Internals.LocalStorageConfigCache.tryGetFactory()
    };

    return Internals.getClient(sdkKey, pollingMode ?? PollingMode.AutoPoll, options, configCatKernel);
  }

  reactConfigChanged(_newConfig: IConfig): void {
    this.setState({ lastUpdated: new Date() });
  }

  clientReady(): void {
    this.setState({ lastUpdated: new Date() });
  }

  render(): React.JSX.Element {
    const context = ensureConfigCatContext(this.props.id);

    return (
      <context.Provider value={this.state}>
        {this.props.children}
      </context.Provider>
    );
  }
}

function isServerContext() {
  return typeof XMLHttpRequest === "undefined";
}

function serverContextNotSupported(): Error {
  return new Error(
    "ConfigCat SDK functionality is not available in server context. "
    + "If you need it in both server and client contexts, please consider using the JS SSR SDK instead of React SDK."
  );
}

function providerIdText(providerId?: string) {
  return providerId ? ` with id="${providerId}"` : " without id attribute";
}

export function createConfigCatProviderError(methodName: string, providerId?: string): Error {
  return Error(`${methodName} must be used in ConfigCatProvider${providerIdText(providerId)}!`);
}

class ConfigCatClientStub implements IConfigCatClient {
  readonly isOffline = true;

  getValueAsync<T extends SettingValue>(_key: string, _defaultValue: T, _user?: User): Promise<SettingTypeOf<T>> {
    throw serverContextNotSupported();
  }
  getValueDetailsAsync<T extends SettingValue>(_key: string, _defaultValue: T, _user?: User): Promise<IEvaluationDetails<SettingTypeOf<T>>> {
    throw serverContextNotSupported();
  }
  getAllKeysAsync(): Promise<string[]> {
    throw serverContextNotSupported();
  }
  getAllValuesAsync(_user?: User): Promise<SettingKeyValue<SettingValue>[]> {
    throw serverContextNotSupported();
  }
  getAllValueDetailsAsync(_user?: User): Promise<IEvaluationDetails<SettingValue>[]> {
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
  removeAllListeners(_eventName?: keyof HookEvents): this {
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
