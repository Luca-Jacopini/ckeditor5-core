/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global require */

export default function load( modulePath ) {
	modulePath = '../../' + modulePath;

	return new Promise( ( resolve ) => {
		resolve( require( modulePath ) );
	} );
}
