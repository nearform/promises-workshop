# Event loop ordering

Run `first.js` then create an hypothesis of the priority
of various ways to defer to the "future".

Run `second.js`. What can you say about your hypothesis?

Run `first.mjs`. What has changed? Can you explain it further?

## Hint

Take a look at https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/

## Bonus

Create a copy of `first.js` and rename it to `first.mjs` to convert it
into an ES6 Module. Will it produce the same results as `first.js`?
If not, why not?
