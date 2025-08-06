import { ConfigCatProvider, LogLevel, createConsoleLogger, withConfigCatClient } from 'configcat-react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ButtonClassComponent from './ConfigCatHOC';
import ButtonFunctionComponent from './ConfigCatHook';

const ConfigCatButtonClassComponent = withConfigCatClient(ButtonClassComponent);

export default function App() {
  return (
    <ConfigCatProvider sdkKey="configcat-sdk-1/PKDVCLf-Hq-h-kCzMp-L7Q/tiOvFw5gkky9LFu1Duuvzw" options={{logger: createConsoleLogger(LogLevel.Info)}}>
      <View style={styles.container}>
        <ConfigCatButtonClassComponent text={"Feature Enabled (with HOC)"} />
        <ButtonFunctionComponent text={"Feature Enabled (with HOOKS)"} />
        <StatusBar style="auto" />
      </View>
    </ConfigCatProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
