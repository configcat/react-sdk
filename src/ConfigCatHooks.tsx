"use client";

import type { IConfigCatClient, SettingTypeOf, SettingValue, User } from "configcat-common";
import { useContext, useEffect, useState } from "react";
import ConfigCatContext, { type ConfigCatContextData, getOrCreateConfigCatContext } from "./ConfigCatContext";

function useFeatureFlagInternal<T extends SettingValue>(configCatContext: ConfigCatContextData, key: string, defaultValue: T, user?: User): {
  value: SettingTypeOf<T>;
  loading: boolean;
} {
  const [featureFlagValue, setFeatureFlag] = useState(defaultValue as SettingTypeOf<T>);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    configCatContext.client.getValueAsync(key, defaultValue, user)
      .then(v => { setFeatureFlag(v); setLoading(false); });
  }, [configCatContext, key, defaultValue, JSON.stringify(user)]);

  return { value: featureFlagValue, loading };
}

function useFeatureFlag<T extends SettingValue>(key: string, defaultValue: T, user?: User): {
  value: SettingTypeOf<T>;
  loading: boolean;
} {
  const configCatContext = useContext(ConfigCatContext);

  if (configCatContext === void 0) throw Error("useFeatureFlag hook must be used in ConfigCatProvider!");

  return useFeatureFlagInternal(configCatContext, key, defaultValue, user);
}

function useFeatureFlagByConfigId<T extends SettingValue>(configId: string, key: string, defaultValue: T, user?: User): {
  value: SettingTypeOf<T>;
  loading: boolean;
} {
  const configCatContext = useContext(getOrCreateConfigCatContext(configId));

  if (configCatContext === void 0) throw Error("useFeatureFlagByConfigId hook must be used in ConfigCatProvider [" + configId + "]!");

  return useFeatureFlagInternal(configCatContext, key, defaultValue, user);
}

function useConfigCatClient(): IConfigCatClient {
  const configCatContext = useContext(ConfigCatContext);

  if (!configCatContext) throw Error("useConfigCatClient hook must be used in ConfigCatProvider!");

  return configCatContext.client;
}

function useConfigCatClientByConfigId(configId: string): IConfigCatClient {
  const configCatContext = useContext(getOrCreateConfigCatContext(configId));

  if (!configCatContext) throw Error("useConfigCatClientByConfigId hook must be used in ConfigCatProvider [" + configId + "]!");

  return configCatContext.client;
}

export { useFeatureFlag, useConfigCatClient, useFeatureFlagByConfigId, useConfigCatClientByConfigId };
