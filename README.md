# wp-tested-up-to
Ensure that your plugin header files don't fall behind the latest WordPress release in the Tested Up To: section!

## Install

Install with yarn:

```
$ yarn add wp-header-search --dev
```

OR

Install with npm:

```
$ npm install wp-header-search --save-dev
```

## Usage

```js
const testedUpTo = require( 'wp-tested-up-to' );

( async () => {
	await testedUpTo.update();
} )();
```

Without passing params to update, the module will check to see if the header version is within a valid range of the current WordPress.org release version.  If it isn't, it will update the file with the current WordPress release version.

In some cases, you may wish to force this write to happen all the time to enforce the most current release version to be updated in the file.  Simply pass `true` to the update method to do so:

```js
const testedUpTo = require( 'wp-tested-up-to' );

( async () => {
	await testedUpTo.update( true );
} )();
```

Internally this module attempts to find the package directory it's being run from, and then looks for the readme.txt file.  Sometimes a different file needs to be updated ( README.md for example ), so you can optionally pass a string containing `path/to/file.ext`:

```js
const testedUpTo = require( 'wp-tested-up-to' );

( async () => {
	await testedUpTo.update( 'README.md' );
} )();
```

You may wish to still force the write of your own specified file, which can be passed as a second param in those instances:

```js
const testedUpTo = require( 'wp-tested-up-to' );

( async () => {
	await testedUpTo.update( 'README.md', true );
} )();
```
