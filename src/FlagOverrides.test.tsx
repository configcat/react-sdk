import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { useFeatureFlag } from "./ConfigCatHooks";
import ConfigCatProvider from "./ConfigCatProvider";
import type { IQueryStringProvider, IReactAutoPollOptions } from ".";
import { OverrideBehaviour, createFlagOverridesFromQueryParams } from ".";

const sdkKey = "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A";

afterEach(cleanup);

describe("Flag Overrides", () => {
  it("Query string override should work - changes not watched", async () => {
    const TestComponent = () => {
      const { value: featureFlag } = useFeatureFlag("stringDefaultCat", "NOT_CAT");
      return (<div>Feature flag value: {featureFlag}</div>);
    };

    const queryStringProvider = {
      currentValue: "?cc-stringDefaultCat=OVERRIDE_CAT&stringDefaultCat=NON_OVERRIDE_CAT"
    } satisfies IQueryStringProvider;

    const options: IReactAutoPollOptions = {
      flagOverrides: createFlagOverridesFromQueryParams(OverrideBehaviour.LocalOverRemote, false, void 0, queryStringProvider)
    };

    const ui = <ConfigCatProvider sdkKey={sdkKey} options={options}><TestComponent /></ConfigCatProvider>;

    await render(ui);
    await screen.findByText("Feature flag value: OVERRIDE_CAT", void 0, { timeout: 2000 });

    cleanup();
    queryStringProvider.currentValue = "?cc-stringDefaultCat=CHANGED_OVERRIDE_CAT";

    await render(ui);
    await screen.findByText("Feature flag value: OVERRIDE_CAT", void 0, { timeout: 2000 });
  });

  it("Query string override should work - changes watched", async () => {
    const TestComponent = () => {
      const { value: featureFlag } = useFeatureFlag("stringDefaultCat", "NOT_CAT");
      return (<div>Feature flag value: {featureFlag}</div>);
    };

    const queryStringProvider = {
      currentValue: "?cc-stringDefaultCat=OVERRIDE_CAT"
    } satisfies IQueryStringProvider;

    const options: IReactAutoPollOptions = {
      flagOverrides: createFlagOverridesFromQueryParams(OverrideBehaviour.LocalOverRemote, true, void 0, queryStringProvider)
    };

    const ui = <ConfigCatProvider sdkKey={sdkKey} options={options}><TestComponent /></ConfigCatProvider>;

    await render(ui);
    await screen.findByText("Feature flag value: OVERRIDE_CAT", void 0, { timeout: 2000 });

    cleanup();
    queryStringProvider.currentValue = "?cc-stringDefaultCat=CHANGED_OVERRIDE_CAT";

    await render(ui);
    await screen.findByText("Feature flag value: CHANGED_OVERRIDE_CAT", void 0, { timeout: 2000 });
  });

  it("Query string override should work -q parsed query string", async () => {
    const TestComponent = () => {
      const { value: featureFlag } = useFeatureFlag("stringDefaultCat", "NOT_CAT");
      return (<div>Feature flag value: {featureFlag}</div>);
    };

    const queryStringProvider = {
      currentValue: { "cc-stringDefaultCat": "OVERRIDE_CAT" as string | ReadonlyArray<string> }
    } satisfies IQueryStringProvider;

    const options: IReactAutoPollOptions = {
      flagOverrides: createFlagOverridesFromQueryParams(OverrideBehaviour.LocalOverRemote, true, void 0, queryStringProvider)
    };

    const ui = <ConfigCatProvider sdkKey={sdkKey} options={options}><TestComponent /></ConfigCatProvider>;

    await render(ui);
    await screen.findByText("Feature flag value: OVERRIDE_CAT", void 0, { timeout: 2000 });

    cleanup();
    queryStringProvider.currentValue = { "cc-stringDefaultCat": ["OVERRIDE_CAT", "CHANGED_OVERRIDE_CAT"] };

    await render(ui);
    await screen.findByText("Feature flag value: CHANGED_OVERRIDE_CAT", void 0, { timeout: 2000 });
  });

  it("Query string override should work - respects custom parameter name prefix", async () => {
    const TestComponent = () => {
      const { value: featureFlag } = useFeatureFlag("stringDefaultCat", "NOT_CAT");
      return (<div>Feature flag value: {featureFlag}</div>);
    };

    const queryStringProvider = {
      currentValue: "?stringDefaultCat=OVERRIDE_CAT&cc-stringDefaultCat=NON_OVERRIDE_CAT"
    } satisfies IQueryStringProvider;

    const options: IReactAutoPollOptions = {
      flagOverrides: createFlagOverridesFromQueryParams(OverrideBehaviour.LocalOverRemote, void 0, "", queryStringProvider)
    };

    const ui = <ConfigCatProvider sdkKey={sdkKey} options={options}><TestComponent /></ConfigCatProvider>;

    await render(ui);
    await screen.findByText("Feature flag value: OVERRIDE_CAT", void 0, { timeout: 2000 });
  });

  it("Query string override should work - respects force-value-to-be-interpreted-as-string suffix", async () => {
    const TestComponent = () => {
      const { value: boolFeatureFlag } = useFeatureFlag("boolDefaultFalse", false);
      const { value: stringFeatureFlag } = useFeatureFlag("stringDefaultCat", "NOT_CAT");
      return (<div>Feature flag values: {boolFeatureFlag ? "true" : "false"} ({typeof boolFeatureFlag}), {stringFeatureFlag} ({typeof stringFeatureFlag})</div>);
    };

    const queryStringProvider = {
      currentValue: "?stringDefaultCat;str=TRUE&boolDefaultFalse=TRUE"
    } satisfies IQueryStringProvider;

    const options: IReactAutoPollOptions = {
      flagOverrides: createFlagOverridesFromQueryParams(OverrideBehaviour.LocalOverRemote, void 0, "", queryStringProvider)
    };

    const ui = <ConfigCatProvider sdkKey={sdkKey} options={options}><TestComponent /></ConfigCatProvider>;

    await render(ui);
    await screen.findByText("Feature flag values: true (boolean), TRUE (string)", void 0, { timeout: 2000 });
  });

  it("Query string override should work - handles query string edge cases", async () => {
    const TestComponent = () => {
      const { value: featureFlag } = useFeatureFlag("stringDefaultCat", "NOT_CAT");
      return (<div>Feature flag value: {featureFlag}</div>);
    };

    const queryStringProvider = {
      currentValue: "?&some&=garbage&&cc-stringDefaultCat=OVERRIDE_CAT&=cc-stringDefaultCat&cc-stringDefaultCat"
    } satisfies IQueryStringProvider;

    const options: IReactAutoPollOptions = {
      flagOverrides: createFlagOverridesFromQueryParams(OverrideBehaviour.LocalOverRemote, void 0, void 0, queryStringProvider)
    };

    const ui = <ConfigCatProvider sdkKey={sdkKey} options={options}><TestComponent /></ConfigCatProvider>;

    await render(ui);
    await screen.findByText("Feature flag value:", void 0, { timeout: 2000 });
    await expect(() => screen.findByText("Feature flag value: OVERRIDE_CAT", void 0, { timeout: 2000 })).rejects.toThrow();
  });
});
