import { describe, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react"
import App from "./App"
import { ConfigCatProvider, createFlagOverridesFromMap, OverrideBehaviour } from "configcat-react";

describe("App", () => {
  it("renders feature flagged components", async () => {
    const flagOverrides = createFlagOverridesFromMap({
      "isAwesomeFeatureEnabled": true,
    }, OverrideBehaviour.LocalOnly);

    render(
      <ConfigCatProvider sdkKey="test" options={{flagOverrides}}>
        <App />
      </ConfigCatProvider>
    );

    await waitFor(() => {
      let buttonElement = screen.getByText("Feature Enabled (with HOC)");
      expect(buttonElement).toHaveProperty("disabled", false);

      buttonElement = screen.getByText("Feature Enabled (with HOOKS)");
      expect(buttonElement).toHaveProperty("disabled", false);
    });
  });
});
