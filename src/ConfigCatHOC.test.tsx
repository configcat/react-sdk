import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import ConfigCatProvider from "./ConfigCatProvider";
import { withConfigCatClient, WithConfigCatClientProps } from '.';

const sdkKey = "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A";

afterEach(cleanup)


class TestHOCComponent extends React.Component<
    WithConfigCatClientProps,
    { stringDefaultCatValue: string }
> {
    constructor(props: WithConfigCatClientProps) {
        super(props);

        this.state = { stringDefaultCatValue: "NOT_CAT" };
    }

    componentDidMount() {
        this.props
            .getValue("stringDefaultCat", "NOT_CAT")
            .then((v: string) => this.setState({ stringDefaultCatValue: v }));
    }

    render() {
        return (
            <div>Feature flag value: {this.state.stringDefaultCatValue}</div>
        );
    }
}

it("withConfigCatClient without provider should fail", async () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => { });

    const TestComponent = () => {
        const TestHocComponentWithConfigCatClient = withConfigCatClient(TestHOCComponent);
        return (<TestHocComponentWithConfigCatClient />);
    };
    expect(() => render(<TestComponent />))
        .toThrow("withConfigCatClient must be used within a ConfigCatProvider!");
    spy.mockRestore();
});

it("withConfigCatClient default settings should work", async () => {
    const TestComponent = () => {
        const TestHocComponentWithConfigCatClient = withConfigCatClient(TestHOCComponent);
        return (<TestHocComponentWithConfigCatClient />);
    };
    render(<ConfigCatProvider sdkKey={sdkKey}><TestComponent /></ConfigCatProvider>);
    await screen.findByText("Feature flag value: Cat", undefined, { timeout: 2000 });
});
