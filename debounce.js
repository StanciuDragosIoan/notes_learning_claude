function debounce(fn, delay) {
  let timer;

  // This is the function you actually call (e.g. debouncedLog('hello'))
  return function (...args) {
    // args = ['hello']
    clearTimeout(timer); // cancel previous timer if exists
    timer = setTimeout(() => {
      fn(...args); // call original function with your arguments
    }, delay);
  };
}

// Step 1 — debounce returns a new function
const debouncedLog = debounce((msg) => console.log(msg), 300);

// Step 2 — you call the returned function with your args
debouncedLog("hello"); // starts 300ms timer, args = ['hello']
debouncedLog("hello"); // resets timer
debouncedLog("hello"); // resets timer — only this fires after 300ms
