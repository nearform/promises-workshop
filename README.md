# Broken Promises Exercizes

This workshops shows some of the quirks illustrated by James Snell in his [Broken Promises](https://www.youtube.com/watch?v=XV-u_Ow47s0) talk.

In order to run the exercizes, you need to have [Node](https://nodejs.org) installed.

## Running tests

To run the test against one of the exercize, run:

```sh
tap --no-coverage -R spec --test-arg=$YOURFILE $EXERCISE/test.js
```

where:

* `YOURFILE` is the file you want to test. For instance `promise-all/before.js`
* `EXERCISE` is the exercise you want to run. For instance `promise-all`
