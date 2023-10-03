import { CBS_Options } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_Component } from "../../1-main/3-components";

/**
 * Description placeholder
 *
 * @typedef {CBS_AnchorOptions}
 */
export type CBS_AnchorOptions = CBS_Options & {
}

/**
 * Description placeholder
 *
 * @class CBS_Anchor
 * @typedef {CBS_Anchor}
 * @extends {CBS_Component}
 */
export class CBS_Anchor extends CBS_Component {
    /**
     * Creates an instance of CBS_Anchor.
     *
     * @constructor
     * @param {?CBS_AnchorOptions} [options]
     */
    constructor(options?: CBS_AnchorOptions) {
        super(options);

        this.el = document.createElement('a');
    }
}




CBS.addElement('a', CBS_Anchor);