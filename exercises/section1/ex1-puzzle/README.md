# Exercise 1: Understanding Async in Node.js

The file `puzzle.js` prints a message to the console using
Node.js' various ways of scheduling asynchronous code. These
include mechanisms such as Promises, timers, nextTicks,
immediates, worker threads, and so forth.

Your task in this exercise is to determine what message the
code prints to the console *without running the code*.

You will have 30 minutes to complete the exercise.

The goal of this exercise is to practice reasoning about how
Node.js schedules asynchronous code to run including how the
various scheduling mechanisms either work with or interfere
with the Node.js event loop.

## Questions

1. What is the relationship between the Node.js event loop and...
   * Promises and async functions
   * `process.nextTick()`
   * Timers (`setTimeout()`, `setInterval()`)
   * Immediates (`setImmediate()`)
   * Worker threads
   * `queueMicrotask()`

2. Which of the above scheduling mechanisms block the Node.js
   event loop?

3. Is there anything in the puzzle that completely surprised you?
