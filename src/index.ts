"use client";

import type { IAutoPollOptions, IConfigCatLogger, ILazyLoadingOptions, IManualPollOptions } from "@configcat/sdk";
import { Internals } from "@configcat/sdk";
import type { GetValueType, WithConfigCatClientProps } from "./ConfigCatHOC";
import withConfigCatClient from "./ConfigCatHOC";
import { useConfigCatClient, useFeatureFlag } from "./ConfigCatHooks";
import ConfigCatProvider from "./ConfigCatProvider";

export const { createConsoleLogger, createFlagOverridesFromMap, createFlagOverridesFromQueryParams } = Internals;

export type IQueryStringProvider = Internals.IQueryStringProvider;

/** Options used to configure the ConfigCat SDK in the case of Auto Polling mode. */
export type IReactAutoPollOptions = IAutoPollOptions;

/** Options used to configure the ConfigCat SDK in the case of Lazy Loading mode. */
export type IReactLazyLoadingOptions = ILazyLoadingOptions;

/** Options used to configure the ConfigCat SDK in the case of Manual Polling mode. */
export type IReactManualPollOptions = IManualPollOptions;

export type IReactConfigCatLogger = IConfigCatLogger;

export type { WithConfigCatClientProps, GetValueType };
export { ConfigCatProvider, useFeatureFlag, useConfigCatClient, withConfigCatClient };

/* Public types re-export from @configcat/sdk */

// These exports should be kept in sync with the exports listed in the `src/index.ts` module
// located in the `js-unified-sdk` repo (https://github.com/configcat/js-unified-sdk)!

export { PollingMode } from "@configcat/sdk";

export type { IAutoPollOptions, ILazyLoadingOptions, IManualPollOptions, IOptions } from "@configcat/sdk";

export { DataGovernance } from "@configcat/sdk";

export type { IConfigCatLogger, LogEventId, LogMessage } from "@configcat/sdk";

export { LogLevel } from "@configcat/sdk";

export { FormattableLogMessage } from "@configcat/sdk";

export type { IConfigCatCache } from "@configcat/sdk";

export type {
  ConditionTypeMap, ICondition, IConditionUnion, IConfig, IPercentageOption, IPrerequisiteFlagCondition,
  ISegment, ISegmentCondition, ISetting, ISettingUnion, ISettingValueContainer, ITargetingRule,
  IUserCondition, IUserConditionUnion, SettingTypeMap, SettingValue, UserConditionComparisonValueTypeMap,
  VariationIdValue
} from "@configcat/sdk";

export { PrerequisiteFlagComparator, SegmentComparator, SettingType, UserComparator } from "@configcat/sdk";

export type { IConfigCatClient, IConfigCatClientSnapshot, SettingKeyValue } from "@configcat/sdk";

export type { IEvaluationDetails, SettingTypeOf } from "@configcat/sdk";

export type { IUser, UserAttributeValue } from "@configcat/sdk";

export { User } from "@configcat/sdk";

export type { FlagOverrides } from "@configcat/sdk";

export { OverrideBehaviour } from "@configcat/sdk";

export { ClientCacheState, RefreshResult } from "@configcat/sdk";

export type { HookEvents, IProvidesHooks } from "@configcat/sdk";

export { ConfigJson } from "@configcat/sdk";
