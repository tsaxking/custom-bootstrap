
type CBS_RadioOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

class CBS_RadioInput extends CBS_Input {
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



CBS.addElement('input-radio', CBS_RadioInput);