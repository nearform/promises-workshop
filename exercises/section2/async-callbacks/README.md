## async-callback

This exercize shows the consequences of passing async functions
as callback when they are not expected.

When an async function callback is rejected the caller (which does
not expect a promise) cannot properly complete its execution and,
therefore, cannot properly dispose all used resources.

The file `before.js` exhibits the wrong practice by using an async
function as the callback of the `fs.read` function. The async function
then calls a faulty API that randomly fails about half of the time.

As you can see in the logged messages, over time this leaks file
descriptors since files are never closed and rejections are never
handled.

Broken:
```
node test before
```

Your task in this exercise is to identify and implement a corrected
version of this application such that running `node test after`
(where `after` is your revised version) passes the test.
