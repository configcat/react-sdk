import type { IAutoPollOptions, IConfigCatLogger, ILazyLoadingOptions, IManualPollOptions, LogLevel, OverrideBehaviour, SettingValue } from "configcat-common";
import * as configcatcommon from "configcat-common";
import { FlagOverrides, MapOverrideDataSource } from "configcat-common";
import type { GetValueType, WithConfigCatClientProps } from "./ConfigCatHOC";
import withConfigCatClient from "./ConfigCatHOC";
import { useConfigCatClient, useFeatureFlag } from "./ConfigCatHooks";
import ConfigCatProvider from "./ConfigCatProvider";

/**
 * Creates an instance of `ConfigCatConsoleLogger`.
 * @param logLevel Log level (the minimum level to use for filtering log events).
 */
export function createConsoleLogger(logLevel: LogLevel): IConfigCatLogger {
  return configcatcommon.createConsoleLogger(logLevel);
}

/**
 * Creates an instance of `FlagOverrides` that uses a map data source.
 * @param map The map that contains the overrides.
 * @param behaviour The override behaviour.
 * Specifies whether the local values should override the remote values
 * or local values should only be used when a remote value doesn't exist
 * or the local values should be used only.
 */
export function createFlagOverridesFromMap(map: { [name: string]: NonNullable<SettingValue> }, behaviour: OverrideBehaviour): FlagOverrides {
  return new FlagOverrides(new MapOverrideDataSource(map), behaviour);
}

/** Options used to configure the ConfigCat SDK in the case of Auto Polling mode. */
export type IReactAutoPollOptions = IAutoPollOptions;

/** Options used to configure the ConfigCat SDK in the case of Lazy Loading mode. */
export type IReactLazyLoadingOptions = ILazyLoadingOptions;

/** Options used to configure the ConfigCat SDK in the case of Manual Polling mode. */
export type IReactManualPollOptions = IManualPollOptions;

export type IReactConfigCatLogger = IConfigCatLogger;

export type { WithConfigCatClientProps, GetValueType };
export { ConfigCatProvider, useFeatureFlag, useConfigCatClient, withConfigCatClient };

/* Public types re-export from common-js */

// These exports should be kept in sync with the exports listed in the section "Public types for end users" of common-js/src/index.ts!

export { PollingMode } from "configcat-common";

export type { IOptions } from "configcat-common";

export type { IAutoPollOptions, IManualPollOptions, ILazyLoadingOptions } from "configcat-common";

export { DataGovernance } from "configcat-common";

export type { IConfigCatLogger } from "configcat-common";

export type { LogEventId, LogMessage } from "configcat-common";

export { LogLevel } from "configcat-common";

export { FormattableLogMessage } from "configcat-common";

export type { IConfigCatCache } from "configcat-common";

export type { IConfig, ISetting, ITargetingRule, IPercentageOption, SettingValue, VariationIdValue } from "configcat-common";

export { SettingType, Comparator } from "configcat-common";

export type { IConfigCatClient, IConfigCatClientSnapshot } from "configcat-common";

export { SettingKeyValue } from "configcat-common";

export type { IEvaluationDetails, SettingTypeOf } from "configcat-common";

export { User } from "configcat-common";

export type { FlagOverrides } from "configcat-common";

export { OverrideBehaviour } from "configcat-common";

export { RefreshResult } from "configcat-common";

export type { IProvidesHooks, HookEvents } from "configcat-common";

export { ClientReadyState } from "configcat-common";
