import type { IConfigCatClient, SettingTypeOf, SettingValue, User } from "configcat-common";
import { useContext, useEffect, useState } from "react";
import ConfigCatContext from "./ConfigCatContext";

function useFeatureFlag<T extends SettingValue>(key: string, defaultValue: T, user?: User): {
  value: SettingTypeOf<T>;
  loading: boolean;
} {
  const configCatContext = useContext(ConfigCatContext);

  if (configCatContext === void 0) throw Error("useFeatureFlag hook must be used in ConfigCatProvider!");

  const [featureFlagValue, setFeatureFlag] = useState(defaultValue as SettingTypeOf<T>);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!configCatContext.client) {
      return;
    }
    configCatContext.client.getValueAsync(key, defaultValue, user)
      .then(v => { setFeatureFlag(v); setLoading(false); });
  }, [configCatContext, key, defaultValue, JSON.stringify(user)]);

  return { value: featureFlagValue, loading };
}

function useConfigCatClient(): IConfigCatClient | undefined {
  const configCatContext = useContext(ConfigCatContext);

  if (configCatContext === void 0) throw Error("useConfigCatClient hook must be used in ConfigCatProvider!");

  return configCatContext.client;
}

export { useFeatureFlag, useConfigCatClient };
