import React from "react";
import { IConfigCatClient, User } from "configcat-common";
import ConfigCatContext, { ConfigCatContextData } from "./ConfigCatContext";

export type GetValueType = (
  key: string,
  defaultValue: any,
  user?: User
) => Promise<any>;

const getValueFunction = (client: IConfigCatClient) => {
  return async function name(key: string, defaultValue: any, user?: User) {
    return await client.getValueAsync(key, defaultValue, user);
  };
};

export interface WithConfigCatClientProps {
  configCatClient: IConfigCatClient;
  getValue: GetValueType;
}

function withConfigCatClient<P>(
  WrappedComponent: React.ComponentType<P & WithConfigCatClientProps>
): React.ComponentType<Omit<P, keyof WithConfigCatClientProps>> {
  return (props: P) => (
    <ConfigCatContext.Consumer>
      {(context: ConfigCatContextData | undefined) => {
        if (context === undefined) {
          throw new Error(
            "ConfigCatContext.Consumer must be used within a ConfigCatProvider"
          );
        }
        return (
          <WrappedComponent
            configCatClient={context.client}
            getValue={getValueFunction(context.client)}
            {...(props as P)}
          />
        );
      }}
    </ConfigCatContext.Consumer>
  );
}

export default withConfigCatClient;
