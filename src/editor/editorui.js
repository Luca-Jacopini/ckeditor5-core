/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module core/editor/editorui
 */

import ComponentFactory from '@ckeditor/ckeditor5-ui/src/componentfactory';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';

import EmitterMixin from '@ckeditor/ckeditor5-utils/src/emittermixin';
import mix from '@ckeditor/ckeditor5-utils/src/mix';

/**
 * A class providing the minimal interface that is required to successfully bootstrap any editor UI.
 *
 * @mixes module:utils/emittermixin~EmitterMixin
 */
export default class EditorUI {
	/**
	 * Creates an instance of the editor UI class.
	 *
	 * @param {module:core/editor/editor~Editor} editor The editor instance.
	 */
	constructor( editor ) {
		/**
		 * The editor that the UI belongs to.
		 *
		 * @readonly
		 * @member {module:core/editor/editor~Editor} #editor
		 */
		this.editor = editor;

		/**
		 * An instance of the {@link module:ui/componentfactory~ComponentFactory}, a registry used by plugins
		 * to register factories of specific UI components.
		 *
		 * @readonly
		 * @member {module:ui/componentfactory~ComponentFactory} #componentFactory
		 */
		this.componentFactory = new ComponentFactory( editor );

		/**
		 * Stores the information about the editor UI focus and propagates it so various plugins and components
		 * are unified as a focus group.
		 *
		 * @readonly
		 * @member {module:utils/focustracker~FocusTracker} #focusTracker
		 */
		this.focusTracker = new FocusTracker();

		/**
		 * Stores all editable elements used by the editor instance.
		 *
		 * @protected
		 * @member {Map.<String,HTMLElement>}
		 */
		this._editableElements = new Map();

		// Informs UI components that should be refreshed after layout change.
		this.listenTo( editor.editing.view.document, 'layoutChanged', () => this.update() );
	}

	/**
	 * The main (outermost) DOM element of the editor UI.
	 *
	 * For example, in {@link module:editor-classic/classiceditor~ClassicEditor} it is a `<div>` which
	 * wraps the editable element and the toolbar. In {@link module:editor-inline/inlineeditor~InlineEditor}
	 * it is the editable element itself (as there is no other wrapper). However, in
	 * {@link module:editor-decoupled/decouplededitor~DecoupledEditor} it is set to `null` because this editor does not
	 * come with a single "main" HTML element (its editable element and toolbar are separate).
	 *
	 * This property can be understood as a shorthand for retrieving the element that a specific editor integration
	 * considers to be its main DOM element.
	 *
	 * @readonly
	 * @member {HTMLElement|null} #element
	 */
	get element() {
		return null;
	}

	/**
	 * Fires the {@link module:core/editor/editorui~EditorUI#event:update `update`} event.
	 *
	 * This method should be called when the editor UI (e.g. positions of its balloons) needs to be updated due to
	 * some environmental change which CKEditor 5 is not aware of (e.g. resize of a container in which it is used).
	 */
	update() {
		this.fire( 'update' );
	}

	/**
	 * Destroys the UI.
	 */
	destroy() {
		this.stopListening();

		this.focusTracker.destroy();

		this._editableElements = new Map();
	}

	/**
	 * Returns the editable editor element with the given name or null if editable does not exist.
	 *
	 * @param {String} [rootName=main] The editable name.
	 * @returns {HTMLElement|undefined}
	 */
	getEditableElement( rootName = 'main' ) {
		return this._editableElements.get( rootName );
	}

	/**
	 * Returns array of names of all editor editable elements.
	 *
	 * @returns {Iterable.<String>}
	 */
	getEditableElementsNames() {
		return this._editableElements.keys();
	}

	/**
	 * Fired when the editor UI is ready.
	 *
	 * Fired before {@link module:engine/controller/datacontroller~DataController#event:ready}.
	 *
	 * @event ready
	 */

	/**
	 * Fired whenever the UI (all related components) should be refreshed.
	 *
	 * **Note:**: The event is fired after each {@link module:engine/view/document~Document#event:layoutChanged}.
	 * It can also be fired manually via the {@link module:core/editor/editorui~EditorUI#update} method.
	 *
	 * @event update
	 */
}

mix( EditorUI, EmitterMixin );
