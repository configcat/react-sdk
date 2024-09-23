"use client";

import type { IConfigCatClient } from "configcat-common";
import React from "react";

export interface ConfigCatContextData {
  client: IConfigCatClient;
  lastUpdated?: Date;
}

const ConfigCatContext = React.createContext<ConfigCatContextData | undefined>(
  void 0
);

ConfigCatContext.displayName = "ConfigCatContext";

const ConfigCatContextRegistry = new Map<string, React.Context<ConfigCatContextData | undefined>>();

export function getOrCreateConfigCatContext(providerId: string): React.Context<ConfigCatContextData | undefined> {

  let context: React.Context<ConfigCatContextData | undefined> | undefined = ConfigCatContextRegistry.get(providerId.toLowerCase());

  if (!context) {
    context = React.createContext<ConfigCatContextData | undefined>(
      void 0
    );

    context.displayName = "ConfigCatContext_" + providerId;

    ConfigCatContextRegistry.set(providerId.toLowerCase(), context);
  }

  return context;
}

export default ConfigCatContext;
