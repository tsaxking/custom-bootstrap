

type CBS_EmailInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

class CBS_EmailInput extends CBS_Input {
    constructor(options?: CBS_EmailInputOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-control'
            ],
            attributes: {
                ...options?.attributes,
                type: 'email'
            }
        }
    }
}



CBS.addElement('input-email', CBS_EmailInput);