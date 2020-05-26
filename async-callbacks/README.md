## async-callback

This exercize shows the consequences of passing async functions as callback.

When an async function callback is rejected the caller (which does not expect a promise) cannot properly complete its
execution and, therefore, properly dispose all used resources.

The file `before.js` exhibits the wrong practice by using an async function as the callback of the `fs.read` function. 
The async function then calls a fauly remote API that randomly fails. 

As you can see in the logged messages, over time this leaks file descriptor since files are never closed.

The file `after.js` still uses promises, but it uses the `fs.promises` module, which is async-aware. 

Additionally it uses `.finally` to make sure that files are closes and that resources are freed regardless of the API call result.