# JavaScript / TypeScript Interview Prep

> Senior Backend Engineer — Node.js, TypeScript, AWS

**Legend:**

- ✅ PRACTICED — exercised and understood
- ⚠️ STILL TO PRACTICE — read and understand, but practice when possible

---

# PART 1: ARRAY METHODS ✅

## filter, map, sort, find, findIndex, slice

```javascript
const products = [
  { id: 1, name: "Laptop", price: 1200, inStock: true },
  { id: 2, name: "Phone", price: 800, inStock: false },
  { id: 3, name: "Tablet", price: 400, inStock: true },
  { id: 4, name: "Monitor", price: 600, inStock: true },
];

// filter + sort + map — chain them
const result = products
  .filter((p) => p.inStock) // keep only inStock items
  .sort((a, b) => b.price - a.price) // sort descending (b - a = big first)
  .map((p) => p.name); // extract names only

// find — returns the element (or undefined)
const laptop = products.find((p) => p.name === "Laptop");

// findIndex — returns the index (same callback as find!)
const index = products.findIndex((p) => p.name === "Laptop");

// slice — returns a copy without modifying original
const withoutFirstAndLast = products.slice(1, products.length - 1);
```

**Key rules:**

- Sort descending: `(a, b) => b.prop - a.prop` ← b - a = **B**ig first
- Sort ascending: `(a, b) => a.prop - b.prop`
- Never use `a > b` in sort — returns boolean, sort needs a number
- `find` and `findIndex` take the same callback

---

## reduce — the most powerful array method ✅

```javascript
const orders = [
  { id: 1, total: 150, status: "completed" },
  { id: 2, total: 300, status: "pending" },
  { id: 3, total: 450, status: "completed" },
];

// 1. Sum of numbers
// acc = accumulator (running total), starts at 0
const total = orders.reduce((acc, o) => acc + o.total, 0);
// 150 → 450 → 900 → result: 900... wait only completed:
const completedTotal = orders
  .filter((o) => o.status === "completed")
  .reduce((acc, o) => acc + o.total, 0); // 600

// 2. Array to object (key = id, value = total)
const byId = orders.reduce((acc, o) => {
  acc[o.id] = o.total; // add to accumulator object
  return acc; // always return acc!
}, {}); // initial value is empty object
// { 1: 150, 2: 300, 3: 450 }

// 3. Group by property ⭐ (very common at interviews)
const grouped = orders.reduce((acc, o) => {
  if (!acc[o.status]) acc[o.status] = []; // create array if first time seeing this key
  acc[o.status].push(o.total);
  return acc;
}, {});
// { completed: [150, 450], pending: [300] }

// 4. Count occurrences
const roles = ["admin", "user", "admin", "user", "admin"];
const count = roles.reduce((acc, role) => {
  acc[role] = (acc[role] || 0) + 1; // if key exists increment, else start at 0
  return acc;
}, {});
// { admin: 3, user: 2 }

// 5. Flatten array of arrays
const nested = [[1, 2], [3, 4], [5]];
const flat = nested.reduce((acc, arr) => [...acc, ...arr], []);
// [1, 2, 3, 4, 5]
```

**Key rules:**

- Always provide initial value: `0` for numbers, `{}` for objects, `[]` for arrays
- For group by: always check `if (!acc[key]) acc[key] = []` before push
- Always `return acc` at the end of each iteration

---

# PART 2: OBJECT ITERATION ✅

```javascript
const scores = { alice: 60, bob: 20, carol: 1000 };

// Just keys
for (const key in scores) {
  console.log(key);
}
Object.keys(scores).forEach((key) => console.log(key));

// Just values
Object.values(scores).forEach((value) => console.log(value));

// Keys AND values — most useful ⭐
for (const [key, value] of Object.entries(scores)) {
  console.log(key, value); // 'alice' 60, 'bob' 20, ...
}

// Transform object → array of objects (then you can sort, filter, etc)
const arr = Object.entries(scores)
  .map(([name, score]) => ({ name, score })) // destructure [key, value]
  .sort((a, b) => b.score - a.score);
// [{ name: 'carol', score: 1000 }, { name: 'alice', score: 60 }, ...]

// Transform array → object
const people = [
  { name: "alice", score: 60 },
  { name: "bob", score: 20 },
];
const obj = people.reduce((acc, { name, score }) => {
  acc[name] = score;
  return acc;
}, {});
// { alice: 60, bob: 20 }

// Filter object by value
const highScores = Object.fromEntries(
  Object.entries(scores).filter(([key, value]) => value > 30),
);
// { alice: 60, carol: 1000 }
```

