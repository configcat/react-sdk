import React from "react";
import { useFeatureFlag } from "configcat-react";

const ButtonFunctionComponent: React.FunctionComponent<{ text: string }> = ({
  text,
}) => {
  const { value: isEnabled, loading } = useFeatureFlag("isAwesomeFeatureEnabled", false);
  return loading ? (<div>Loading...</div>) : (
    <button disabled={!isEnabled} onClick={() => alert("ConfigCat <3 React")}>
      {text}
    </button>
  );
};

export default ButtonFunctionComponent;
