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

export default ConfigCatContext;