---

# PART 3: ASYNC / AWAIT + PROMISES ✅

## Basic async/await with error handling

```javascript
async function getUserWithOrders(userId) {
  try {
    const user = await getUser(userId); // sequential — waits before next line
    const orders = await getOrders(userId); // only runs after user is fetched
    return { user, orders };
  } catch (err) {
    // err is 'unknown' in strict TypeScript — must check type
    if (err instanceof Error)
      throw err; // re-throw with original stack trace
    else throw new Error(`${err}`); // wrap unknown errors in Error object
  }
}
```

## Promise.all — parallel execution

```javascript
// ❌ Sequential — slow (each waits for the previous)
for (const id of ids) {
  const user = await getUser(id); // total time = sum of all requests
}

// ✅ Parallel — fast (all run at the same time)
// total time = slowest single request
async function getAllUsersWithOrders(ids) {
  try {
    return await Promise.all(
      // ⚠️ don't forget 'return'!
      ids.map(async (id) => {
        // map returns array of Promises
        const user = await getUser(id);
        const orders = await getOrders(id);
        return { user, orders };
      }),
    );
  } catch (err) {
    if (err instanceof Error) throw err;
    else throw new Error(`${err}`);
  }
}
// throws if ANY promise fails — all or nothing
```

## Promise.allSettled — never throws

```javascript
async function fetchAll(urls) {
  const results = await Promise.allSettled(
    // never throws, always resolves
    urls.map((url) => fetchUrl(url)),
  );

  // allSettled returns one of:
  // { status: 'fulfilled', value: ... }  ← success
  // { status: 'rejected', reason: ... }  ← failure
  return results.map((result) => {
    if (result.status === "fulfilled") {
      return { status: "success", data: result.value };
    } else {
      return { status: "error", error: result.reason.message };
    }
  });
}
```

## Promise comparison

```javascript
Promise.all([p1, p2, p3]);
// ✅ all succeed → [result1, result2, result3]
// ❌ any fails → throws immediately (fail fast)
// Use when: you need ALL results and any failure should abort

Promise.allSettled([p1, p2, p3]);
// always resolves with all results, never throws
// [{ status: 'fulfilled'|'rejected', value|reason }]
// Use when: you want results regardless of individual failures

Promise.race([p1, p2, p3]);
// resolves/rejects with FIRST to finish (success OR failure)
// Use when: timeout patterns

Promise.any([p1, p2, p3]);
// resolves with FIRST success, ignores individual failures
// throws only if ALL fail
// Use when: trying multiple sources, first success wins
```

---

# PART 4: TYPESCRIPT GENERICS ✅

```typescript
// T is a type variable — declared after the function name
// TypeScript infers T from the arguments you pass
function getFirstOrDefault<T>(arr: T[], defaultValue: T): T {
  return arr[0] ?? defaultValue; // ?? = return left side unless null/undefined
}

getFirstOrDefault([1, 2, 3], 0); // T = number, returns 1
getFirstOrDefault([], 0); // T = number, returns 0
getFirstOrDefault(["a", "b"], "x"); // T = string, returns 'a'

// Generic with constraint — K must be a key of T
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { name: "Alice", age: 28 };
getProperty(user, "name"); // ✅ TypeScript knows this returns string
getProperty(user, "foo"); // 💥 Error — 'foo' is not a key of user
```

**Key rules:**

- `<T>` goes AFTER the function name: `function fn<T>(...)`
- Use `T` as type for params and return value
- Don't make it `async` if there's no `await` inside
- Correct syntax: `T[]` not `<T>[]`

