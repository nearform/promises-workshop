const js = require('@eslint/js')
const globals = require('globals')
const babelParser = require('@babel/eslint-parser')

// Flat-config port of the previous .eslintrc.
// Scoped to .js only, matching what `eslint .` linted under eslint 8 (its default
// extension list); the exercise .mjs files were never in scope.
module.exports = [
  {
    files: ['**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 2021,
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.worker,
        SharedArrayBuffer: 'readonly',
        Atomics: 'readonly',
        // Intentionally declared: the workshop demonstrates calling something
        // that does not exist.
        functionThatDoesNotExist: 'readonly'
      }
    }
  }
]
