# AVIV Interview Prep — Complete Guide

---

# PART 1: CODING PATTERNS

## Array Methods

```javascript
const products = [
  { id: 1, name: "Laptop", price: 1200, inStock: true },
  { id: 2, name: "Phone", price: 800, inStock: false },
  { id: 3, name: "Tablet", price: 400, inStock: true },
];

// Filter + sort + map chain
const result = products
  .filter((p) => p.inStock)
  .sort((a, b) => b.price - a.price) // descending: b - a
  .map((p) => p.name);

// findIndex — takes callback like find
const index = products.findIndex((p) => p.name === "Tablet");

// reduce — sum
const total = products.reduce((acc, p) => acc + p.price, 0);

// reduce — group by
const grouped = products.reduce((acc, p) => {
  if (!acc[p.inStock]) acc[p.inStock] = [];
  acc[p.inStock].push(p.name);
  return acc;
}, {});

// reduce — array to object
const byId = products.reduce((acc, p) => {
  acc[p.id] = p.name;
  return acc;
}, {});
```

**Key rules:**

- Sort descending: `(a, b) => b.prop - a.prop`
- Sort ascending: `(a, b) => a.prop - b.prop`
- `find` returns element, `findIndex` returns index — both take callbacks
- `reduce` initial value: `0` for numbers, `{}` for objects, `[]` for arrays

---

## Object Iteration

```javascript
const obj = { alice: 60, bob: 20, carol: 1000 };

// Just keys
for (const key in obj) {
  console.log(key);
}
Object.keys(obj).forEach((key) => console.log(key));

// Just values
Object.values(obj).forEach((value) => console.log(value));

// Keys AND values
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}

// Transform object to array
const arr = Object.entries(obj).map(([name, sum]) => ({ name, sum }));

// Transform array to object
const people = [{ name: "alice", sum: 60 }];
const result = people.reduce((acc, { name, sum }) => {
  acc[name] = sum;
  return acc;
}, {});

// Filter object keys
const filtered = Object.fromEntries(
  Object.entries(obj).filter(([key, value]) => value > 30),
);
```

---

## Async / Await + Promises

```javascript
// Basic async/await with error handling
async function getUserWithOrders(userId: number) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(userId);
    return { user, orders };
  } catch (err) {
    if (err instanceof Error) throw err;
    else throw new Error(`${err}`);
  }
}

// Promise.all — parallel, throws if any fails
async function getAllUsers(ids: number[]) {
  try {
    return await Promise.all(
      ids.map(async (id) => {
        const user = await getUser(id);
        const orders = await getOrders(id);
        return { user, orders };
      })
    );
  } catch (err) {
    if (err instanceof Error) throw err;
    else throw new Error(`${err}`);
  }
}

// Promise.allSettled — parallel, never throws
async function fetchAll(urls: string[]) {
  const results = await Promise.allSettled(
    urls.map(url => fetchUrl(url))
  );
  return results.map(result => {
    if (result.status === 'fulfilled') {
      return { status: 'success', data: result.value };
    } else {
      return { status: 'error', error: result.reason.message };
    }
  });
}
```

**Key rules:**

- `Promise.all` — throws if ANY fails
- `Promise.allSettled` — NEVER throws, returns all results
- `Promise.race` — returns/throws FIRST to finish
- `Promise.any` — returns FIRST success
- Don't forget `return` before `await Promise.all`!

---

## TypeScript — Generics

```typescript
// Basic generic function
function getFirstOrDefault<T>(arr: T[], defaultValue: T): T {
  return arr[0] ?? defaultValue;
}

// Generic with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

**Key rules:**

- Declare `<T>` after function name: `function fn<T>`
- Use `T` as type for params and return
- Don't make it `async` if no `await` inside

---

## TypeScript — Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  role: "admin" | "user";
}

// Partial — all fields optional
type UpdateUser = Partial<User>;

// Pick — select specific fields
type PublicUser = Pick<User, "id" | "name" | "role">;

// Omit — remove specific fields
type PrivateUser = Omit<User, "password">;

// Record — object with typed key/value
type UserMap = Record<string, User>;
```

**Key rule:** Use `type`, not `interface`, for utility types!

---

## Common Patterns

### Retry

```javascript
// Option 1 — Recursion
async function retry(fn, times) {
  try {
    return await fn();
  } catch (err) {
    if (times <= 1) throw err;
    return retry(fn, times - 1);
  }
}

// Option 2 — Loop (easier to extend with delay)
async function retry(fn, times, delayMs = 0) {
  let lastError;
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastError;
}
```

### Cache with TTL

```javascript
class Cache {
  constructor() {
    this.store = {}; // { key: { value, expiresAt } }
  }

  set(key, value, ttlMs) {
    this.store[key] = {
      value,
      expiresAt: Date.now() + ttlMs,
    };
  }

  get(key) {
    const entry = this.store[key];
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      delete this.store[key];
      return null;
    }
    return entry.value;
  }

  delete(key) {
    delete this.store[key]; // not .delete()! that's for Map
  }

  clear() {
    this.store = {};
  }
}
```

