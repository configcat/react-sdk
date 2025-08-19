"use client";

import type { IConfigCatClient, SettingTypeOf, SettingValue, User } from "@configcat/sdk";
import React from "react";
import { type ConfigCatContextData, getConfigCatContext } from "./ConfigCatContext";
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
  providerId?: string
): React.ComponentType<Omit<P, keyof WithConfigCatClientProps>> {

  return (props: P) => {
    const configCatContext = getConfigCatContext(providerId);
    if (!configCatContext) throw createConfigCatProviderError("withConfigCatClient", providerId);

    return (
      <configCatContext.Consumer>
        {(context: ConfigCatContextData | undefined) => {
          if (!context) {
            throw createConfigCatProviderError("withConfigCatClient", providerId);
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
  };
}

export default withConfigCatClient;
