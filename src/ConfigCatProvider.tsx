import React, { Component, PropsWithChildren } from "react";
import ConfigCatContext from "./ConfigCatContext";
import { IConfigCatClient } from "configcat-common";

type ConfigCatProviderProps = {
  client: IConfigCatClient;
};

type ConfigCatProviderState = {
  client: IConfigCatClient;
};

class ConfigCatProvider extends Component<
  PropsWithChildren<ConfigCatProviderProps>,
  ConfigCatProviderState,
  {}
> {
  constructor(props: ConfigCatProviderProps) {
    super(props);

    // TODO remove when client supports 'ready' callback
    this.state = { client: props.client };
  }

  componentDidUpdate(props: ConfigCatProviderProps) {
    this.setState({
      client: props.client,
    });
  }

  render() {
    return (
      <ConfigCatContext.Provider value={this.state}>
        {this.props.children}
      </ConfigCatContext.Provider>
    );
  }
}

export default ConfigCatProvider;
