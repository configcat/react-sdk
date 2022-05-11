import React from "react";
import { useFeatureFlag } from "configcat-react";
import { FeatureFlags } from "./ConfigCat";

const ButtonFunctionComponent: React.FunctionComponent<{ text: string }> = ({
  text,
}) => {
  const isEnabled = useFeatureFlag(FeatureFlags.isawesomefeatureenabled, false);
  return (
    <button disabled={!isEnabled} onClick={() => alert("ConfigCat <3 React")}>
      {text}
    </button>
  );
};

export default ButtonFunctionComponent;
