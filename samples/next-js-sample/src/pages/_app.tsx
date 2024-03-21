import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ConfigCatProvider, createConsoleLogger, LogLevel } from "configcat-react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigCatProvider sdkKey="zVPVCO5_LS9VnDcpIDE84g/zVPVCBScEzDn-VNq0dnYog" options={{ logger: createConsoleLogger(LogLevel.Info) }}>
      <Component {...pageProps} />
    </ConfigCatProvider>
  );
}
