const obj = { alice: 60, bob: 20, carol: 1000 };

// 1. Just keys
for (const key in obj) {
  console.log(key); // 'alice', 'bob', 'carol'
}
Object.keys(obj).forEach((key) => console.log(key));

// 2. Just values
Object.values(obj).forEach((value) => console.log(value)); // 60, 20, 1000

// 3. Keys AND values
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value); // 'alice' 60, 'bob' 20, ...
}
Object.entries(obj).forEach(([key, value]) => console.log(key, value));

// 4. Transform object to array
const arr = Object.entries(obj).map(([name, sum]) => ({ name, sum }));
// [{ name: 'alice', sum: 60 }, ...]

// 5. Transform array to object
const people = [
  { name: "alice", sum: 60 },
  { name: "bob", sum: 20 },
];
const result = people.reduce((acc, { name, sum }) => {
  acc[name] = sum;
  return acc;
}, {});
// { alice: 60, bob: 20 }

// 6. Filter object keys
const filtered = Object.fromEntries(
  Object.entries(obj).filter(([key, value]) => value > 30),
);
// { alice: 60, carol: 1000 }