---

# PART 5: TYPESCRIPT UTILITY TYPES ✅

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  role: "admin" | "user";
}

// Partial — all fields become optional (useful for update endpoints)
type UpdateUser = Partial<User>;
// { id?: number, name?: string, email?: string, ... }

// Pick — select ONLY specific fields
type PublicUser = Pick<User, "id" | "name" | "role">;
// { id: number, name: string, role: 'admin' | 'user' }

// Omit — remove specific fields
type PrivateUser = Omit<User, "password">;
// everything EXCEPT password

// Record — typed key-value map
type UserMap = Record<string, User>;
// equivalent to: { [key: string]: User }

// Combining utility types
type UpdatePublicUser = Partial<Pick<User, "name" | "email">>;
// { name?: string, email?: string }
```

**Key rule:** Always use `type`, NOT `interface`, for utility types!

```typescript
type UpdateUser = Partial<User>;      // ✅
interface UpdateUser = Partial<User>  // ❌ syntax error
```

---

# PART 6: COMMON PATTERNS ✅

## Retry mechanism

```javascript
// Option 1 — Recursion (elegant, short)
async function retry(fn, times) {
  try {
    return await fn(); // attempt — if success, returns immediately
  } catch (err) {
    if (times <= 1) throw err; // no more attempts — throw last error
    return retry(fn, times - 1); // recurse with one fewer attempt
  }
}

// Option 2 — Loop (explicit, easier to extend with delay/logging)
async function retry(fn, times, delayMs = 0) {
  let lastError;
  for (let i = 0; i < times; i++) {
    try {
      return await fn(); // if success, exit immediately
    } catch (err) {
      lastError = err; // save error, try again on next iteration
      if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastError; // all attempts failed — throw the last error
}

// Usage
const result = await retry(flakyApiCall, 3);
const result2 = await retry(flakyApiCall, 3, 1000); // with 1s delay between retries
```

---

## Cache with TTL (Time To Live) ✅

```javascript
class Cache {
  constructor() {
    // each entry stores value AND when it expires
    this.store = {}; // { key: { value, expiresAt } }
  }

  set(key, value, ttlMs) {
    this.store[key] = {
      value,
      expiresAt: Date.now() + ttlMs, // current time + duration = expiry timestamp
    };
  }

  get(key) {
    const entry = this.store[key];
    if (!entry) return null; // key doesn't exist
    if (Date.now() > entry.expiresAt) {
      // current time is past expiry
      delete this.store[key]; // clean up expired entry
      return null;
    }
    return entry.value;
  }

  delete(key) {
    delete this.store[key]; // plain objects use 'delete' keyword
    // ⚠️ map.delete(key) is for Map instances — NOT plain objects
  }

  clear() {
    this.store = {}; // reset entire cache
  }
}
```

---

## Flatten nested object (recursion) ✅

```javascript
// Problem: nested objects → flat object with dot-notation keys
// Input:  { address: { city: 'Bucharest', coords: { lat: 44.4 } } }
// Output: { 'address.city': 'Bucharest', 'address.coords.lat': 44.4 }

function flattenObject(obj, prefix = "") {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    // build new key — join with dot only if there's a prefix
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      // it's a nested object — go deeper (recursion)
      // prefix becomes 'address', then 'address.coords', etc.
      // Object.assign copies recursive results into our accumulator
      Object.assign(acc, flattenObject(value, newKey));
    } else {
      // it's a primitive (string, number, boolean) — add directly
      acc[newKey] = value;
    }

    return acc;
  }, {});
}

