import { act, cleanup, render, screen } from "@testing-library/react";
import React from "react";
import ConfigCatProvider from "./ConfigCatProvider";
import type { WithConfigCatClientProps } from ".";
import { withConfigCatClient } from ".";

const sdkKey = "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A";

afterEach(cleanup);

class TestHOCComponent extends React.Component<WithConfigCatClientProps, { stringDefaultCatValue: string }> {
  constructor(props: WithConfigCatClientProps) {
    super(props);

    this.state = { stringDefaultCatValue: "NOT_CAT" };
  }

  componentDidMount() {
    this.evaluateFeatureFlag();
  }

  componentDidUpdate(prevProps: any) {
    // To achieve hot reload on config.json updates.
    if (prevProps?.lastUpdated !== this.props.lastUpdated) {
      this.evaluateFeatureFlag();
    }
  }

  evaluateFeatureFlag() {
    this.props
      .getValue("stringDefaultCat", "NOT_CAT")
      .then((v: string) => act(() => this.setState({ stringDefaultCatValue: v })));
  }

  render() {
    return (
      <div>Feature flag value: {this.state.stringDefaultCatValue}</div>
    );
  }
}

it("withConfigCatClient without provider should fail", () => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => { });

  const TestComponent = () => {
    const TestHocComponentWithConfigCatClient = withConfigCatClient(TestHOCComponent);
    return (<TestHocComponentWithConfigCatClient />);
  };
  expect(() => render(<TestComponent />))
    .toThrow("withConfigCatClient must be used in ConfigCatProvider without id attribute!");
  spy.mockRestore();
});

it("withConfigCatClient default settings should work", async () => {
  const TestComponent = () => {
    const TestHocComponentWithConfigCatClient = withConfigCatClient(TestHOCComponent);
    return (<TestHocComponentWithConfigCatClient />);
  };
  render(<ConfigCatProvider sdkKey={sdkKey}><TestComponent /></ConfigCatProvider>);
  await screen.findByText("Feature flag value: Cat", void 0, { timeout: 2000 });
});

it("withConfigCatClient with providerId should work", async () => {
  const providerId = "BACKEND";

  const TestComponent = () => {
    const TestHocComponentWithConfigCatClient = withConfigCatClient(TestHOCComponent, providerId);
    return (<TestHocComponentWithConfigCatClient />);
  };
  render(<ConfigCatProvider sdkKey={sdkKey} id={providerId}><TestComponent /></ConfigCatProvider>);
  await screen.findByText("Feature flag value: Cat", void 0, { timeout: 2000 });
});

it("withConfigCatClient with invalid providerId should fail", () => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => { });

  const providerId = "PROVIDER_IS_NOT_EXIST";

  const TestComponent = () => {
    const TestHocComponentWithConfigCatClient = withConfigCatClient(TestHOCComponent, providerId);
    return (<TestHocComponentWithConfigCatClient />);
  };
  expect(() => render(<ConfigCatProvider sdkKey={sdkKey}><TestComponent /></ConfigCatProvider>))
    .toThrow(`withConfigCatClient must be used in ConfigCatProvider with id="${providerId}"!`);
  spy.mockRestore();
});
