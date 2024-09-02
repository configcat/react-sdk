"use client";

import type { IConfigCatClient, SettingTypeOf, SettingValue, User } from "configcat-common";
import { useContext, useEffect, useState } from "react";
import ConfigCatContext, { getOrCreateConfigCatContext } from "./ConfigCatContext";
import { createConfigCatProviderError } from "./ConfigCatProvider";

function useFeatureFlag<T extends SettingValue>(key: string, defaultValue: T, user?: User, configId?: string): {
  value: SettingTypeOf<T>;
  loading: boolean;
} {
  const configCatContext = useContext(ConfigCatContext);

  if (!configCatContext) throw createConfigCatProviderError("useFeatureFlag", configId);

  const [featureFlagValue, setFeatureFlag] = useState(defaultValue as SettingTypeOf<T>);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    configCatContext.client.getValueAsync(key, defaultValue, user)
      .then(v => { setFeatureFlag(v); setLoading(false); });
  }, [configCatContext, key, defaultValue, JSON.stringify(user)]);

  return { value: featureFlagValue, loading };
}

function useConfigCatClient(configId?: string): IConfigCatClient {

  const configCatContext = useContext(configId ? getOrCreateConfigCatContext(configId) : ConfigCatContext);

  if (!configCatContext) throw createConfigCatProviderError("useConfigCatClient", configId);

  return configCatContext.client;
}

export { useFeatureFlag, useConfigCatClient };
