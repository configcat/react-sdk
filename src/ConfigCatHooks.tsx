"use client";

import type { IConfigCatClient, SettingTypeOf, SettingValue, User } from "@configcat/sdk";
import { useContext, useEffect, useState } from "react";
import { getConfigCatContext } from "./ConfigCatContext";
import { createConfigCatProviderError } from "./ConfigCatProvider";

function useFeatureFlag<T extends SettingValue>(key: string, defaultValue: T, user?: User, providerId?: string): {
  value: SettingTypeOf<T>;
  loading: boolean;
} {
  const configCatContextObj = getConfigCatContext(providerId);
  if (!configCatContextObj) throw createConfigCatProviderError("useFeatureFlag", providerId);

  const configCatContext = useContext(configCatContextObj);
  if (!configCatContext) throw createConfigCatProviderError("useFeatureFlag", providerId);

  const [featureFlagValue, setFeatureFlag] = useState(defaultValue as SettingTypeOf<T>);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    configCatContext.client.getValueAsync(key, defaultValue, user)
      .then(v => { setFeatureFlag(v); setLoading(false); });
  }, [configCatContext, key, defaultValue, JSON.stringify(user)]);

  return { value: featureFlagValue, loading };
}

function useConfigCatClient(providerId?: string): IConfigCatClient {
  const configCatContextObj = getConfigCatContext(providerId);
  if (!configCatContextObj) throw createConfigCatProviderError("useConfigCatClient", providerId);

  const configCatContext = useContext(configCatContextObj);
  if (!configCatContext) throw createConfigCatProviderError("useConfigCatClient", providerId);

  return configCatContext.client;
}

export { useFeatureFlag, useConfigCatClient };
