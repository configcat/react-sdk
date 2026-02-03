/// <reference types="vitest/globals" />
import { cleanup } from "@testing-library/react";

// Clean up after each test case.
afterEach(() => {
  cleanup();
})
