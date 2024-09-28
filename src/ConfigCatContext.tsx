"use client";

import type { IConfigCatClient } from "configcat-common";
import React from "react";

export interface ConfigCatContextData {
  client: IConfigCatClient;
  lastUpdated?: Date;
}

/** @remarks Map key: provider id normalized to lower case. */
const ConfigCatContextRegistry = new Map<string, { context: React.Context<ConfigCatContextData | undefined>; isReserved?: boolean }>();

function registryKeyFor(providerId: string | undefined) {
  return providerId ? providerId.toLowerCase() : "";
}

export function registerConfigCatContext(providerId?: string): React.Context<ConfigCatContextData | undefined> {
  const context = React.createContext<ConfigCatContextData | undefined>(void 0);

  context.displayName = "ConfigCatContext" + (providerId ? "_" + providerId : "");

  ConfigCatContextRegistry.set(registryKeyFor(providerId), { context });

  return context;
}

export function reserveConfigCatContext(providerId?: string): boolean | undefined {
  const item = ConfigCatContextRegistry.get(registryKeyFor(providerId));
  if (!item) return;
  if (item.isReserved) return false;
  return item.isReserved = true;
}

export function getConfigCatContext(providerId?: string): React.Context<ConfigCatContextData | undefined> | undefined {
  return ConfigCatContextRegistry.get(registryKeyFor(providerId))?.context;
}

export function unregisterConfigCatContext(providerId?: string): boolean {
  return ConfigCatContextRegistry.delete(registryKeyFor(providerId));
}
