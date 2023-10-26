/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
"use client";

import { useFeatureFlag } from "configcat-react";

export const ClientFlagDemo = () => {
  const { value: isFlagEnabled, loading } = useFeatureFlag(
    "isAwesomeFeatureEnabled",
    false
  );

  return (
    <div>
      {loading && "loading..."}
      {isFlagEnabled ? "flag is on" : "flag is off"}
    </div>
  );
};
