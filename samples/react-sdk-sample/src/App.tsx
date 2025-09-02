import logo from "./assets/logo.svg";
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
        <div>
          <ConfigCatButtonClassComponent text={"Feature Enabled (with HOC)"} />
        </div>
        <div>
          <ButtonFunctionComponent text={"Feature Enabled (with HOOKS)"} />
        </div>
      </header>
    </div>
  );
}

export default App;
