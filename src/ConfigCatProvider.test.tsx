import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { PollingMode } from "./configcatclient/PollingMode";
import ConfigCatProvider from "./ConfigCatProvider";
import { DataGovernance } from './configcatclient/Exports';

const sdkKey = "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A";

afterEach(cleanup)

it("Default initialization fails without SDK Key", async () => {
    expect(() => render(<ConfigCatProvider />))
        .toThrow("Invalid 'apiKey' value");
});

it("Default initialization works", async () => {
    render(<ConfigCatProvider
        sdkKey={sdkKey} />);
});

it("Default initialization works with Datagovernance", async () => {
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
    expect(() =>
        render(<ConfigCatProvider
            sdkKey={sdkKey}
            pollingMode={PollingMode.AutoPoll}
            options={{ pollIntervalSeconds: -1, maxInitWaitTimeSeconds: 20 }} />))
        .toThrow("Invalid 'pollIntervalSeconds' value");
});


it("AutoPoll initialization wrong maxInitWaitTimeSeconds parameter fails", () => {
    expect(() =>
        render(<ConfigCatProvider
            sdkKey={sdkKey}
            pollingMode={PollingMode.AutoPoll}
            options={{ maxInitWaitTimeSeconds: -1 }} />))
        .toThrow("Invalid 'maxInitWaitTimeSeconds' value");
});

it("ManualPoll simple initialization works", () => {
    render(<ConfigCatProvider sdkKey={sdkKey} pollingMode={PollingMode.ManualPoll} />);
});

it("ManualPoll initialization wrong requestTimeoutMs fails", () => {
    expect(() =>
        render(<ConfigCatProvider sdkKey={sdkKey}
            pollingMode={PollingMode.ManualPoll}
            options={{ requestTimeoutMs: -1 }} />))
        .toThrow("Invalid 'requestTimeoutMs' value");
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
    expect(() =>
        render(<ConfigCatProvider sdkKey={sdkKey}
            pollingMode={PollingMode.LazyLoad}
            options={{ cacheTimeToLiveSeconds: -1 }} />))
        .toThrow("Invalid 'cacheTimeToLiveSeconds' value");
});
