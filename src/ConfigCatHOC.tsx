import React from "react";
import type { IConfigCatClient, User } from "configcat-common";
import type { ConfigCatContextData } from "./ConfigCatContext";
import ConfigCatContext from "./ConfigCatContext";

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
  lastUpdated?: Date;
}

function withConfigCatClient<P>(
  WrappedComponent: React.ComponentType<P & WithConfigCatClientProps>
): React.ComponentType<Omit<P, keyof WithConfigCatClientProps>> {
  return (props: P) => (
    <ConfigCatContext.Consumer>
      {(context: ConfigCatContextData | undefined) => {
        if (context === void 0) {
          throw new Error(
            "withConfigCatClient must be used within a ConfigCatProvider!"
          );
        }
        return (
          <WrappedComponent
            configCatClient={context.client}
            getValue={getValueFunction(context.client)}
            lastUpdated={context.lastUpdated}
            {...(props as P)}
          />
        );
      }}
    </ConfigCatContext.Consumer>
  );
}

export default withConfigCatClient;
