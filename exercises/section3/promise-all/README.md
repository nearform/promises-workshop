## promise-all

This exercize shows the consequences of using `Promise.all` with large of unbound number of promises.

All promises launched in a event loop iteration are run until they perform an operation which is asynchronous. 
Until all promises reach that point, the event loop is blocked and Node can't start processing the results of promises
that might have already settled.

The file `before.js` exhibits the wrong practice by spawning a lot of promises at the same time. 
As you can see in the output, Node first execute all promises until they perform the API call, then it start processing
the results.

When the number of promises is high (or potentially unknown), this can introduce long event loop delays and dramatically 
impact performances.

Using Promise.all is fine when the number of promises is known and small. Otherwise there must be some concurrency control
to limit the maximum amount of spawn promises at the same time.

The file `after.js` uses the `p-map` module, which has concurrency control. As you can see in the output, Node now 
starts processing results before all promises have been spawned.
