"use client";

import type { FlagOverrides, IAutoPollOptions, IConfigCatLogger, ILazyLoadingOptions, IManualPollOptions, OverrideBehaviour } from "configcat-common";
import type { GetValueType, WithConfigCatClientProps } from "./ConfigCatHOC";
import withConfigCatClient from "./ConfigCatHOC";
import { useConfigCatClient, useFeatureFlag } from "./ConfigCatHooks";
import ConfigCatProvider from "./ConfigCatProvider";
import type { IQueryStringProvider} from "./FlagOverrides";
import { QueryParamsOverrideDataSource, flagOverridesConstructor } from "./FlagOverrides";

export { createConsoleLogger, createFlagOverridesFromMap } from "configcat-common";

/**
 * Creates an instance of `FlagOverrides` that uses query string parameters as data source.
 * @param behaviour The override behaviour.
 * Specifies whether the local values should override the remote values
 * or local values should only be used when a remote value doesn't exist
 * or the local values should be used only.
 * @param watchChanges If set to `true`, the query string will be tracked for changes.
 * @param paramPrefix The parameter name prefix used to indicate which query string parameters
 * specify feature flag override values. Parameters whose name doesn't start with the
 * prefix will be ignored. Defaults to `cc-`.
 * @param queryStringProvider The provider object used to obtain the query string.
 * Defaults to a provider that extracts query string from the URL returned by `window.location.href`.
 */
export function createFlagOverridesFromQueryParams(behaviour: OverrideBehaviour,
  watchChanges?: boolean, paramPrefix?: string, queryStringProvider?: IQueryStringProvider
): FlagOverrides {
  return new flagOverridesConstructor(new QueryParamsOverrideDataSource(watchChanges, paramPrefix, queryStringProvider), behaviour);
}

export type { IQueryStringProvider };

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

export type {
  IConfig, ISegment, SettingTypeMap, SettingValue, VariationIdValue, ISettingValueContainer, ISettingUnion, ISetting, ITargetingRule, IPercentageOption,
  ConditionTypeMap, IConditionUnion, ICondition, UserConditionComparisonValueTypeMap, IUserConditionUnion, IUserCondition, IPrerequisiteFlagCondition, ISegmentCondition
} from "configcat-common";

export { SettingType, UserComparator, PrerequisiteFlagComparator, SegmentComparator } from "configcat-common";

export type { IConfigCatClient, IConfigCatClientSnapshot } from "configcat-common";

export { SettingKeyValue } from "configcat-common";

export type { IEvaluationDetails, SettingTypeOf } from "configcat-common";

export type { UserAttributeValue } from "configcat-common";

export { User } from "configcat-common";

export type { FlagOverrides } from "configcat-common";

export { OverrideBehaviour } from "configcat-common";

export { ClientCacheState, RefreshResult } from "configcat-common";

export type { IProvidesHooks, HookEvents } from "configcat-common";
