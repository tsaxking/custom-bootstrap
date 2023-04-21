/**
 * Description placeholder
 *
 * @typedef {CBS_RangeInputOptions}
 */
type CBS_RangeInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
};

/**
 * Description placeholder
 *
 * @class CBS_RangeInput
 * @typedef {CBS_RangeInput}
 * @extends {CBS_Input}
 */
class CBS_RangeInput extends CBS_Input {
    /**
     * Creates an instance of CBS_RangeInput.
     *
     * @constructor
     * @param {?CBS_RangeInputOptions} [options]
     */
    constructor(options?: CBS_RangeInputOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-control'
            ],
            attributes: {
                ...options?.attributes,
                type: 'range'
            }
        }
    }
}


CBS.addElement('input-range', CBS_RangeInput);