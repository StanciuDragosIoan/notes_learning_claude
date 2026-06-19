# JavaScript / TypeScript Interview Prep

> Senior Backend Engineer — Node.js, TypeScript, AWS

---

# PART 1: ARRAY METHODS

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
  .filter((p) => p.inStock) // keep only inStock
  .sort((a, b) => b.price - a.price) // sort descending (b - a = big first)
  .map((p) => p.name); // extract names only

// find — returns the element
const laptop = products.find((p) => p.name === "Laptop");

// findIndex — returns the index (same callback as find!)
const index = products.findIndex((p) => p.name === "Laptop");

// slice — returns copy without modifying original
const withoutFirstAndLast = products.slice(1, products.length - 1);
```

**Key rules:**

- Sort descending: `(a, b) => b.prop - a.prop` ← b - a = **B**ig first
- Sort ascending: `(a, b) => a.prop - b.prop`
- Never use `a > b` in sort — returns boolean, sort needs a number
- `find` and `findIndex` take the same callback

---

## reduce — the most powerful array method

```javascript
const orders = [
  { id: 1, total: 150, status: "completed" },
  { id: 2, total: 300, status: "pending" },
  { id: 3, total: 450, status: "completed" },
];

// 1. Sum of numbers
const total = orders.reduce((acc, o) => acc + o.total, 0);
// acc = accumulator (starts at 0), o = current item

// 2. Array to object (key = id, value = total)
const byId = orders.reduce((acc, o) => {
  acc[o.id] = o.total;
  return acc;
}, {}); // initial value is {}

// 3. Group by property ⭐ (very common at interviews)
const grouped = orders.reduce((acc, o) => {
  if (!acc[o.status]) acc[o.status] = []; // initialize array if not exists
  acc[o.status].push(o.total);
  return acc;
}, {});
// { completed: [150, 450], pending: [300] }

