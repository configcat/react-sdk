import React from "react";
import { useFeatureFlag } from "configcat-react";
import { Button, Text, View } from "react-native";

const ButtonFunctionComponent: React.FunctionComponent<{ text: string }> = ({
  text,
}) => {
  const { value: isEnabled, loading } = useFeatureFlag("isAwesomeFeatureEnabled", false);
  return loading
  ? (<View style={{marginTop: 10, marginBottom: 10}}><Text>Loading...</Text></View>)
  : (
    <View style={{marginTop: 10, marginBottom: 10}}>
      <Button disabled={!isEnabled} onPress={() => alert("ConfigCat <3 React")} title={text} />
    </View>
  );
};

export default ButtonFunctionComponent;