// Why `typeof value === 'object' && value !== null`?
// In JavaScript: typeof null === 'object' (historical bug!)
// So we must explicitly exclude null
```

**When to think about recursion:**

- Nested structures of unknown depth ← this exact pattern
- Tree traversal
- Any "flatten" problem

---

## Debounce ✅

```javascript
// Debounce delays execution and resets timer on each call
// Only fires after the user stops calling it for `delay` ms
function debounce(fn, delay) {
  let timer; // closure variable — persists between calls

  // this is the function you actually call
  return function (...args) {
    // ...args captures arguments: e.g. debouncedSearch('hello') → args = ['hello']
    clearTimeout(timer); // cancel previous timer (safe even if timer is undefined)
    timer = setTimeout(() => {
      fn(...args); // call original function with the same arguments
    }, delay);
  };
}

// Usage
const debouncedSearch = debounce((query) => fetchResults(query), 300);
debouncedSearch("a"); // starts 300ms timer
debouncedSearch("ab"); // resets timer — 'a' never fires
debouncedSearch("abc"); // resets timer — only 'abc' fires after 300ms
```

---

## Group by ✅

```javascript
const users = [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Carol", role: "admin" },
  { name: "Eve", role: "moderator" },
];

// ❌ Hardcoded — breaks if new role appears
const grouped = { admin: [], user: [] };
users.forEach((u) => grouped[u.role].push(u.name)); // 'moderator' would crash

// ✅ Dynamic — works for any role
const grouped = users.reduce((acc, u) => {
  if (!acc[u.role]) acc[u.role] = []; // initialize array only first time
  acc[u.role].push(u.name);
  return acc;
}, {});
// { admin: ['Alice', 'Carol'], user: ['Bob'], moderator: ['Eve'] }
```

---

# PART 7: QUICK REFERENCE ✅

```javascript
// Check if value is a non-null object
typeof value === "object" && value !== null;

// Optional chaining — stops at first null/undefined, returns undefined
user?.address?.city; // undefined if address or city is null/undefined
arr?.[0]; // safe array access
fn?.(); // safe function call

// Nullish coalescing — fallback ONLY on null/undefined (not 0 or '')
value ?? "default";

// Important difference: ?? vs ||
0 ?? "default"; // → 0        (0 is not null/undefined)
0 || "default"; // → 'default' (0 is falsy)
"" ?? "default"; // → ''
"" || "default"; // → 'default'

// Delete object key
delete obj[key]; // ✅ plain objects
map.delete(key); // ✅ Map instances

// Merge objects
Object.assign(target, source); // mutates target, returns target
const merged = { ...obj1, ...obj2 }; // spread — creates new object

// Falsy values — all filtered out by .filter(Boolean) or if (x)
(false, 0, "", null, undefined, NaN);
```

---

# PART 8: NEW — TypeScript Advanced ⚠️ STILL TO PRACTICE

## keyof and typeof

```typescript
interface User {
  id: number;
  name: string;
  role: "admin" | "user";
}

// keyof — gets union of all keys as string literals
type UserKeys = keyof User; // 'id' | 'name' | 'role'

// typeof — gets the type of a value (useful for objects/functions)
const config = { host: "localhost", port: 3000 };
type Config = typeof config; // { host: string, port: number }

// Combining keyof + typeof — very common pattern
function getField<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // TypeScript knows exact return type
}
getField(user, "name"); // returns string ✅
getField(user, "foo"); // 💥 compile error — 'foo' not in User
```

---

## Conditional Types ⚠️ STILL TO PRACTICE

```typescript
// T extends X ? Y : Z — like a ternary but for types
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>; // 'yes'
type B = IsString<number>; // 'no'

// Real world example — unwrap Promise
type Unwrap<T> = T extends Promise<infer U> ? U : T;
// infer U = "extract the type inside Promise"

type A = Unwrap<Promise<string>>; // string
type B = Unwrap<number>; // number (not a Promise, returns as-is)
```

---

## Mapped Types ⚠️ STILL TO PRACTICE

```typescript
// Transform every property in a type
// [K in keyof T] — iterate over all keys of T

// Make all properties readonly
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// Real example — make specific keys required, rest optional
type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
```

---

# PART 9: NEW — Node.js Specific ⚠️ STILL TO PRACTICE

## EventEmitter pattern

```javascript
// Node.js has a built-in EventEmitter
// It's the foundation of streams, HTTP, and most Node.js internals
const EventEmitter = require("events");