// 4. Count occurrences
const roles = ["admin", "user", "admin", "user", "admin"];
const count = roles.reduce((acc, role) => {
  acc[role] = (acc[role] || 0) + 1; // increment or start at 0
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

# PART 2: OBJECT ITERATION

```javascript
const scores = { alice: 60, bob: 20, carol: 1000 };

// Just keys
for (const key in scores) {
  console.log(key);
}
Object.keys(scores).forEach((key) => console.log(key));

// Just values
Object.values(scores).forEach((value) => console.log(value));

// Keys AND values — most useful
for (const [key, value] of Object.entries(scores)) {
  console.log(key, value); // 'alice' 60, 'bob' 20, ...
}

// Transform object → array of objects
const arr = Object.entries(scores)
  .map(([name, score]) => ({ name, score }))
  .sort((a, b) => b.score - a.score); // sort descending
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

# PART 3: ASYNC / AWAIT + PROMISES

## Basic async/await with error handling

```javascript
async function getUserWithOrders(userId) {
  try {
    const user = await getUser(userId); // await each call
    const orders = await getOrders(userId); // sequential — one after the other
    return { user, orders };
  } catch (err) {
    if (err instanceof Error)
      throw err; // re-throw with original stack
    else throw new Error(`${err}`); // wrap unknown errors
  }
}
```

## Promise.all — parallel execution

```javascript
// ❌ Sequential — slow (waits for each one)
for (const id of ids) {
  const user = await getUser(id); // waits before starting next
}

// ✅ Parallel — fast (all run at the same time)
async function getAllUsersWithOrders(ids) {
  try {
    return await Promise.all(
      // don't forget return!
      ids.map(async (id) => {
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
// throws if ANY promise fails
```

## Promise.allSettled — never throws

```javascript
async function fetchAll(urls) {
  const results = await Promise.allSettled(urls.map((url) => fetchUrl(url)));

  // allSettled returns: { status: 'fulfilled', value: ... }
  //                 or: { status: 'rejected', reason: ... }
  return results.map((result) => {
    if (result.status === "fulfilled") {
      return { status: "success", data: result.value };
    } else {
      return { status: "error", error: result.reason.message };
    }
  });
}
// NEVER throws — returns results for ALL urls
```

## Promise comparison

```javascript
Promise.all([p1, p2, p3]);
// ✅ all succeed → [result1, result2, result3]
// ❌ any fails → throws immediately

Promise.allSettled([p1, p2, p3]);
// always returns all results, never throws
// [{ status: 'fulfilled'|'rejected', value|reason }]

Promise.race([p1, p2, p3]);
// returns/throws FIRST to finish (success OR failure)

Promise.any([p1, p2, p3]);
// returns FIRST success, ignores individual failures
// throws only if ALL fail
```

---

# PART 4: TYPESCRIPT GENERICS

```typescript
// Basic generic — T is declared after function name
function getFirstOrDefault<T>(arr: T[], defaultValue: T): T {
  return arr[0] ?? defaultValue; // ?? = nullish coalescing
}

getFirstOrDefault([1, 2, 3], 0); // returns 1
getFirstOrDefault([], 0); // returns 0
getFirstOrDefault(["a", "b"], "x"); // returns 'a'
getFirstOrDefault([], "x"); // returns 'x'

// Generic with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

**Key rules:**

- `<T>` goes AFTER the function name: `function fn<T>(...)`
- Use `T` as type for params and return value
- Don't make it `async` if there's no `await` inside
- Don't use `<T>[]` — the correct syntax is `T[]`

---

# PART 5: TYPESCRIPT UTILITY TYPES

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  role: "admin" | "user";
}

// Partial — all fields become optional
type UpdateUser = Partial<User>;
// { id?: number, name?: string, email?: string, ... }

// Pick — select ONLY specific fields
type PublicUser = Pick<User, "id" | "name" | "role">;
// { id: number, name: string, role: 'admin' | 'user' }

// Omit — remove specific fields
type PrivateUser = Omit<User, "password">;
// everything EXCEPT password

// Record — typed key-value object
type UserMap = Record<string, User>;
// { [key: string]: User }

// Combining utility types
type UpdatePublicUser = Partial<Pick<User, "name" | "email">>;
// { name?: string, email?: string }
```

**Key rule:** Always use `type`, NOT `interface`, for utility types!

```typescript
type UpdateUser = Partial<User>;     // ✅
interface UpdateUser = Partial<User> // ❌ syntax error
```

---

# PART 6: COMMON PATTERNS

## Retry mechanism

```javascript
// Option 1 — Recursion (elegant, short)
async function retry(fn, times) {
  try {
    return await fn(); // attempt — return immediately if success
  } catch (err) {
    if (times <= 1) throw err; // no retries left
    return retry(fn, times - 1); // recurse with one less attempt
  }
}

// Option 2 — Loop (explicit, easier to extend)
async function retry(fn, times, delayMs = 0) {
  let lastError;
  for (let i = 0; i < times; i++) {
    try {
      return await fn(); // return immediately if success
    } catch (err) {
      lastError = err;
      // optional delay between retries
      if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastError; // all attempts failed
}

// Usage
const result = await retry(flakyApiCall, 3);
const result2 = await retry(flakyApiCall, 3, 1000); // with 1s delay
```

**When to use which:**

- Recursion → short and elegant, fine for most cases
- Loop → when you need delay between retries, logging, or more control

---

## Cache with TTL (Time To Live)

```javascript
class Cache {
  constructor() {
    // store = { key: { value, expiresAt } }
    this.store = {};
  }

  set(key, value, ttlMs) {
    this.store[key] = {
      value,
      expiresAt: Date.now() + ttlMs, // timestamp when it expires
    };
  }

  get(key) {
    const entry = this.store[key];
    if (!entry) return null; // key doesn't exist
    if (Date.now() > entry.expiresAt) {
      // expired
      delete this.store[key]; // cleanup expired entry
      return null;
    }
    return entry.value;
  }

  delete(key) {
    delete this.store[key]; // for plain objects use delete keyword
    // NOTE: map.delete(key) is for Map — not for plain objects!
  }

  clear() {
    this.store = {}; // reset entire store
  }
}

// Usage
const cache = new Cache();
cache.set("user:1", { name: "Alice" }, 5000); // expires in 5 seconds
cache.get("user:1"); // { name: 'Alice' }
// after 5 seconds:
cache.get("user:1"); // null
```

---

## Flatten nested object (recursion)

```javascript
// Input:  { address: { city: 'Bucharest', coords: { lat: 44.4 } } }
// Output: { 'address.city': 'Bucharest', 'address.coords.lat': 44.4 }

function flattenObject(obj, prefix = "") {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    // build the new key — join with dot if prefix exists
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      // it's an object — recurse deeper with the new prefix
      // Object.assign merges the recursive result into acc
      Object.assign(acc, flattenObject(value, newKey));
    } else {
      // it's a primitive — add it directly
      acc[newKey] = value;
    }

    return acc;
  }, {});
}

// Why typeof value === 'object' && value !== null?
// typeof null === 'object' in JavaScript — it's a known bug
// so we must explicitly check value !== null
```

**When to think about recursion:**

- Nested structures of unknown depth ← this exact case
- Tree traversal
- "Flatten" anything nested

---

## Debounce

```javascript
function debounce(fn, delay) {
  let timer; // lives in closure — persists between calls

  // this is the function you actually call
  return function (...args) {
    // ...args = arguments passed on each call
    clearTimeout(timer); // cancel previous timer (safe even if undefined)
    timer = setTimeout(() => {
      fn(...args); // call original function with the arguments
    }, delay);
  };
}

// Usage
const debouncedSearch = debounce((query) => fetchResults(query), 300);
debouncedSearch("a"); // starts 300ms timer
debouncedSearch("ab"); // resets timer
debouncedSearch("abc"); // resets timer — only this fires after 300ms
```

---

## Group by (reduce pattern)

```javascript
const users = [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Carol", role: "admin" },
];

// ❌ Hardcoded — breaks if new role appears
const grouped = { admin: [], user: [] };
users.forEach((u) => grouped[u.role].push(u.name));

// ✅ Dynamic — works for any role
const grouped = users.reduce((acc, u) => {
  if (!acc[u.role]) acc[u.role] = []; // initialize if not exists
  acc[u.role].push(u.name);
  return acc;
}, {});
// { admin: ['Alice', 'Carol'], user: ['Bob'] }
```

---

# PART 7: QUICK REFERENCE

```javascript
// Check if value is a non-null object
typeof value === "object" && value !== null;

// Optional chaining — stops at first null/undefined
user?.address?.city; // undefined if address or city is null/undefined

// Nullish coalescing — only falls back on null/undefined (not 0 or '')
value ?? "default";

// Difference: ?? vs ||
0 ?? "default"; // 0     (0 is not null/undefined)
0 || "default"; // 'default' (0 is falsy)

// Delete object key
delete obj[key]; // plain objects
map.delete(key); // Map instances

// Merge objects
Object.assign(target, source); // mutates target
const merged = { ...obj1, ...obj2 }; // spread — doesn't mutate

// Falsy values in JavaScript
(false, 0, "", null, undefined, NaN);
// All of these are filtered out by filter(x => x)
```

---

# PART 8: THEORY Q&A

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
increment(); // 2 — count persists even though counter() finished!
```

**Real example:** `debounce` uses closure — `timer` variable
persists between calls inside the returned function.

---

## Event loop in Node.js

A loop that runs continuously, checks the call stack and callback queue.
If the stack is empty and there's a finished callback in the queue,
it pushes it onto the stack.

This makes Node.js **non-blocking** — while waiting for I/O (database,
network), the event loop processes other callbacks.

**Phases:**

1. timers — setTimeout, setInterval
2. I/O callbacks — network, file system
3. poll — retrieve new I/O events
4. check — setImmediate
5. close — cleanup

---

## var vs let vs const

```javascript
// var — function/global scoped, hoisted, can pollute global scope
// let — block scoped, can be reassigned
// const — block scoped, cannot be reassigned (but properties can change)

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

Both disappear at compile time. Key differences:

```typescript
// interface — supports declaration merging
interface User {
  name: string;
}
interface User {
  age: number;
}
// TypeScript merges them: { name, age } ✅

// type — cannot be redeclared
type User = { name: string };
type User = { age: number }; // 💥 Error

// Only type supports unions
type ID = string | number; // ✅
// interface ID = string | number; // 💥 not possible

// Utility types — always use type
type PartialUser = Partial<User>; // ✅
```

**Rule:** `interface` for object shapes and classes. `type` for everything else.

---

## unknown vs any

```typescript
// any — disables TypeScript, dangerous
let a: any = "hello";
a.nonExistent(); // ✅ no error — TypeScript gives up

// unknown — type-safe, forces you to check type first
let u: unknown = "hello";
u.toUpperCase(); // 💥 Error — could be anything
if (typeof u === "string") {
  u.toUpperCase(); // ✅ TypeScript now knows it's a string
}
```

**Use `unknown` for:** error handling (`catch (err: unknown)`),
external API data, user input.
**Never use `any`** unless absolutely necessary.

---

## Promise.all vs allSettled vs race vs any

```javascript
Promise.all([p1, p2, p3]);
// ✅ all succeed → [r1, r2, r3]
// ❌ any fails → throws immediately (fail fast)
// Use when: you need ALL results and any failure should abort

Promise.allSettled([p1, p2, p3]);
// always resolves with all results
// [{ status: 'fulfilled', value }, { status: 'rejected', reason }]
// Use when: you want results regardless of individual failures

Promise.race([p1, p2, p3]);
// resolves/rejects with FIRST to finish (success OR failure)
// Use when: timeout patterns, first-response wins

Promise.any([p1, p2, p3]);
// resolves with FIRST success, ignores failures
// rejects only if ALL fail
// Use when: trying multiple sources, first success wins
```

---

## JWT authentication

JWT (JSON Web Token) encodes non-sensitive data and validates
it server-side to persist sessions without storing state.

**Structure:** `header.payload.signature`

- header: algorithm (base64)
- payload: data like userId (base64) — NOT encrypted, easily decoded!
- signature: HMAC of header+payload with secret key

**Flow:**

```
1. User logs in → server verifies credentials
2. Server signs JWT with secret → sends to client
3. Client stores JWT (localStorage or httpOnly cookie)
4. Every request: Authorization: Bearer <token>
5. Server verifies signature → trusts the payload
```

**Important:** JWT payload is base64 encoded, NOT encrypted.
Never store passwords, credit cards, or sensitive data in JWT.

---

## Microservices — when to use

A separate service that can be deployed, scaled, and maintained
independently. If it fails, it doesn't break the whole system.

**Use microservices when:**

- Large teams — each team owns one service
- Different scaling needs (payment service needs 10x more resources)
- Independent deployment cycles
- Different tech stacks per service

**Don't use when:**

- Small team or early-stage startup (too much overhead)
- Simple application (monolith is easier)
- No DevOps maturity (microservices need Kubernetes, CI/CD, monitoring)

**From my experience at Reconomy:**
Services communicated via SQS queues, allowing the returns processing
service to scale independently from the rest of the system.

---

## REST vs GraphQL

```
REST — multiple endpoints, HTTP methods
GET    /users       → all users
GET    /users/1     → one user
POST   /users       → create
PUT    /users/1     → update
DELETE /users/1     → delete

GraphQL — single endpoint, query what you need
POST /graphql
query { user(id: 1) { name email } } // only fetches name and email
```

|                | REST                    | GraphQL                         |
| -------------- | ----------------------- | ------------------------------- |
| Endpoints      | multiple                | one                             |
| Over-fetching  | yes (gets all fields)   | no (request only what you need) |
| Under-fetching | yes (multiple requests) | no (one request)                |
| Caching        | easy (HTTP cache)       | complex                         |
| Schema changes | easy (add endpoints)    | risk of breaking changes        |
| Learning curve | small                   | larger                          |

**Use REST for:** simple CRUD, public APIs, when HTTP caching matters.
**Use GraphQL for:** complex data, multiple client types, mobile (bandwidth).

---

# PART 9: MY EXPERIENCE — KEY STORIES

## AWS Lambda + Shopify (Reconomy)

Deployed a Shopify app to AWS Lambda for cost, scalability, and fast cold start.
Challenge: Shopify uses esbuild internally, and the bundling output wasn't
compatible with Lambda's Node.js runtime.
Worked with their architect for 2 months to fix the esbuild configuration.
Result: stable production Shopify integration on Lambda.

## SQS Microservices — Returns workflow (Reconomy)

Built SQS-based queue processing for reliable returns workflows at scale.
Designed integration patterns for Shopify and TikTok platform APIs,
enabling plug-and-play connectivity across enterprise systems.

## React Component Library (Cognizant)

Designed and published a React component library where each component
ships as an independent npm package, consumed across multiple applications
to ensure design consistency and reduce duplication.

---

# PART 10: QUESTIONS TO ASK AT INTERVIEW

- What AWS services does the team use specifically?
- How are tasks defined and estimated in the team?
- How does onboarding look for a new contractor?
- What does success look like after 30/60/90 days?
- How realistic is an extension beyond 12 months?
- Who will I work with day to day?
- How is knowledge distributed — is it documented or in people's heads?

---

# PART 11: KEY REMINDERS

## Read requirements TWICE before coding

Identify ALL requirements before writing a single line of code.
30 seconds of reading saves you from missing half the exercise.

## If you don't know something

"I haven't worked with that specifically, but I pick up new
technologies quickly — I've demonstrated that multiple times."

## If you get stuck

Think out loud. Say what you're trying to do even if you don't
know the exact syntax. Interviewers value your thought process.

## Recursion — when to reach for it

- Nested structures of unknown depth
- Tree / graph traversal
- "Flatten" anything nested
- When the problem can be expressed as: solve for N, then solve for N-1

## Common mistakes to avoid

- `sort((a, b) => a > b)` — wrong, use `a - b` or `b - a`
- Forgetting `return` before `await Promise.all(...)`
- `interface X = Partial<T>` — wrong, use `type X = Partial<T>`
- `typeof value === Object` — wrong, use `typeof value === 'object'`
- `this.store.delete(key)` for plain objects — use `delete this.store[key]`
- Not checking `value !== null` when checking `typeof value === 'object'`

```

```
