import { User } from "configcat-common";
import { useContext, useState, useEffect } from "react";
import ConfigCatContext from "./ConfigCatContext";

function useFeatureFlag(key: string, defaultValue: any, user?: User | undefined) {
  const configCatContext = useContext(ConfigCatContext);

  if (configCatContext === undefined) throw Error("useFeatureFlag hook must be used in ConfigCatProvider!");

  const [featureFlagValue, setFeatureFlag] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [userState] = useState(user);

  useEffect(() => {
    configCatContext.client.getValueAsync(key, defaultValue, userState)
      .then(v => { setFeatureFlag(v); setLoading(false) });
  }, [configCatContext, key, defaultValue]);

  return {value: featureFlagValue, loading};
}

function useConfigCatClient() {
  const configCatContext = useContext(ConfigCatContext);

  if (configCatContext === undefined) throw Error("useConfigCatClient hook must be used in ConfigCatProvider!");

  return configCatContext.client;
}

export { useFeatureFlag, useConfigCatClient };
