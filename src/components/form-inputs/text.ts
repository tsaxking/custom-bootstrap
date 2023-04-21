type CBS_TextInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    name?: string;
    label?: string;
    value?: string;
    group?: boolean;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;

    datalist?: string;
}

class CBS_TextInput extends CBS_Input {
    constructor(options?: CBS_TextInputOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-control'
            ],
            attributes: {
                ...options?.attributes,
                type: 'text'
            }
        }
    }
}



CBS.addElement('input-text', CBS_TextInput);