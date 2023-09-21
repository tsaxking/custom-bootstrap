import { CBS_Element, CBS_Options } from "../../1-main/2-element.ts";
import CBS from "../../1-main/1-main.ts";


/**
 * Description placeholder
 *
 * @class CBS_FormText
 * @typedef {CBS_FormText}
 * @extends {CBS_Element}
 */
export class CBS_FormText extends CBS_Element {
    /**
     * Creates an instance of CBS_FormText.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('small');

        this.addClass('form-text');
    }
}

CBS.addElement('input-form-text', CBS_FormText);