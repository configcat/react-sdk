import withConfigCatClient, { GetValueType, WithConfigCatClientProps } from "./ConfigCatHOC";
import { useFeatureFlag, useConfigCatClient } from "./ConfigCatHooks";
import ConfigCatProvider from "./ConfigCatProvider";
import * as configcatcommon from "configcat-common";
import { FlagOverrides, IAutoPollOptions, IConfigCatLogger, ILazyLoadingOptions, IManualPollOptions, LogLevel, MapOverrideDataSource, PollingMode } from "configcat-common";

export function createConsoleLogger(logLevel: LogLevel): IConfigCatLogger {
    return configcatcommon.createConsoleLogger(logLevel);
}

export function createFlagOverridesFromMap(map: { [name: string]: any }, behaviour: number): FlagOverrides {
    return new FlagOverrides(new MapOverrideDataSource(map), behaviour);
}

export type IReactAutoPollOptions = IAutoPollOptions;

export type IReactLazyLoadingOptions = ILazyLoadingOptions;

export type IReactManualPollOptions = IManualPollOptions;

export type IReactConfigCatLogger = IConfigCatLogger;

export const DataGovernance = {
    /** Select this if your feature flags are published to all global CDN nodes. */
    Global: configcatcommon.DataGovernance.Global,
    /** Select this if your feature flags are published to CDN nodes only in the EU. */
    EuOnly: configcatcommon.DataGovernance.EuOnly
};

export const OverrideBehaviour = {
    /**
     * When evaluating values, the SDK will not use feature flags and settings from the ConfigCat CDN, but it will use
     * all feature flags and settings that are loaded from local-override sources.
     */
    LocalOnly: configcatcommon.OverrideBehaviour.LocalOnly,
    /**
     * When evaluating values, the SDK will use all feature flags and settings that are downloaded from the ConfigCat CDN,
     * plus all feature flags and settings that are loaded from local-override sources. If a feature flag or a setting is
     * defined both in the fetched and the local-override source then the local-override version will take precedence.
     */
    LocalOverRemote: configcatcommon.OverrideBehaviour.LocalOverRemote,
    /**
     * When evaluating values, the SDK will use all feature flags and settings that are downloaded from the ConfigCat CDN,
     * plus all feature flags and settings that are loaded from local-override sources. If a feature flag or a setting is
     * defined both in the fetched and the local-override source then the fetched version will take precedence.
     */
    RemoteOverLocal: configcatcommon.OverrideBehaviour.RemoteOverLocal,
};

export {
    ConfigCatProvider,
    useFeatureFlag,
    useConfigCatClient,
    withConfigCatClient,
    WithConfigCatClientProps,
    GetValueType,
    PollingMode
}