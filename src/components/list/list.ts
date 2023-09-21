import { CBS_Options } from "../../1-main/2-element.ts";
import CBS from "../../1-main/1-main.ts";
import { CBS_Component } from "../../1-main/3-components.ts";







/**
 * Options for the CBS_List component
 *
 * @typedef {CBS_ListOptions}
 */
export type CBS_ListOptions = CBS_Options & {
    ordered?: boolean;
}


/**
 * <ul> or <ol> element as a component
 *
 * @class CBS_List
 * @typedef {CBS_List}
 * @extends {CBS_Component}
 */
export class CBS_List extends CBS_Component {
    /**
     * Creates an instance of CBS_List
     *
     * @constructor
     * @param {?CBS_ListOptions} [options]
     */
    constructor(options?: CBS_ListOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'list-group'
            ],
            attributes: {
                ...options?.attributes,
                type: 'list'
            }
        };

        if (this.options.ordered) {
            this.el = document.createElement('ol');
        } else {
            this.el = document.createElement('ul');
        }
    }

    /**
     * Sets the options for the CBS_List component
     * Calls the super method and then sets the element to either an <ol> or <ul> element
     *
     * @type {CBS_ListOptions}
     */
    set options(options: CBS_ListOptions) {
        if (this.options.ordered) {
            this._el = document.createElement('ol');
        } else {
            this._el = document.createElement('ul');
        }
        super.options = options;
    }

    get options() {
        return this._options;
    }
    /**
     * Changes element to an <ol> element or <ul> element
     *
     * @type {boolean}
     */
    set ordered(ordered: boolean) {
        this.options = {
            ...this.options,
            ordered
        };
    }

    /**
     * Returns whether the element is an <ol> element or <ul> element
     *
     * @type {boolean}
     */
    get ordered(): boolean {
        return this.options?.ordered || false;
    }
}


CBS.addElement('list', CBS_List);