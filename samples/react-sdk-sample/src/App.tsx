import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { withConfigCatClient } from "configcat-react";
import ButtonClassComponent from "./ConfigCatHOC";
import ButtonFunctionComponent from "./ConfigCatHook";

const ConfigCatButtonClassComponent = withConfigCatClient(ButtonClassComponent);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <ConfigCatButtonClassComponent text={"Feature Enabled (with HOC)"} />
        </p>
        <p>
          <ButtonFunctionComponent text={"Feature Enabled (with HOOKS)"} />
        </p>
      </header>
    </div>
  );
}

export default App;
