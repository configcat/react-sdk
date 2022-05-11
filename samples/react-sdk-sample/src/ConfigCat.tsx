import { createClientWithAutoPoll, createConsoleLogger } from "configcat-js";

const ConfigCatClient = createClientWithAutoPoll(
  "zVPVCO5_LS9VnDcpIDE84g/zVPVCBScEzDn-VNq0dnYog",
  {
    // Setting log level to 3 (= Info) to show detailed feature flag evaluation
    logger: createConsoleLogger(3),
  }
);

export enum FeatureFlags {
  isawesomefeatureenabled = "isAwesomeFeatureEnabled",
}

export default ConfigCatClient;
