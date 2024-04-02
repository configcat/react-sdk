import React from "react";
import { WithConfigCatClientProps } from "configcat-react";
import { Button, Text, View } from "react-native";

class ButtonClassComponent extends React.Component<
  { text: string } & WithConfigCatClientProps,
  { isEnabled: boolean, loading: boolean }
> {
  constructor(props: { text: string } & WithConfigCatClientProps) {
    super(props);

    this.state = { isEnabled: false, loading: true };
  }

  componentDidUpdate(prevProps: any) {
    // To achieve hot reload on config.json updates.
    if (prevProps?.lastUpdated !== this.props.lastUpdated) {
      this.evaluateFeatureFlag();
    }
  }

  componentDidMount() {
    this.evaluateFeatureFlag();
  }

  evaluateFeatureFlag() {
    this.props
      .getValue("isAwesomeFeatureEnabled", false)
      .then((v: boolean) => this.setState({ isEnabled: v, loading: false }));
  }

  render() {
    return this.state.loading
      ? (<View style={{marginTop: 10, marginBottom: 10}}><Text>Loading...</Text></View>)
      : (
        <View style={{marginTop: 10, marginBottom: 10}}>
          <Button disabled={!this.state.isEnabled} onPress={() => alert("ConfigCat <3 React")} title={this.props.text} />
        </View>
      );
  }
}

export default ButtonClassComponent;