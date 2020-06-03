# Exercise 2: Converting callback code to Promises

The file `before.js` implements an http server that returns
a hierarchical listing of files in the promises-workshop
directory. It uses the async version of the Node.js `opendir`
API to incrementally walk the nested list of files and
folders. If a directory entry is a regular file, the sha256
hash of the file contents is calculated and included in the
output.

Your task in this exercise is to convert the complete test
to a version that uses Promises to generate an identical
list.

You will have 30 minutes to complete the exercise.
