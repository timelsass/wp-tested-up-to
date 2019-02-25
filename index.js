const fs = require( 'fs' ).promises,
	got = require( 'got' ),
	header = require( 'wp-header-search' ),
	headerUpdate = require( 'wp-header-update' ),
	semver = require( 'semver' ),
	pkgDir = require( 'pkg-dir' ),
	path = require( 'path' );

const wporg = 'https://api.wordpress.org/core/version-check/1.7/';

/**
 * Get latest WordPress release's version.
 */
const latestWpVersion = async () => {
	return await got( wporg, { timeout: 300 } )
		.then( res => JSON.parse( res.body ).offers[0].version )
		.catch( console.error );
}

/**
 * Get Tested Up To: $version from file.
 *
 * @param {String} file The file to get tested up to version from.
 */
const testedUpToVersion = async ( file ) => {
	return await header( 'Tested Up To', file );
}

/**
 * Check if current tested up to range in file covers current WP release.
 *
 * @param {String} file The file to check against latest WP release.
 */
const isValid = async ( file ) => {
	try {
		const wp = await latestWpVersion(),
			plugin = await testedUpToVersion( file ),
			wpVersion = semver.coerce( wp ),
			pluginVersion = semver.coerce( plugin );

		let diff;

		if ( ! semver.valid( wpVersion ) || ! semver.valid( pluginVersion ) ) {
			return false;
		}

		if ( semver.lt( pluginVersion, wpVersion ) ) {
			diff = semver.diff( wpVersion, pluginVersion );
		}

		// In WP version comparison, the patch version is ignored, so a
		// Tested Up To: 5.1.1 is considered passing in a WP 5.1.12 release.
		return ! diff || 'patch' === diff;

	} catch ( err ) {
		console.log( err );
	}
}

/**
 * Update file with new Tested Up To: $version.
 *
 * A soft check of isValid is performed to skip updating the file
 * in a build process.  You can force a build to always update by
 * passing true to the force parameter.
 *
 * @param {string} file The file to update tested up to version in file.
 * @param {bool} force (Optional) Force update the tested up to version in file.
 */
const update = async ( file, force ) => {
	if ( true === file || false === file ) {
		force = file;
		file = null;
	}

	file = file || await pkgDir( __dirname ) + path.sep + 'readme.txt';

	if ( force || ! await isValid( file ) ) {
		const wpVersion = await latestWpVersion();
		await headerUpdate( 'Tested Up To', wpVersion, file );
	}
}

module.exports = {
	latestWpVersion: latestWpVersion,
	testedUpToVersion: testedUpToVersion,
	isValid: isValid,
	update: update
}
