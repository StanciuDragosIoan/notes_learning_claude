const nums = [1, 2, 3, 4, 5];
const users = [
  { id: 1, name: "Alice", role: "admin", age: 28 },
  { id: 2, name: "Bob", role: "user", age: 17 },
  { id: 3, name: "Carol", role: "admin", age: 34 },
];

// 1. Sum of numbers
const sum = nums.reduce((acc, n) => acc + n, 0);
// 15

// 2. Sum of object property
const totalAge = users.reduce((acc, u) => acc + u.age, 0);
// 79

// 3. Array to object (key = id, value = name)
const byId = users.reduce((acc, u) => {
  acc[u.id] = u.name;
  return acc;
}, {});
// { 1: 'Alice', 2: 'Bob', 3: 'Carol' }

// 4. Group by property ⭐ (apare des la interviuri)
const grouped = users.reduce((acc, u) => {
  if (!acc[u.role]) acc[u.role] = [];
  acc[u.role].push(u.name);
  return acc;
}, {});
// { admin: ['Alice', 'Carol'], user: ['Bob'] }

// 5. Flatten array of arrays
const nested = [[1, 2], [3, 4], [5]];
const flat = nested.reduce((acc, arr) => [...acc, ...arr], []);
// [1, 2, 3, 4, 5]

// 6. Count occurrences
const roles = ["admin", "user", "admin", "moderator", "user", "admin"];
const count = roles.reduce((acc, role) => {
  acc[role] = (acc[role] || 0) + 1;
  return acc;
}, {});
// { admin: 3, user: 2, moderator: 1 }

// 7. Max value
const max = nums.reduce((acc, n) => (n > acc ? n : acc), -Infinity);
// 5

// 8. Remove duplicates
const dupes = [1, 2, 2, 3, 3, 4];
const unique = dupes.reduce((acc, n) => {
  if (!acc.includes(n)) acc.push(n);
  return acc;
}, []);
// [1, 2, 3, 4]
// (sau mai simplu: [...new Set(dupes)])
