# Error Handling

Run the code in `broken.js`:

```
node broken.js
node broken.js README.md
node broken.js foobar
```

As you can see the latter causes an `'unhandledRejection'`.Why? Formulate a rule to avoid catching this behavior.

## Bonus step

Each stream is async iterable, e.g. `for await (const chunk of stream)` is possible. Rewrite the example to use async/await and async iteration.
