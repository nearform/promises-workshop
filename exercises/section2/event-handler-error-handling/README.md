# Error Handling EventEmitter Async Handlers

Run the code in `broken.js`:

```
node broken.js
```

As you can see, there's an unhandled rejection. Why? How can the error be
handled? How can we successfully propagate the error?

Try the other examples in order:

```
node still-broken.js
node better.js
node but-still-broken.js
```

What is happening here? Why is the 'error' handler still getting an
unhandled rejection even though it is not using an async function?
How can we fix it to make sure all exceptions can be handled?