class OrderService extends EventEmitter {
  processOrder(order) {
    // do some work...
    this.emit("order:processed", order); // fire event with data
    this.emit("order:notify", order.userId);
  }
}

const service = new OrderService();

// Subscribe to events
service.on("order:processed", (order) => {
  console.log("Order done:", order.id);
});

service.on("order:notify", (userId) => {
  console.log("Notify user:", userId);
});

// once() — fires only once then auto-removes
service.once("order:processed", (order) => {
  console.log("First order only:", order.id);
});

service.processOrder({ id: 1, userId: 42 });
```

**Why it matters:**

- Foundation of Node.js streams (readable, writable)
- HTTP server, Socket.io, most async Node.js APIs use EventEmitter
- Useful for decoupled communication between services

---

## Streams ⚠️ STILL TO PRACTICE

```javascript
// Streams process data piece by piece — no need to load everything in memory
// Use for: large files, video, CSV processing, HTTP responses

const fs = require("fs");

// ❌ Bad for large files — loads everything into memory
const data = fs.readFileSync("huge-file.csv"); // may crash with 4GB file

// ✅ Stream — processes chunk by chunk
const readable = fs.createReadStream("huge-file.csv");
readable.on("data", (chunk) => {
  // process each chunk as it arrives
  console.log("chunk size:", chunk.length);
});
readable.on("end", () => console.log("done"));
readable.on("error", (err) => console.error(err));

// Pipe — connect readable stream to writable stream
const writable = fs.createWriteStream("output.csv");
readable.pipe(writable); // read from file, write to another file

// Transform stream — read, transform, write
const { Transform } = require("stream");
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});
readable.pipe(upperCase).pipe(writable);
```

---

## process.nextTick vs setImmediate vs setTimeout ⚠️ STILL TO PRACTICE

```javascript
// Execution order (important for interviews):
console.log("1 - sync");

setTimeout(() => console.log("4 - setTimeout"), 0);
// runs in timers phase of event loop

setImmediate(() => console.log("3 - setImmediate"));
// runs in check phase — after I/O

process.nextTick(() => console.log("2 - nextTick"));
// runs BEFORE the next event loop iteration — highest priority

console.log("1b - also sync");

// Output order:
// 1 - sync
// 1b - also sync
// 2 - nextTick      ← before event loop continues
// 3 - setImmediate  ← check phase
// 4 - setTimeout    ← timers phase
```

**When to use:**

- `process.nextTick` — when you need to run something after current sync code but before any I/O
- `setImmediate` — when you want to run after I/O callbacks
- `setTimeout(fn, 0)` — similar to setImmediate but slightly later

---

# PART 10: NEW — Design Patterns ⚠️ STILL TO PRACTICE

## Singleton

```javascript
// Singleton — only one instance exists across the entire app
// Common use: database connections, config, loggers

class Database {
  static instance = null; // static = shared across all instances

  constructor(connectionString) {
    if (Database.instance) {
      return Database.instance; // return existing instance
    }
    this.connection = connectionString;
    Database.instance = this; // save as the single instance
  }

  query(sql) {
    /* ... */
  }
}

const db1 = new Database("postgres://localhost/mydb");
const db2 = new Database("postgres://localhost/other");
console.log(db1 === db2); // true — same instance!
// db2 ignored the new connectionString
```

---

## Repository Pattern ⚠️ STILL TO PRACTICE

```typescript
// Repository separates data access logic from business logic
// Makes code testable — you can mock the repository in tests

// Interface defines the contract
interface UserRepository {
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<User>;
  delete(id: number): Promise<void>;
}

// Real implementation — talks to database
class PostgresUserRepository implements UserRepository {
  async findById(id: number): Promise<User | null> {
    return db.query("SELECT * FROM users WHERE id = $1", [id]);
  }
  async findAll(): Promise<User[]> {
    return db.query("SELECT * FROM users");
  }
  async save(user: User): Promise<User> {
    return db.query("INSERT INTO users...", [user]);
  }
  async delete(id: number): Promise<void> {
    await db.query("DELETE FROM users WHERE id = $1", [id]);
  }
}

