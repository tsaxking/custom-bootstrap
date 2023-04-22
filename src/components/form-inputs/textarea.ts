




/**
 * Description placeholder
 *
 * @typedef {CBS_TextareaOptions}
 */
type CBS_TextareaOptions = {
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
 * @class CBS_TextAreaInput
 * @typedef {CBS_TextareaInput}
 * @extends {CBS_Input}
 */
class CBS_TextareaInput extends CBS_Input {
    /**
     * Creates an instance of CBS_TextAreaInput.
     *
     * @constructor
     * @param {?CBS_TextareaOptions} [options]
     */
    constructor(options?: CBS_TextareaOptions) {
        super(options);

        this.addClass('form-control');

        this.el = document.createElement('textarea');
    }
}


CBS.addElement('input-textarea', CBS_TextareaInput);