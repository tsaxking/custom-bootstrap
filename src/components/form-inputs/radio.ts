
/**
 * Description placeholder
 *
 * @typedef {CBS_RadioOptions}
 */
type CBS_RadioOptions = {
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
 * @class CBS_RadioInput
 * @typedef {CBS_RadioInput}
 * @extends {CBS_Input}
 */
class CBS_RadioInput extends CBS_Input {
    /**
     * Creates an instance of CBS_RadioInput.
     *
     * @constructor
     * @param {?CBS_RadioOptions} [options]
     */
    constructor(options?: CBS_RadioOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-control'
            ],
            attributes: {
                ...options?.attributes,
                type: 'radio'
            }
        }
    }
}


class CBS_Radio extends CBS_Input {};


class CBS_RadioGroup extends CBS_Input {}

CBS.addElement('input-radio', CBS_RadioInput);