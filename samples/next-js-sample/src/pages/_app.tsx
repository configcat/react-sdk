import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ConfigCatProvider, createConsoleLogger, LogLevel } from "configcat-react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigCatProvider sdkKey="configcat-sdk-1/PKDVCLf-Hq-h-kCzMp-L7Q/tiOvFw5gkky9LFu1Duuvzw" options={{ logger: createConsoleLogger(LogLevel.Info) }}>
      <Component {...pageProps} />
    </ConfigCatProvider>
  );
}
