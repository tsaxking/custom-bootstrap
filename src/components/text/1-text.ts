/**
 * Description placeholder
 *
 * @typedef {CBS_TextOptions}
 */
type CBS_TextOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}


/**
 * Description placeholder
 *
 * @class CBS_Text
 * @typedef {CBS_Text}
 * @extends {CBS_Element}
 */
class CBS_Text extends CBS_Element {
    /**
     * Creates an instance of CBS_Text.
     *
     * @constructor
     * @param {?CBS_TextOptions} [options]
     */
    constructor(options?: CBS_TextOptions) {
        super(options);
    }
}


CBS.addElement('text', CBS_Text);