// Mock for tests — no real database needed
class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];
  async findById(id: number) {
    return this.users.find((u) => u.id === id) ?? null;
  }
  async findAll() {
    return this.users;
  }
  async save(user: User) {
    this.users.push(user);
    return user;
  }
  async delete(id: number) {
    this.users = this.users.filter((u) => u.id !== id);
  }
}

// Service uses the interface — doesn't care which implementation
class UserService {
  constructor(private repo: UserRepository) {} // dependency injection

  async getUser(id: number) {
    const user = await this.repo.findById(id);
    if (!user) throw new Error(`User ${id} not found`);
    return user;
  }
}
```

---

# PART 11: NEW — SQL Basics ⚠️ STILL TO PRACTICE

```sql
-- Basic SELECT
SELECT name, email FROM users WHERE age > 18 ORDER BY name ASC;

-- INNER JOIN — only rows that match in BOTH tables
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN — all users, even those with no orders
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
-- users with no orders will have o.total = NULL

-- GROUP BY + HAVING (HAVING is WHERE for grouped results)
SELECT user_id, COUNT(*) as order_count, SUM(total) as revenue
FROM orders
GROUP BY user_id
HAVING SUM(total) > 1000; -- only users with >1000 revenue

-- Indexes — speed up queries on columns you filter/sort by
CREATE INDEX idx_users_email ON users(email);
-- Without index: scans entire table O(n)
-- With index: jumps directly to result O(log n)

-- When to add index: columns in WHERE, JOIN ON, ORDER BY
-- Trade-off: indexes speed up reads but slow down writes

-- Transactions — all or nothing
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- both succeed together
-- If anything fails: ROLLBACK — neither change is applied
```

---

# PART 12: NEW — System Design Concepts ⚠️ STILL TO PRACTICE

## Rate Limiting

```javascript
// Rate limiting — prevent abuse by limiting requests per time window
// Example: max 100 requests per minute per user

// Simple in-memory implementation (use Redis in production)
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests; // e.g. 100
    this.windowMs = windowMs; // e.g. 60000 (1 minute)
    this.store = new Map(); // userId → { count, windowStart }
  }

  isAllowed(userId) {
    const now = Date.now();
    const entry = this.store.get(userId);

    if (!entry || now - entry.windowStart > this.windowMs) {
      // first request or window expired — reset
      this.store.set(userId, { count: 1, windowStart: now });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false; // limit exceeded
    }

    entry.count++;
    return true;
  }
}

// Express middleware usage
const limiter = new RateLimiter(100, 60000);
app.use((req, res, next) => {
  if (!limiter.isAllowed(req.userId)) {
    return res.status(429).json({ error: "Too many requests" });
  }
  next();
});
```

---

## Pagination — Cursor vs Offset ⚠️ STILL TO PRACTICE

```javascript
// OFFSET pagination — simple but slow on large datasets
// Problem: if new items added, pages shift → duplicate/missing items
GET /users?page=2&limit=10
// SQL: SELECT * FROM users LIMIT 10 OFFSET 20
// ❌ Slow on large tables — database scans all previous rows

// CURSOR pagination — fast, stable, no duplicates
// Cursor = pointer to last seen item (usually ID or timestamp)
GET /users?cursor=eyJpZCI6MjB9&limit=10
// SQL: SELECT * FROM users WHERE id > 20 LIMIT 10
// ✅ Uses index — fast regardless of dataset size
// ✅ Stable — new items don't shift pages

// Response includes next cursor
{
  "data": [...],
  "nextCursor": "eyJpZCI6MzB9", // base64 encoded { id: 30 }
  "hasMore": true
}
```

---

## Idempotency ⚠️ STILL TO PRACTICE

```javascript
// Idempotent = calling the same operation multiple times = same result
// Critical for payment systems, retries, distributed systems

// ❌ NOT idempotent — duplicate requests = duplicate charges
POST /payments { amount: 100, userId: 1 }
// if called twice → charges user twice!

