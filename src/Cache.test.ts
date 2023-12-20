import { LocalStorageCache } from "./Cache";

it("LocalStorageCache works with non latin 1 characters", () => {
    const cache = new LocalStorageCache();
    const key = "testkey";
    const text = "äöüÄÖÜçéèñışğâ¢™✓😀";
    cache.set(key, text);
    const retrievedValue = cache.get(key);
    expect(retrievedValue).toStrictEqual(text);
});
