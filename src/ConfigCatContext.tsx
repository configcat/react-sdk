import type { IConfigCatClient } from "configcat-common";
import React from "react";

export interface ConfigCatContextData {
  client: IConfigCatClient;
  lastUpdated?: Date;
}

/** @remarks Map key: provider id normalized to lower case. */
const ConfigCatContextRegistry = new Map<string, React.Context<ConfigCatContextData | undefined>>();

function registryKeyFor(providerId: string | undefined) {
  return providerId ? providerId.toLowerCase() : "";
}

export function ensureConfigCatContext(providerId?: string): React.Context<ConfigCatContextData | undefined> {
  const key = registryKeyFor(providerId);
  let context = ConfigCatContextRegistry.get(key);
  if (!context) {
    context = React.createContext<ConfigCatContextData | undefined>(void 0);
    context.displayName = "ConfigCatContext" + (providerId ? "_" + providerId : "");
    ConfigCatContextRegistry.set(key, context);
  }
  return context;
}

export function getConfigCatContext(providerId?: string): React.Context<ConfigCatContextData | undefined> | undefined {
  return ConfigCatContextRegistry.get(registryKeyFor(providerId));
}
