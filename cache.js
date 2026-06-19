// You're building a simple in-memory cache with expiration
// Implement a Cache class with the following methods:

// cache.set(key, value, ttlMs) — stores value with expiration time in ms
// cache.get(key)               — returns value if not expired, null if expired/missing
// cache.delete(key)            — removes a key
// cache.clear()                — removes all keys

// Example usage:
const cache = new Cache();
cache.set("user:1", { name: "Alice" }, 1000); // expires in 1 second
cache.get("user:1"); // { name: 'Alice' }
// ...after 1 second...
cache.get("user:1"); // null

// Implement Cache:
class Cache {
  // your code here
  constructor() {
    this.store = {};
  }

  set(key, value, ttlMs) {
    if (!this.store[key]) {
      this.store[key] = {
        value,
        expiresAt: Date.now() + ttlMs,
      };
    }
  }

  get(key) {
    if (this.store[key]) {
      if (Date.now() > this.store[key].expiresAt) {
        // expired
        delete this.store[key]; // cleanup
        return null;
      }
      return store[key];
    } else {
      return null;
    }
  }

  clear() {
    this.store = {};
  }

  delete(key) {
    if (this.store[key]) {
      this.store.delete(key);
    } else {
      throw new Error(`${key} not found`);
    }
  }
}
