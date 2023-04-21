
/**
 * Description placeholder
 *
 * @typedef {CBS_ColorInputOptions}
 */
type CBS_ColorInputOptions = {
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
 * @class CBS_ColorInput
 * @typedef {CBS_ColorInput}
 * @extends {CBS_Input}
 */
class CBS_ColorInput extends CBS_Input {
    /**
     * Creates an instance of CBS_ColorInput.
     *
     * @constructor
     * @param {?CBS_ColorInputOptions} [options]
     */
    constructor(options?: CBS_ColorInputOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-control'
            ],
            attributes: {
                ...options?.attributes,
                type: 'color'
            }
        }
    }
}


CBS.addElement('input-color', CBS_ColorInput);