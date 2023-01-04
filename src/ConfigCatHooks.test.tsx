import React, { useEffect, useState } from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import ConfigCatProvider from "./ConfigCatProvider";
import { useConfigCatClient, useFeatureFlag } from './ConfigCatHooks';
import { PollingMode } from 'configcat-common';

const sdkKey = "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A";

afterEach(cleanup)

it("useConfigCatClient without provider should fail", async () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => { });
    const TestComponent = () => {
        useConfigCatClient();
        return (< div />);
    };
    expect(() => render(<TestComponent />))
        .toThrow("useConfigCatClient hook must be used in ConfigCatProvider!");
    spy.mockRestore();
});

it("useConfigCatClient with provider forceRefresh() should work", async () => {
    const TestComponent = () => {
        const [refreshed, setRefreshed] = useState(false);
        const client = useConfigCatClient();
        useEffect(() => client.forceRefresh(() => { setRefreshed(true) }));
        return (<div>{refreshed ? 'Refreshed' : 'Waiting'}</div>);
    };
    render(<ConfigCatProvider sdkKey={sdkKey}><TestComponent /></ConfigCatProvider>);
    await screen.findByText("Refreshed", undefined, { timeout: 2000 });
});

it("useFeatureFlag without provider should fail", async () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => { });
    const TestComponent = () => {
        useFeatureFlag('test', false);
        return (< div />);
    };
    expect(() => render(<TestComponent />))
        .toThrow("useFeatureFlag hook must be used in ConfigCatProvider!");

    spy.mockRestore();
});


it("useFeatureFlag default settings should work", async () => {
    const TestComponent = () => {
        const { value: featureFlag } = useFeatureFlag('stringDefaultCat', 'NOT_CAT');
        return (< div>Feature flag value: {featureFlag}</div>);
    };
    await render(<ConfigCatProvider sdkKey={sdkKey}><TestComponent /></ConfigCatProvider>);
    await screen.findByText("Feature flag value: Cat", undefined, { timeout: 2000 });
});

it("useFeatureFlag Auto poll with default settings should work", async () => {
    const TestComponent = () => {
        const { value: featureFlag } = useFeatureFlag('stringDefaultCat', 'NOT_CAT');
        return (< div>Feature flag value: {featureFlag}</div>);
    };
    render(<ConfigCatProvider sdkKey={sdkKey} pollingMode={PollingMode.AutoPoll}><TestComponent /></ConfigCatProvider>);
    await screen.findByText("Feature flag value: Cat", undefined, { timeout: 2000 });
});

it("useFeatureFlag Lazy loading with default settings should work", async () => {
    const TestComponent = () => {
        const { value: featureFlag } = useFeatureFlag('stringDefaultCat', 'NOT_CAT');
        return (< div>Feature flag value: {featureFlag}</div>);
    };
    await render(<ConfigCatProvider sdkKey={sdkKey} pollingMode={PollingMode.LazyLoad}><TestComponent /></ConfigCatProvider>);
    await screen.findByText("Feature flag value: Cat", undefined, { timeout: 2000 });
});

it("useFeatureFlag Manual poll without forceRefresh should show default value", async () => {
    const TestComponent = () => {
        const { value: featureFlag } = useFeatureFlag('stringDefaultCat', 'NOT_CAT');
        return (< div>Feature flag value: {featureFlag}</div>);
    };
    render(<ConfigCatProvider sdkKey={sdkKey} pollingMode={PollingMode.ManualPoll}><TestComponent /></ConfigCatProvider>);
    await screen.findByText("Feature flag value: NOT_CAT", undefined, { timeout: 2000 });
    const values = await screen.findAllByText("Feature flag value: Cat", undefined, { timeout: 2000 });
    expect(values.length === 0);
});


it("useFeatureFlag Manual poll with forceRefresh should work", async () => {
    const TestComponent = () => {
        const client = useConfigCatClient();
        useEffect(() => client.forceRefresh(() => { }));
        const { value: featureFlag } = useFeatureFlag('stringDefaultCat', 'NOT_CAT');
        return (< div>Feature flag value: {featureFlag}</div>);
    };
    await render(<ConfigCatProvider sdkKey={sdkKey} pollingMode={PollingMode.ManualPoll}><TestComponent /></ConfigCatProvider>);
    await screen.findByText("Feature flag value: Cat", undefined, { timeout: 2000 });
});