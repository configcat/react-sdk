import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"

// Clean up after each test case.
afterEach(() => {
  cleanup();
})
