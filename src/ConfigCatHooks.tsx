import type { IConfigCatClient, User } from "configcat-common";
import { useContext, useEffect, useState } from "react";
import ConfigCatContext from "./ConfigCatContext";

function useFeatureFlag(key: string, defaultValue: any, user?: User | undefined): {
  value: any;
  loading: boolean;
} {
  const configCatContext = useContext(ConfigCatContext);

  if (configCatContext === void 0) throw Error("useFeatureFlag hook must be used in ConfigCatProvider!");

  const [featureFlagValue, setFeatureFlag] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [userState] = useState(user);

  useEffect(() => {
    configCatContext.client.getValueAsync(key, defaultValue, userState)
      .then(v => { setFeatureFlag(v); setLoading(false); });
  }, [configCatContext, key, defaultValue]);

  return { value: featureFlagValue, loading };
}

function useConfigCatClient(): IConfigCatClient {
  const configCatContext = useContext(ConfigCatContext);

  if (configCatContext === void 0) throw Error("useConfigCatClient hook must be used in ConfigCatProvider!");

  return configCatContext.client;
}

export { useFeatureFlag, useConfigCatClient };
