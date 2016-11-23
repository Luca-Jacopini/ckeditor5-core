/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals document */
/* bender-tags: editor, browser-only */

import StandardEditor from 'ckeditor5/core/editor/standardeditor.js';
import HtmlDataProcessor from 'ckeditor5/engine/dataprocessor/htmldataprocessor.js';
import { getData, setData } from 'ckeditor5/engine/dev-utils/model.js';

import EditingController from 'ckeditor5/engine/controller/editingcontroller.js';
import KeystrokeHandler from 'ckeditor5/core/keystrokehandler.js';
import Plugin from 'ckeditor5/core/plugin.js';

describe( 'StandardEditor', () => {
	let editorElement;

	beforeEach( () => {
		editorElement = document.createElement( 'div' );
		document.body.appendChild( editorElement );
	} );

	describe( 'constructor()', () => {
		it( 'sets all properties', () => {
			const editor = new StandardEditor( editorElement, { foo: 1 } );

			expect( editor ).to.have.property( 'element', editorElement );
			expect( editor.editing ).to.be.instanceof( EditingController );
			expect( editor.keystrokes ).to.be.instanceof( KeystrokeHandler );
		} );

		it( 'sets config', () => {
			const editor = new StandardEditor( editorElement, { foo: 1 } );

			expect( editor.config.get( 'foo' ) ).to.equal( 1 );
		} );
	} );

	describe( 'create', () => {
		it( 'initializes editor with plugins and config', () => {
			class PluginFoo extends Plugin {}

			return StandardEditor.create( editorElement, {
					foo: 1,
					plugins: [ PluginFoo ]
				} )
				.then( editor => {
					expect( editor ).to.be.instanceof( StandardEditor );

					expect( editor.config.get( 'foo' ) ).to.equal( 1 );
					expect( editor ).to.have.property( 'element', editorElement );

					expect( editor.plugins.get( PluginFoo ) ).to.be.instanceof( PluginFoo );
				} );
		} );
	} );

	describe( 'setData', () => {
		let editor;

		beforeEach( () => {
			return StandardEditor.create( editorElement )
				.then( newEditor => {
					editor = newEditor;

					editor.data.processor = new HtmlDataProcessor();

					editor.document.schema.allow( { name: '$text', inside: '$root' } );
				} );
		} );

		it( 'should set data of the first root', () => {
			editor.document.createRoot();
			editor.document.createRoot( '$root', 'secondRoot' );

			editor.editing.createRoot( 'div' );
			editor.editing.createRoot( 'div', 'secondRoot' );

			editor.setData( 'foo' );

			expect( getData( editor.document, { rootName: 'main', withoutSelection: true } ) ).to.equal( 'foo' );
		} );
	} );

	describe( 'getData', () => {
		let editor;

		beforeEach( () => {
			return StandardEditor.create( editorElement )
				.then( newEditor => {
					editor = newEditor;

					editor.data.processor = new HtmlDataProcessor();

					editor.document.schema.allow( { name: '$text', inside: '$root' } );
				} );
		} );

		it( 'should get data of the first root', () => {
			editor.document.createRoot();
			editor.document.createRoot( '$root', 'secondRoot' );

			editor.editing.createRoot( 'div' );
			editor.editing.createRoot( 'div', 'secondRoot' );

			setData( editor.document, 'foo' );

			expect( editor.getData() ).to.equal( 'foo' );
		} );
	} );

	describe( 'updateEditorElement', () => {
		it( 'sets data to editor element', () => {
			const editor = new StandardEditor( editorElement );

			editor.data.get = () => '<p>foo</p>';

			editor.updateEditorElement();

			expect( editorElement.innerHTML ).to.equal( '<p>foo</p>' );
		} );
	} );

	describe( 'loadDataFromEditorElement', () => {
		it( 'sets data to editor element', () => {
			const editor = new StandardEditor( editorElement );

			sinon.stub( editor.data, 'set' );
			editorElement.innerHTML = '<p>foo</p>';

			editor.loadDataFromEditorElement();

			expect( editor.data.set.calledWithExactly( '<p>foo</p>' ) ).to.be.true;
		} );
	} );
} );
