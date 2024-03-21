'use client'

import type { IAutoPollOptions, IConfigCatLogger, ILazyLoadingOptions, IManualPollOptions } from "configcat-common";
import type { GetValueType, WithConfigCatClientProps } from "./ConfigCatHOC";
import withConfigCatClient from "./ConfigCatHOC";
import { useConfigCatClient, useFeatureFlag } from "./ConfigCatHooks";
import ConfigCatProvider from "./ConfigCatProvider";

export { createConsoleLogger, createFlagOverridesFromMap } from "configcat-common";

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

