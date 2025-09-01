import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigCatProvider, createConsoleLogger, LogLevel } from "configcat-react";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ConfigCatProvider sdkKey="configcat-sdk-1/PKDVCLf-Hq-h-kCzMp-L7Q/tiOvFw5gkky9LFu1Duuvzw" options={{logger: createConsoleLogger(LogLevel.Info)}}>
      <App />
    </ConfigCatProvider>
  </React.StrictMode>
);
