import { cleanup, render, screen } from "@testing-library/react";
import { PollingMode } from "configcat-common";
import React, { useEffect, useState } from "react";
import { useConfigCatClient, useFeatureFlag } from "./ConfigCatHooks";
import ConfigCatProvider from "./ConfigCatProvider";

const sdkKey = "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A";

afterEach(cleanup);

it("useConfigCatClient without provider should fail", () => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => { });
  const TestComponent = () => {
    useConfigCatClient();
    return (< div />);
  };
  expect(() => render(<TestComponent />))
    .toThrow("useConfigCatClient must be used in ConfigCatProvider!");
  spy.mockRestore();
});

it("useConfigCatClient with provider forceRefresh() should work", async () => {
  const TestComponent = () => {
    const [refreshed, setRefreshed] = useState(false);
    const client = useConfigCatClient();
    useEffect(() => { client.forceRefreshAsync().then(() => setRefreshed(true)); });
    return (<div>{refreshed ? "Refreshed" : "Waiting"}</div>);
  };
  render(<ConfigCatProvider sdkKey={sdkKey}><TestComponent /></ConfigCatProvider>);
  await screen.findByText("Refreshed", void 0, { timeout: 2000 });
});

it("useFeatureFlag without provider should fail", () => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => { });
  const TestComponent = () => {
    useFeatureFlag("test", false);
    return (< div />);
  };
  expect(() => render(<TestComponent />))
    .toThrow("useFeatureFlag must be used in ConfigCatProvider!");

  spy.mockRestore();
});

it("useFeatureFlag default settings should work", async () => {
  const TestComponent = () => {
    const { value: featureFlag } = useFeatureFlag("stringDefaultCat", "NOT_CAT");
    return (< div>Feature flag value: {featureFlag}</div>);
  };
  await render(<ConfigCatProvider sdkKey={sdkKey}><TestComponent /></ConfigCatProvider>);
  await screen.findByText("Feature flag value: Cat", void 0, { timeout: 2000 });
});

it("useFeatureFlag Auto poll with default settings should work", async () => {
  const TestComponent = () => {
    const { value: featureFlag } = useFeatureFlag("stringDefaultCat", "NOT_CAT");
    return (< div>Feature flag value: {featureFlag}</div>);
  };
  render(<ConfigCatProvider sdkKey={sdkKey} pollingMode={PollingMode.AutoPoll}><TestComponent /></ConfigCatProvider>);
  await screen.findByText("Feature flag value: Cat", void 0, { timeout: 2000 });
});

it("useFeatureFlag Lazy loading with default settings should work", async () => {
  const TestComponent = () => {
    const { value: featureFlag } = useFeatureFlag("stringDefaultCat", "NOT_CAT");
    return (< div>Feature flag value: {featureFlag}</div>);
  };
  await render(<ConfigCatProvider sdkKey={sdkKey} pollingMode={PollingMode.LazyLoad}><TestComponent /></ConfigCatProvider>);
  await screen.findByText("Feature flag value: Cat", void 0, { timeout: 2000 });
});

it("useFeatureFlag Manual poll without forceRefresh should show default value", async () => {
  const TestComponent = () => {
    const { value: featureFlag } = useFeatureFlag("stringDefaultCat", "NOT_CAT");
    return (< div>Feature flag value: {featureFlag}</div>);
  };
  render(<ConfigCatProvider sdkKey={sdkKey} pollingMode={PollingMode.ManualPoll}><TestComponent /></ConfigCatProvider>);
  await screen.findByText("Feature flag value: NOT_CAT", void 0, { timeout: 2000 });
  const values = await screen.findAllByText("Feature flag value: Cat", void 0, { timeout: 2000 });
  expect(values.length === 0);
});

it("useFeatureFlag Manual poll with forceRefresh should work", async () => {
  const TestComponent = () => {
    const client = useConfigCatClient();
    useEffect(() => { client.forceRefreshAsync().then(() => { }); });
    const { value: featureFlag } = useFeatureFlag("stringDefaultCat", "NOT_CAT");
    return (< div>Feature flag value: {featureFlag}</div>);
  };
  await render(<ConfigCatProvider sdkKey={sdkKey} pollingMode={PollingMode.ManualPoll}><TestComponent /></ConfigCatProvider>);
  await screen.findByText("Feature flag value: Cat", void 0, { timeout: 2000 });
});

it("useFeatureFlag with invalid providerId should fail", () => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => { });

  const providerId = "PROVIDER_IS_NOT_EXIST";

  const TestComponent = () => {
    useFeatureFlag("stringDefaultCat", null, void 0, providerId);
    return (<div />);
  };
  expect(() => render(<ConfigCatProvider sdkKey={sdkKey}><TestComponent /></ConfigCatProvider>))
    .toThrow(`useFeatureFlag must be used in ConfigCatProvider with id="${providerId}"!`);
  spy.mockRestore();
});

it("useFeatureFlag with providerId should work", async () => {

  const providerId = "BACKEND";

  const TestComponent = () => {
    const { value: featureFlag } = useFeatureFlag("stringDefaultCat", "NOT_CAT", void 0, providerId);
    return (< div>Feature flag value: {featureFlag}</div>);
  };
  await render(<ConfigCatProvider sdkKey={sdkKey} id={providerId}><TestComponent /></ConfigCatProvider>);
  await screen.findByText("Feature flag value: Cat", void 0, { timeout: 2000 });
});

it("useConfigCatClient with invalid providerId should fail", () => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => { });

  const providerId = "PROVIDER_IS_NOT_EXIST";

  const TestComponent = () => {
    useConfigCatClient(providerId);
    return (<div />);
  };
  expect(() => render(<ConfigCatProvider sdkKey={sdkKey}><TestComponent /></ConfigCatProvider>))
    .toThrow(`useConfigCatClient must be used in ConfigCatProvider with id="${providerId}"!`);
  spy.mockRestore();
});

it("useConfigCatClient with providerId should work", async () => {

  const providerId = "BACKEND";

  const TestComponent = () => {
    const [stringDefaultCat, setStringDefaultCat] = useState("");
    const client = useConfigCatClient(providerId);
    useEffect(() => { client.getValueAsync("stringDefaultCat", "", void 0).then((v) => setStringDefaultCat(v)); });

    return (< div>Feature flag value: {stringDefaultCat}</div>);
  };
  await render(<ConfigCatProvider sdkKey={sdkKey} id={providerId}><TestComponent /></ConfigCatProvider>);
  await screen.findByText("Feature flag value: Cat", void 0, { timeout: 2000 });
});