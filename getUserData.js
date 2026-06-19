// You have a list of users with nested address data
// Some fields might be missing (null/undefined)

const users = [
  { id: 1, name: "Alice", address: { city: "Bucharest", country: "Romania" } },
  { id: 2, name: "Bob", address: null },
  { id: 3, name: "Carol", address: { city: "Cluj", country: "Romania" } },
  { id: 4, name: "Dan", address: { city: null, country: "Germany" } },
  { id: 5, name: "Eve" }, // no address key at all
];

// Implement getUserCities(users) that:
// 1. Returns only users that have a valid city
// 2. Returns array of strings in format "Name — City"
// 3. Must not throw on missing/null data

// Expected:
// ['Alice — Bucharest', 'Carol — Cluj']

function getUserCities(users) {
  // your code here
  return users
    .map((u) => {
      if (!u.address) {
        return;
      } else {
        if (!u.address.city) {
          return;
        }
        return `${u.name} - ${u.address.city}`;
      }
    })
    .filter((i) => i !== undefined);
}

function getUserCities2(users) {
  return users
    .filter((u) => u.address?.city)
    .map((u) => `${u.name} — ${u.address.city}`);
}

console.log(getUserCities(users));
