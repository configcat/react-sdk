import React from "react";
import { WithConfigCatClientProps } from "configcat-react";
import { FeatureFlags } from "./ConfigCat";

class ButtonClassComponent extends React.Component<
  { text: string } & WithConfigCatClientProps,
  { isEnabled: boolean }
> {
  constructor(props: { text: string } & WithConfigCatClientProps) {
    super(props);

    this.state = { isEnabled: false };
  }

  componentDidMount() {
    this.props
      .getValue(FeatureFlags.isawesomefeatureenabled, false)
      .then((v: boolean) => this.setState({ isEnabled: v }));
  }

  render() {
    return (
      <button
        disabled={!this.state.isEnabled}
        onClick={() => alert("ConfigCat <3 React")}
      >
        {this.props.text}
      </button>
    );
  }
}

export default ButtonClassComponent;
