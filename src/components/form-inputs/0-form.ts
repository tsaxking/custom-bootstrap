
// █▀ ▄▀▄ █▀▄ █▄ ▄█ ▄▀▀ 
// █▀ ▀▄▀ █▀▄ █ ▀ █ ▄█▀ 

/**
 * Description placeholder
 *
 * @typedef {CBS_FormOptions}
 */
type CBS_FormOptions = {
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
 * @typedef {CBS_InputList}
 */
type CBS_InputList = (CBS_Input|CBS_InputLabelContainer)[];


/**
 * Description placeholder
 *
 * @class CBS_Form
 * @typedef {CBS_Form}
 * @extends {CBS_Component}
 */
class CBS_Form extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_InputList}
     */
    inputs: CBS_InputList = [];

    /**
     * Creates an instance of CBS_Form.
     *
     * @constructor
     * @param {?CBS_FormOptions} [options]
     */
    constructor(options?: CBS_FormOptions) {
        super(options);
    }

    /**
     * Description placeholder
     *
     * @returns {CBS_InputGroup}
     */
    addGroup() {
        const group = new CBS_InputGroup();
        this.append(group);

        group.on('input:add', () => {
            const input = group.components[group.components.length - 1];
            this.inputs.push(input as CBS_Input|CBS_InputLabelContainer);
        });

        return group;
    }

    /**
     * Description placeholder
     *
     * @param {(CBS_Input|CBS_InputLabelContainer)} input
     */
    addInput(input: CBS_Input|CBS_InputLabelContainer) {
        this.inputs.push(input);
        this.append(input);
    }

    /**
     * Description placeholder
     *
     * @param {string} type
     * @param {CBS_Options} options
     * @returns {CBS_Input}
     */
    createInput(type: string, options: CBS_Options): CBS_Input {
        switch (type) {
            case 'text':
                return new CBS_TextInput(options);
            case 'password':
                return new CBS_PasswordInput(options);
            case 'email':
                return new CBS_EmailInput(options);
            case 'select':
                return new CBS_SelectInput(options);
            case 'textarea':
                return new CBS_TextareaInput(options);
            case 'checkbox':
                return new CBS_Checkbox(options);
            case 'radio':
                return new CBS_Radio(options);
            case 'file':
                return new CBS_FileInput(options);
            case 'range':
                return new CBS_RangeInput(options);
            case 'color':
                return new CBS_ColorInput(options);
            case 'date':
                return new CBS_DateInput(options);
        }

        return new CBS_Input();
    }
}


CBS.addElement('form', CBS_Form);