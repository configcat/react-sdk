import type { IConfigCatClient, User } from "configcat-common";
import { useContext, useEffect, useState } from "react";
import ConfigCatContext from "./ConfigCatContext";

function useFeatureFlag(
  key: string,
  defaultValue: any,
  user?: User | undefined,
  reevaluateOnUserChange?: boolean | undefined,
): { value: any; loading: boolean } {
  const configCatContext = useContext(ConfigCatContext);

  if (configCatContext === void 0) throw Error("useFeatureFlag hook must be used in ConfigCatProvider!");

  const [featureFlagValue, setFeatureFlag] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [userState, setUserState] = useState(user);

  useEffect(() => {
    if (reevaluateOnUserChange) {
      setUserState(user);
    }
  }, [user]);

  useEffect(() => {
    configCatContext.client.getValueAsync(key, defaultValue, userState)
      .then(v => { setFeatureFlag(v); setLoading(false); });
  }, [configCatContext, key, defaultValue, userState]);

  return { value: featureFlagValue, loading };
}

function useConfigCatClient(): IConfigCatClient {
  const configCatContext = useContext(ConfigCatContext);

  if (configCatContext === void 0) throw Error("useConfigCatClient hook must be used in ConfigCatProvider!");

  return configCatContext.client;
}

export { useFeatureFlag, useConfigCatClient };
