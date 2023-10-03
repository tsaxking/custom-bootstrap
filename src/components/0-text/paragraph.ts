import { CBS_Options } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_Text } from "./1-text";


/**
 * Description placeholder
 *
 * @typedef {CBS_ParagraphOptions}
 */
export type CBS_ParagraphOptions = CBS_Options & {
}


/**
 * Description placeholder
 *
 * @class CBS_Paragraph
 * @typedef {CBS_Component}
 * @extends {CBS_Component}
 */
export class CBS_Paragraph extends CBS_Text {
    /**
     * Creates an instance of CBS_Paragraph.
     *
     * @constructor
     * @param {?CBS_ParagraphOptions} [options]
     */
    constructor(options?: CBS_ParagraphOptions) {
        super(options);

        this.el = document.createElement('p');
    }
}


CBS.addElement('p', CBS_Paragraph);