// Implement a function that deeply flattens a nested object
// All keys should be joined with a dot notation

const input = {
  name: "Alice",
  address: {
    city: "Bucharest",
    country: "Romania",
    coords: {
      lat: 44.4,
      lng: 26.1,
    },
  },
  age: 28,
};

// Expected output:
// {
//   name: 'Alice',
//   'address.city': 'Bucharest',
//   'address.country': 'Romania',
//   'address.coords.lat': 44.4,
//   'address.coords.lng': 26.1,
//   age: 28
// }

function flattenObject(obj, prefix = "") {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key; // construiești cheia

    if (typeof value === "object" && value !== null) {
      // object →  recursive with new prefix
      Object.assign(acc, flattenObject(value, newKey));
    } else {
      // primitive val → add directly
      acc[newKey] = value;
    }

    return acc;
  }, {});
}

console.log(flattenObject(input, "T"));
