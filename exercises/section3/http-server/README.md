# A Simple HTTP Server

The file `hello_world.js` implements the deno-style simple HTTP
server using an async iterator. Do a simple benchmark on it
using autocannon.

In one terminal window, launch the `hello_world.js` server:

```
$ node hello_world
```

In a separate terminal, run autocannon:

```
$ autocannon localhost:8000
```

What are the requests per second? Is this a good number? Would
you consider this to be a fast server?

What if we want our server to do more than just say hello? In
`before.js`, our server calculates the hash of it's own source
file and simulates an asynchronous task that takes a full second
to complete. Before running the code, what is your hypothesis
about the requests per second? Will it be fast? What issues do
you foresee?

Then run the code

```
$ node before
```

```
$ autocannon localhost:8000
```

Do the results make sense? Was your hypothesis correct?

How many *concurrent* requests is the server able to handle?

What improvements can be made?
