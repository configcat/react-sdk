import { DataGovernance, PollingMode } from "@configcat/sdk";
import { cleanup, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { useFeatureFlag } from "./ConfigCatHooks";
import ConfigCatProvider from "./ConfigCatProvider";

const sdkKey = "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A";
const sdkKey2 = "configcat-sdk-1/PKDVCLf-Hq-h-kCzMp-L7Q/tiOvFw5gkky9LFu1Duuvzw";

afterEach(cleanup);

it("Default initialization fails without SDK Key", () => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => { });

  expect(() => render(<ConfigCatProvider sdkKey="" />))
    .toThrow("Invalid 'sdkKey' value");
  spy.mockRestore();
});

it("Default initialization works", () => {
  render(<ConfigCatProvider
    sdkKey={sdkKey} />);
});

it("Default initialization works with Datagovernance", () => {
  render(<ConfigCatProvider
    sdkKey={sdkKey} options={{ dataGovernance: DataGovernance.EuOnly }} />);
});

it("AutoPoll simple initialization works", () => {
  render(<ConfigCatProvider
    sdkKey={sdkKey}
    pollingMode={PollingMode.AutoPoll} />);
});

it("AutoPoll advanced initialization works", () => {
  render(<ConfigCatProvider
    sdkKey={sdkKey}
    pollingMode={PollingMode.AutoPoll}
    options={{ pollIntervalSeconds: 30, maxInitWaitTimeSeconds: 20 }} />);
});

it("AutoPoll initialization wrong pollIntervalSeconds parameter fails", () => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => { });

  expect(() =>
    render(<ConfigCatProvider
      sdkKey={sdkKey}
      pollingMode={PollingMode.AutoPoll}
      options={{ pollIntervalSeconds: -1, maxInitWaitTimeSeconds: 20 }} />))
    .toThrow("Invalid 'pollIntervalSeconds' value");
  spy.mockRestore();
});

it("AutoPoll initialization wrong maxInitWaitTimeSeconds parameter fails", () => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => { });

  expect(() =>
    render(<ConfigCatProvider
      sdkKey={sdkKey}
      pollingMode={PollingMode.AutoPoll}
      options={{ maxInitWaitTimeSeconds: 2147484 }} />))
    .toThrow("Invalid 'maxInitWaitTimeSeconds' value");
  spy.mockRestore();
});

it("AutoPoll configChanged callback works", async () => {
  const TestComponent = () => {
    const [isConfigChanged, setIsConfigChanged] = useState(false);

    return (<ConfigCatProvider
      sdkKey={sdkKey}
      pollingMode={PollingMode.AutoPoll}
      options={{ setupHooks: hooks => hooks.on("configChanged", () => setIsConfigChanged(true)) }}>
      <div>Config changed: {isConfigChanged ? "True" : "False"}</div>
    </ConfigCatProvider>);
  };

  render(<TestComponent />);

  await screen.findByText("Config changed: True", void 0, { timeout: 2000 });
});

it("ManualPoll simple initialization works", () => {
  render(<ConfigCatProvider sdkKey={sdkKey} pollingMode={PollingMode.ManualPoll} />);
});

it("ManualPoll initialization wrong requestTimeoutMs fails", () => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => { });

  expect(() =>
    render(<ConfigCatProvider sdkKey={sdkKey}
      pollingMode={PollingMode.ManualPoll}
      options={{ requestTimeoutMs: -1 }} />))
    .toThrow("Invalid 'requestTimeoutMs' value");
  spy.mockRestore();
});

it("LazyLoad simple initialization works", () => {
  render(<ConfigCatProvider sdkKey={sdkKey}
    pollingMode={PollingMode.LazyLoad} />);
});

it("LazyLoad advanced initialization works", () => {
  render(<ConfigCatProvider sdkKey={sdkKey}
    pollingMode={PollingMode.ManualPoll}
    options={{ cacheTimeToLiveSeconds: 30 }} />);
});

it("LazyLoad initialization with wrong cacheTimeToLiveSeconds fails", () => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => { });

  expect(() =>
    render(<ConfigCatProvider sdkKey={sdkKey}
      pollingMode={PollingMode.LazyLoad}
      options={{ cacheTimeToLiveSeconds: -1 }} />))
    .toThrow("Invalid 'cacheTimeToLiveSeconds' value");

  spy.mockRestore();
});

it("Multiple provider initialization works", async () => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => { });

  const TestStringDefaultComponent = (props: {flagName: string; providerId?: string}) => {
    const flagResult = useFeatureFlag(props.flagName, "NOT_FOUND", void 0, props.providerId);

    return (
      <div>{flagResult.loading ? "loading..." : flagResult.value}</div>
    );
  };

  const providerId = "internalProvider";

  render(
    <ConfigCatProvider sdkKey={sdkKey}>
      <ConfigCatProvider sdkKey={sdkKey2} id={providerId}>
        <TestStringDefaultComponent flagName="stringDefaultCat"/>
        <TestStringDefaultComponent flagName="internalreactapptest" providerId={providerId}/>
      </ConfigCatProvider>
    </ConfigCatProvider>
  );

  await screen.findByText("Cat", void 0, { timeout: 2000 });
  await screen.findByText("Dog", void 0, { timeout: 2000 });
});
