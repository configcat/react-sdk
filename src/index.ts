"use client";

import type { GetValueType, WithConfigCatClientProps } from "./ConfigCatHOC";
import withConfigCatClient from "./ConfigCatHOC";
import { useConfigCatClient, useFeatureFlag } from "./ConfigCatHooks";
import ConfigCatProvider from "./ConfigCatProvider";

export type { WithConfigCatClientProps, GetValueType };
export { ConfigCatProvider, useFeatureFlag, useConfigCatClient, withConfigCatClient };

export type { IReactAutoPollOptions, IReactLazyLoadingOptions, IReactManualPollOptions } from "./ConfigCatProvider";

/* Public type re-exports from @configcat/sdk */

// These exports should be kept in sync with the exports listed in the `src/index/browser.ts` module
// located in the `js-unified-sdk` repo (https://github.com/configcat/js-unified-sdk).

export { createConsoleLogger, createFlagOverridesFromMap, createFlagOverridesFromQueryParams } from "@configcat/sdk";

export type { IQueryStringProvider } from "@configcat/sdk";

export { LocalStorageConfigCache } from "@configcat/sdk";

export { IndexedDBConfigCache } from "@configcat/sdk";

export { XmlHttpRequestConfigFetcher } from "@configcat/sdk";

export { ClientSideFetchApiConfigFetcher } from "@configcat/sdk";

// These exports should be kept in sync with the exports listed in the `src/index.ts` module.

export type { IConfigCatCache } from "@configcat/sdk";

export type { IConfigCatClient, IConfigCatClientSnapshot } from "@configcat/sdk";

export type { IAutoPollOptions, ILazyLoadingOptions, IManualPollOptions, IOptions } from "@configcat/sdk";

export { DataGovernance, PollingMode } from "@configcat/sdk";

export type { IConfigCatLogger, LogEventId, LogFilterCallback, LogMessage } from "@configcat/sdk";

export { FormattableLogMessage, LogLevel } from "@configcat/sdk";

export type { FetchErrorCauses, IConfigCatConfigFetcher } from "@configcat/sdk";

export { FetchError, FetchRequest, FetchResponse } from "@configcat/sdk";

export { PrerequisiteFlagComparator, SegmentComparator, SettingType, UserComparator } from "@configcat/sdk";

export type { RefreshResult } from "@configcat/sdk";

export { ClientCacheState, RefreshErrorCode } from "@configcat/sdk";

export type { FlagOverrides, IOverrideDataSource } from "@configcat/sdk";

export { OverrideBehaviour } from "@configcat/sdk";

export type {
  Condition, ConditionContainer, Config, PercentageOption, PrerequisiteFlagCondition, Segment, SegmentCondition,
  Setting, SettingValue, SettingValueContainer, SettingValueModel, TargetingRule, UserCondition, VariationIdValue,
} from "@configcat/sdk";

export { ConfigJson, deserializeConfig, prepareConfig, createSettingFromValue } from "@configcat/sdk";

export type { IEvaluationDetails, EvaluationDetails, SettingKeyValue, SettingTypeOf } from "@configcat/sdk";

export { EvaluationErrorCode } from "@configcat/sdk";

export type { IUser, UserAttributeValue } from "@configcat/sdk";

export { User } from "@configcat/sdk";

export type { HookEvents, IProvidesConfigCatClient, IProvidesHooks } from "@configcat/sdk";

export type { Message } from "@configcat/sdk";
