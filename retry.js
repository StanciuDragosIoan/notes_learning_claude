// ============================================
// RETRY FUNCTION — Two Implementations
// ============================================

// The problem: when calling an external API that might fail,
// you want to retry a certain number of times before giving up.
// Key insight: fn throws an error on failure — not a status code.

// ---- Simulate an API that fails twice then succeeds ----
let attempts = 0;
const flakyApi = async () => {
  attempts++;
  console.log(`Attempt ${attempts}...`);
  if (attempts < 3) throw new Error(`API failed on attempt ${attempts}`);
  return { data: "success!" };
};

// ============================================
// OPTION 1 — Recursion (shorter, elegant)
// ============================================
async function retryRecursive(fn, times) {
  try {
    return await fn(); // attempt — return immediately if success
  } catch (err) {
    if (times <= 1) throw err; // no retries left — throw last error
    return retryRecursive(fn, times - 1); // recurse with one less attempt
  }
}

// ============================================
// OPTION 2 — Loop (explicit, safe)
// ============================================
async function retryLoop(fn, times) {
  let lastError;

  for (let i = 0; i < times; i++) {
    try {
      return await fn(); // attempt — return immediately if success
    } catch (err) {
      lastError = err; // save error, continue to next iteration
      console.log(`Failed: ${err.message} — retrying...`);
    }
  }

  throw lastError; // all attempts failed — throw last error
}

// ============================================
// BONUS — Loop with delay between retries
// ============================================
async function retryWithDelay(fn, times, delayMs = 0) {
  let lastError;

  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.log(
        `Failed: ${err.message} — waiting ${delayMs}ms before retry...`,
      );
      if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  throw lastError;
}

// ============================================
// RUN IT
// ============================================
const main = async () => {
  console.log("--- Testing retryLoop ---");
  try {
    attempts = 0; // reset
    const result = await retryLoop(flakyApi, 3);
    console.log("Result:", result); // { data: 'success!' }
  } catch (err) {
    console.error("All retries failed:", err.message);
  }

  console.log("\n--- Testing retryRecursive ---");
  try {
    attempts = 0; // reset
    const result = await retryRecursive(flakyApi, 3);
    console.log("Result:", result); // { data: 'success!' }
  } catch (err) {
    console.error("All retries failed:", err.message);
  }

  console.log("\n--- Testing when all retries fail ---");
  try {
    attempts = 0; // reset
    const result = await retryLoop(flakyApi, 2); // only 2 attempts, needs 3
    console.log("Result:", result);
  } catch (err) {
    console.error("All retries failed:", err.message); // API failed on attempt 2
  }
};

main();
