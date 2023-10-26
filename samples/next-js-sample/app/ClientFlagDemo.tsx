/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
"use client";

import { useFeatureFlag } from "../../../lib/types";

export const ClientFlagDemo = () => {
  const { value: isFlagEnabled, loading } = useFeatureFlag(
    "isFlagEnabled",
    false
  );

  return (
    <div>
      {loading && "loading..."}
      {isFlagEnabled ? "flag is on" : "flag is off"}
    </div>
  );
};