### Flatten Object (recursion)

```javascript
function flattenObject(obj, prefix = "") {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      Object.assign(acc, flattenObject(value, newKey));
    } else {
      acc[newKey] = value;
    }
    return acc;
  }, {});
}
```

### Debounce

```javascript
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
```

### Group By

```javascript
const grouped = users.reduce((acc, u) => {
  if (!acc[u.role]) acc[u.role] = [];
  acc[u.role].push(u.name);
  return acc;
}, {});
```

---

## Quick Reference

```javascript
// Check if object
typeof value === "object" && value !== null;

// Optional chaining
user?.address?.city; // undefined if any step is null/undefined

// Nullish coalescing
value ?? "default"; // 'default' only if null/undefined (not 0 or '')

// Delete object key
delete obj[key]; // for plain objects
map.delete(key); // for Map

// Object.assign — merge objects
Object.assign(target, source); // mutates target
const merged = { ...obj1, ...obj2 }; // spread alternative
```

---

# PART 2: THEORY Q&A

---

## Q1: What's the difference between `==` and `===`?

`==` checks value equality with type coercion, `===` checks value AND type.

```javascript
"5" == 5; // true  — coerces type
"5" === 5; // false — different types
```

**Always use `===` in production code.**

---

## Q2: What is a closure?

A closure is when a function has access to variables from its outer
scope, even after that outer scope has finished executing.

```javascript
function counter() {
  let count = 0;
  return () => count++;
}
const increment = counter();
increment(); // 1
increment(); // 2 — count persists!
```

**Real example from my experience:**
The `debounce` function uses closure — `timer` persists between calls
inside the returned function.

---

## Q3: What is the event loop in Node.js?

A loop that runs continuously, checks the call stack and callback queue.
If the stack is empty and there's a finished callback in the queue,
it pushes it onto the stack to be executed.

This is what makes Node.js non-blocking — while waiting for I/O,
the event loop can process other callbacks.

**Phases (if asked in depth):**

1. timers — setTimeout, setInterval
2. I/O callbacks — majority of callbacks
3. poll — retrieve new I/O events
4. check — setImmediate
5. close — close events

---

## Q4: What's the difference between `var`, `let`, and `const`?

- `var` — ES5, function/global scoped, pollutes global scope, hoisted
- `let` — block scoped, can be reassigned
- `const` — block scoped, cannot be reassigned (but object properties can)

```javascript
if (true) {
  let x = 1; // block scoped
  var y = 2; // escapes the block
}
console.log(x); // ReferenceError ✅
console.log(y); // 2 ❌ leaked out

const obj = {};
obj.name = "Alice"; // ✅ properties can change
obj = {}; // 💥 reassignment not allowed
```

---

## Q5: What's the difference between `interface` and `type` in TypeScript?

Both disappear at compile time. Key differences:

```typescript
// interface — supports declaration merging
interface User {
  name: string;
}
interface User {
  age: number;
}
// result: { name, age } ✅

// type — cannot be redeclared
type User = { name: string };
type User = { age: number }; // 💥 Error

// type — supports unions
type ID = string | number; // ✅

// type — better for utility types
type PartialUser = Partial<User>; // ✅
```

**Rule of thumb:**

- `interface` → object shapes, classes, declaration merging
- `type` → utility types, unions, everything else

---

## Q6: What is `unknown` vs `any`?

- `any` — disables TypeScript completely, dangerous
- `unknown` — type-safe, forces you to check type before using

```typescript
let a: any = "hello";
a.nonExistent(); // ✅ no error — dangerous!

let u: unknown = "hello";
u.toUpperCase(); // 💥 Error
if (typeof u === "string") {
  u.toUpperCase(); // ✅
}
```

**When to use `unknown`:**

- Error handling: `catch (err: unknown)`
- Data from external APIs
- User input

---

## Q7: Promise.all vs Promise.allSettled vs Promise.race vs Promise.any

```javascript
// Promise.all — throws if ANY fails
Promise.all([p1, p2, p3]);
// ✅ all succeed → [result1, result2, result3]
// ❌ any fails → throws immediately

// Promise.allSettled — NEVER throws
Promise.allSettled([p1, p2, p3]);
// → [{ status: 'fulfilled', value: ... }, { status: 'rejected', reason: ... }]

// Promise.race — first to finish wins (success OR failure)
Promise.race([p1, p2, p3]);

// Promise.any — first SUCCESS wins, ignores failures
// throws only if ALL fail
Promise.any([p1, p2, p3]);
```

**Real example from my experience:**
At Reconomy we used Promise.all for parallel API calls.
Promise.allSettled is better when you want results regardless
of individual failures — used it in fetchAll implementation.

---

## Q8: What is JWT and how does authentication work?

JWT (JSON Web Token) encodes non-sensitive data and validates
it on the server to persist sessions.

**Structure:**
