
/**
 * Description placeholder
 *
 * @typedef {CBS_SelectOptions}
 */
type CBS_SelectOptions = {
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
 * @class CBS_SelectInput
 * @typedef {CBS_SelectInput}
 * @extends {CBS_Input}
 */
class CBS_SelectInput extends CBS_Input {
    /**
     * Creates an instance of CBS_SelectInput.
     *
     * @constructor
     * @param {?CBS_SelectOptions} [options]
     */
    constructor(options?: CBS_SelectOptions) {
        super(options);

        this.addClass('form-select');
        this.el = document.createElement('select');
    }
}



CBS.addElement('input-select', CBS_SelectInput);