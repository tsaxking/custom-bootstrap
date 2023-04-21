type CBS_CheckboxOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

class CBS_CheckboxInput extends CBS_Input {
    constructor(options?: CBS_CheckboxOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-check-input'
            ],
            attributes: {
                ...options?.attributes,
                type: 'checkbox'
            }
        }
    }
}



class CBS_CheckboxGroup extends CBS_Component {};


CBS.addElement('input-checkbox', CBS_CheckboxInput);