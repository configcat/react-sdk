import React from "react";
import type { IConfigCatClient } from "configcat-common";

export interface ConfigCatContextData {
  client: IConfigCatClient;
  lastUpdated?: Date;
}

const ConfigCatContext = React.createContext<ConfigCatContextData | undefined>(
  void 0
);

ConfigCatContext.displayName = "ConfigCatContext";

export default ConfigCatContext;
