'use client'

import type { IConfigCatClient, SettingTypeOf, SettingValue, User } from "configcat-common";
import React from "react";
import type { ConfigCatContextData } from "./ConfigCatContext";
import ConfigCatContext from "./ConfigCatContext";

export type GetValueType = <T extends SettingValue>(
  key: string,
  defaultValue: T,
  user?: User
) => Promise<SettingTypeOf<T>>;

const getValueFunction = (client?: IConfigCatClient) => {
  return async function <T extends SettingValue>(key: string, defaultValue: T, user?: User) {
    return await client?.getValueAsync(key, defaultValue, user) ?? defaultValue as SettingTypeOf<T>;
  };
};

export interface WithConfigCatClientProps {
  configCatClient?: IConfigCatClient;
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