// ✅ Idempotent — using idempotency key
POST /payments
Headers: { 'Idempotency-Key': 'unique-uuid-per-payment' }
Body: { amount: 100, userId: 1 }
// if called twice with same key → returns same result, no duplicate charge

// Implementation
async function createPayment(idempotencyKey, paymentData) {
  // check if we've seen this key before
  const existing = await cache.get(`payment:${idempotencyKey}`);
  if (existing) return existing; // return cached result

  // process payment
  const result = await processPayment(paymentData);

  // store result with the key (24h TTL)
  await cache.set(`payment:${idempotencyKey}`, result, 86400000);
  return result;
}
```

---

# PART 13: NEW — Testing Basics ⚠️ STILL TO PRACTICE

```javascript
// Jest — most common testing framework in Node.js

// Unit test — test a single function in isolation
describe("getFirstOrDefault", () => {
  it("returns first element when array is not empty", () => {
    expect(getFirstOrDefault([1, 2, 3], 0)).toBe(1);
  });

  it("returns default when array is empty", () => {
    expect(getFirstOrDefault([], 0)).toBe(0);
  });
});

// Mocking — replace real dependencies with fake ones
// Why: tests should be fast and not need real databases/APIs
jest.mock("./userRepository");

const mockRepo = {
  findById: jest.fn().mockResolvedValue({ id: 1, name: "Alice" }),
  save: jest.fn().mockResolvedValue({ id: 1, name: "Alice" }),
};

describe("UserService", () => {
  it("returns user when found", async () => {
    const service = new UserService(mockRepo);
    const user = await service.getUser(1);
    expect(user.name).toBe("Alice");
    expect(mockRepo.findById).toHaveBeenCalledWith(1); // verify mock was called
  });

  it("throws when user not found", async () => {
    mockRepo.findById.mockResolvedValueOnce(null); // override for this test
    const service = new UserService(mockRepo);
    await expect(service.getUser(99)).rejects.toThrow("User 99 not found");
  });
});

// Test types:
// Unit — test one function, mock everything else (fast, isolated)
// Integration — test multiple components together (real DB in test env)
// E2E — test full flow through the system (slow, catches real bugs)
```

---

# PART 14: THEORY Q&A ✅

## == vs ===

`==` checks value with type coercion. `===` checks value AND type.

```javascript
"5" == 5; // true  — string coerced to number
"5" === 5; // false — different types
null == undefined; // true  (special case)
null === undefined; // false
```

**Always use `===` in production.**

---

## What is a closure?

A function that has access to variables from its outer scope,
even after that outer scope has finished executing.

```javascript
function counter() {
  let count = 0; // outer variable
  return () => count++; // inner function closes over count
}
const increment = counter();
increment(); // 1
increment(); // 2 — count persists even though counter() is done!
```

**Real example:** `debounce` uses closure — `timer` persists between calls.

---

## Event loop in Node.js

A loop that runs continuously, checks the call stack and callback queue.
If the stack is empty and there's a finished callback in the queue,
it pushes it onto the stack.

This makes Node.js **non-blocking** — while waiting for I/O,
the event loop processes other callbacks.

**Phases:**

1. timers — setTimeout, setInterval
2. I/O callbacks — network, file system
3. poll — retrieve new I/O events
4. check — setImmediate
5. close — cleanup

---

## var vs let vs const

```javascript
if (true) {
  let x = 1; // block scoped — stays inside {}
  var y = 2; // escapes the block!
}
console.log(x); // ReferenceError ✅
console.log(y); // 2 ❌ leaked out

const obj = {};
obj.name = "Alice"; // ✅ properties can change
obj = {}; // 💥 reassignment not allowed
```

---

## interface vs type in TypeScript

```typescript
// interface — supports declaration merging
interface User {
  name: string;
}
interface User {
  age: number;
}
// TypeScript merges them: { name, age } ✅

// type — cannot be redeclared, supports unions
type ID = string | number; // ✅ only type can do this

