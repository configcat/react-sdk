"use client";

import type { IConfigCatClient, SettingTypeOf, SettingValue, User } from "configcat-common";
import React from "react";
import { type ConfigCatContextData, getOrCreateConfigCatContext } from "./ConfigCatContext";
import ConfigCatContext from "./ConfigCatContext";
import { createConfigCatProviderError } from "./ConfigCatProvider";

export type GetValueType = <T extends SettingValue>(
  key: string,
  defaultValue: T,
  user?: User
) => Promise<SettingTypeOf<T>>;

const getValueFunction = (client: IConfigCatClient) => {
  return async function <T extends SettingValue>(key: string, defaultValue: T, user?: User) {
    return await client.getValueAsync(key, defaultValue, user);
  };
};

export interface WithConfigCatClientProps {
  configCatClient: IConfigCatClient;
  getValue: GetValueType;
  lastUpdated?: Date;
}

function withConfigCatClient<P>(
  WrappedComponent: React.ComponentType<P & WithConfigCatClientProps>,
  configId?: string
): React.ComponentType<Omit<P, keyof WithConfigCatClientProps>> {

  const configCatContext = configId ? getOrCreateConfigCatContext(configId) : ConfigCatContext;

  return (props: P) => (
    <configCatContext.Consumer>
      {(context: ConfigCatContextData | undefined) => {
        if (!context) {
          throw createConfigCatProviderError("withConfigCatClient", configId);
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
    </configCatContext.Consumer>
  );
}

export default withConfigCatClient;
