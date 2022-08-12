import * as configcatcommon from "configcat-common";

export type IReactAutoPollOptions = configcatcommon.IAutoPollOptions;

export type IReactLazyLoadingOptions = configcatcommon.ILazyLoadingOptions;

export type IReactManualPollOptions = configcatcommon.IManualPollOptions;

export const DataGovernance = {
    /** Select this if your feature flags are published to all global CDN nodes. */
    Global: configcatcommon.DataGovernance.Global,
    /** Select this if your feature flags are published to CDN nodes only in the EU. */
    EuOnly: configcatcommon.DataGovernance.EuOnly
};