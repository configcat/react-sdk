import { ConfigCatProvider, LogLevel, createConsoleLogger, withConfigCatClient } from 'configcat-react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ButtonClassComponent from './ConfigCatHOC';
import ButtonFunctionComponent from './ConfigCatHook';

const ConfigCatButtonClassComponent = withConfigCatClient(ButtonClassComponent);

export default function App() {
  return (
    <ConfigCatProvider sdkKey="zVPVCO5_LS9VnDcpIDE84g/zVPVCBScEzDn-VNq0dnYog" options={{logger: createConsoleLogger(LogLevel.Info)}}>
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
