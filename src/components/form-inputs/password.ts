




type CBS_PasswordInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

class CBS_PasswordInput extends CBS_Input {
    constructor(options?: CBS_PasswordInputOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-control'
            ],
            attributes: {
                ...options?.attributes,
                type: 'password'
            }
        }
    }
}

CBS.addElement('input-password', CBS_PasswordInput);