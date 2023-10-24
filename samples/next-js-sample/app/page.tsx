import { ConfigCatProvider, useFeatureFlag } from "configcat-react";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Home() {
  const { value: isFlagEnabled, loading } = useFeatureFlag(
    "isFlagEnabled",
    false
  );

  return (
    <ConfigCatProvider sdkKey="#YOUR_SDK_KEY#">
      {loading && "loading..."}
      {isFlagEnabled ? "flag is on" : "flag is off"}
    </ConfigCatProvider>
  );
}
