import type { IConfigCatClient } from "configcat-common";
import React from "react";

export interface ConfigCatContextData {
  client: IConfigCatClient;
  lastUpdated?: Date;
}

/** @remarks Map key: provider id normalized to lower case. */
const ConfigCatContextRegistry = new Map<string, {
  context: React.Context<ConfigCatContextData | undefined>;
  refCount: number;
}>();

function registryKeyFor(providerId: string | undefined) {
  return providerId ? providerId.toLowerCase() : "";
}

export function ensureConfigCatContext(providerId?: string): React.Context<ConfigCatContextData | undefined> {
  const key = registryKeyFor(providerId);
  let entry = ConfigCatContextRegistry.get(key);
  if (!entry) {
    const context = React.createContext<ConfigCatContextData | undefined>(void 0);
    context.displayName = "ConfigCatContext" + (providerId ? "_" + providerId : "");
    ConfigCatContextRegistry.set(key, entry = { context, refCount: 0 });
  }
  return entry.context;
}

export function getConfigCatContext(providerId?: string): React.Context<ConfigCatContextData | undefined> | undefined {
  return ConfigCatContextRegistry.get(registryKeyFor(providerId))?.context;
}

export function registerConfigCatContextUsage(providerId?: string): boolean {
  const entry = ConfigCatContextRegistry.get(registryKeyFor(providerId));
  if (!entry) return false;
  entry.refCount++;
  return true;
}

export function unregisterConfigCatContextUsage(providerId?: string): boolean {
  const key = registryKeyFor(providerId);
  const entry = ConfigCatContextRegistry.get(key);
  if (!entry) return false;

  entry.refCount--;
  if (entry.refCount > 0) {
    return false;
  }

  ConfigCatContextRegistry.delete(key);
  return true;
}
