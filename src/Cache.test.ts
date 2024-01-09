import { LocalStorageCache, fromUtf8Base64, getLocalStorage, toUtf8Base64 } from "../src/Cache";

describe("Base64 encode/decode test", () => {
  let allBmpChars = "";
  for (let i = 0; i <= 0xFFFF; i++) {
    if (i < 0xD800 || 0xDFFF < i) { // skip lone surrogate chars
      allBmpChars += String.fromCharCode(i);
    }
  }

  for (const input of [
    "",
    "\n",
    "äöüÄÖÜçéèñışğâ¢™✓😀",
    allBmpChars
  ]) {
    it(`Base64 encode/decode works - input: ${input.slice(0, Math.min(input.length, 128))}`, () => {
      expect(fromUtf8Base64(toUtf8Base64(input))).toStrictEqual(input);
    });
  }
});

describe("LocalStorageCache cache tests", () => {
  it("LocalStorageCache works with non latin 1 characters", () => {
    const localStorage = getLocalStorage();
    expect(localStorage).not.toBeNull();

    const cache = new LocalStorageCache(localStorage!);
    const key = "testkey";
    const text = "äöüÄÖÜçéèñışğâ¢™✓😀";
    cache.set(key, text);
    const retrievedValue = cache.get(key);
    expect(retrievedValue).toStrictEqual(text);
    expect(window.localStorage.getItem(key)).toStrictEqual("w6TDtsO8w4TDlsOcw6fDqcOow7HEscWfxJ/DosKi4oSi4pyT8J+YgA==");
  });
});