// Utility types — always use type
type PartialUser = Partial<User>; // ✅
```

**Rule:** `interface` for object shapes. `type` for utility types and unions.

---

## unknown vs any

```typescript
let a: any = "hello";
a.nonExistent(); // ✅ no error — TypeScript gives up checking

let u: unknown = "hello";
u.toUpperCase(); // 💥 Error — must check type first
if (typeof u === "string") {
  u.toUpperCase(); // ✅ TypeScript knows it's a string now
}
```

**Use `unknown` for:** `catch (err: unknown)`, external API data, user input.
**Never use `any`** unless absolutely necessary.

---

## Promise.all vs allSettled vs race vs any

```javascript
Promise.all; // fail fast — throws if any fails
Promise.allSettled; // never throws — returns all results
Promise.race; // first to finish wins (success OR failure)
Promise.any; // first SUCCESS wins — throws if all fail
```

---

## JWT authentication

**Structure:** `header.payload.signature`

- payload is base64 encoded — NOT encrypted, easily decoded!
- signature uses secret key — can't be tampered with

**Flow:** login → server signs JWT → client sends in every request header →
server verifies signature → trusts payload

**Never store:** passwords, credit cards, sensitive data in JWT payload.

---

## Microservices

Separate services deployed independently. If one fails, others keep running.

**Use when:** large teams, different scaling needs, independent deployments.
**Don't use when:** small team, simple app, no DevOps maturity.

**From Reconomy:** SQS queues between services — returns processing scaled
independently from the main app.

---

## REST vs GraphQL

|                | REST     | GraphQL       |
| -------------- | -------- | ------------- |
| Endpoints      | multiple | one           |
| Over-fetching  | yes      | no            |
| Caching        | easy     | complex       |
| Schema changes | easy     | risk breaking |

**REST for:** simple CRUD, public APIs.
**GraphQL for:** complex data, multiple clients, mobile.

---

# PART 15: MY EXPERIENCE — KEY STORIES

## AWS Lambda + Shopify (Reconomy)

Deployed Shopify app to Lambda for cost, scalability, fast cold start.
Challenge: Shopify uses esbuild internally — output not compatible with Lambda's Node.js runtime.
Worked with their architect for 2 months. Fixed esbuild configuration.
Result: stable production Shopify integration on Lambda.

## SQS Microservices (Reconomy)

Built SQS-based queue processing for returns workflows at scale.
Designed integration patterns for Shopify and TikTok APIs —
plug-and-play connectivity across enterprise systems.

## React Component Library (Cognizant)

Each component ships as independent npm package.
Consumed across multiple apps — design consistency, zero duplication.

---

# PART 16: QUESTIONS TO ASK AT INTERVIEW

- What AWS services does the team use specifically?
- How are tasks defined and estimated in the team?
- How does onboarding look for a new contractor?
- What does success look like after 30/60/90 days?
- How realistic is extension beyond 12 months?
- Who will I work with day to day?
- How is knowledge distributed — documented or in people's heads?

---

# PART 17: KEY REMINDERS

## Read requirements TWICE before coding

Identify ALL requirements before writing a single line.
30 seconds of reading saves you from missing half the exercise.

## If you don't know something

"I haven't worked with that specifically, but I pick up new
technologies quickly — I've demonstrated that multiple times."

## If you get stuck — think out loud

Say what you're trying to do even if you don't know exact syntax.
Interviewers value thought process over perfect syntax.

## Recursion — when to reach for it

- Nested structures of unknown depth
- Tree / graph traversal
- Any "flatten" problem
- Problem can be expressed as: solve for N, then solve for N-1

## Common mistakes to avoid

- `sort((a, b) => a > b)` — wrong, use `a - b` or `b - a`
- Forgetting `return` before `await Promise.all(...)`
- `interface X = Partial<T>` — wrong, use `type X = Partial<T>`
- `typeof value === Object` — wrong, use `typeof value === 'object'`
- `this.store.delete(key)` — wrong for plain objects, use `delete this.store[key]`
- Not checking `value !== null` with `typeof value === 'object'`
