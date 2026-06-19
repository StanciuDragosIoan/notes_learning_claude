// You have a list of API endpoints that need to be called
// Some might fail, some might succeed
// You need to call ALL of them in parallel and collect results

// Implement fetchAll(urls) that:
// 1. Calls all URLs in parallel
// 2. Returns an array of results:
//    - If successful: { status: 'success', data: result }
//    - If failed:     { status: 'error', error: error.message }
// 3. NEVER throws — always returns results for all URLs

const fetchUrl = async (url) => {
  // simulates fetch — fails for 'bad' urls
  if (url.includes("bad")) throw new Error(`Failed to fetch ${url}`);
  return { content: `Data from ${url}` };
};

const urls = [
  "https://api.example.com/good1",
  "https://api.example.com/bad1",
  "https://api.example.com/good2",
  "https://api.example.com/bad2",
];

// Expected output:
// [
//   { status: 'success', data: { content: 'Data from ...good1' } },
//   { status: 'error', error: 'Failed to fetch ...bad1' },
//   { status: 'success', data: { content: 'Data from ...good2' } },
//   { status: 'error', error: 'Failed to fetch ...bad2' },
// ]

async function fetchAll(urls) {
  const results = await Promise.allSettled(urls.map((url) => fetchUrl(url)));

  return results.map((result) => {
    if (result.status === "fulfilled") {
      return { status: "success", data: result.value };
    } else {
      return { status: "error", error: result.reason.message };
    }
  });
}

/*
    Promise.all throws if anything fails
    Promise.allSettled does not throw it returns the result
    fulfilled -> result.value
    rejected -> result.reason

*/
