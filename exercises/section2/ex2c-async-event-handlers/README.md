## async-event-handlers

This exercize shows the consequences of passing async functions as event handlers.

When an async function event handler is rejected the caller (which does not expect a promise) cannot properly complete its
execution and, therefore, properly dispose all used resources.

The file `before.js` exhibits the wrong practice by using an async function as the handler of the `data` event. 
The async function then calls a fauly remote API that randomly fails. 

As you can see in the logged messages, over time this leaks file descriptor since files are never closed. 
The `.resume()` function is never closed and therefore no `end` event are ever emitted.

The file `after.js` still uses promises, but the event handler is now a regular function. 

Internally it still uses promises, but it adds `.finally` to make sure that the stream is resumed and that resources are freed regardless of the API call result.
