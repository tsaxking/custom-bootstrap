
// █▀ ▄▀▄ █▀▄ █▄ ▄█ ▄▀▀ 
// █▀ ▀▄▀ █▀▄ █ ▀ █ ▄█▀ 

type CBS_FormOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}



type CBS_InputList = CBS_Input[];


class CBS_Form extends CBS_Component {
    inputs: CBS_InputList = [];

    constructor(options?: CBS_FormOptions) {
        super(options);
    }


    public addInput(type: string | CBS_Input, options?: CBS_InputOptions): CBS_Input {
        let input: CBS_Input;
        if (typeof type === 'string') {
            switch (type) {
                case 'text':
                    input = new CBS_TextInput(options);
                    break;
                case 'number':
                    input = new CBS_NumberInput(options);
                    break;
                case 'email':
                    input = new CBS_EmailInput(options);
                    break;
                case 'password':
                    input = new CBS_PasswordInput(options);
                    break;
                case 'textarea':
                    input = new CBS_TextAreaInput();
                    break;
                case 'select':
                    input = new CBS_SelectInput(options);
                    break;
                case 'checkbox':
                    input = new CBS_CheckboxInput(options);
                    break;
                case 'radio':
                    input = new CBS_RadioInput(options);
                    break;
                case 'file':
                    input = new CBS_FileInput(options);
                    break;
                case 'color':
                    input = new CBS_ColorInput(options);
                default: 
                    throw new Error('Invalid input type');
            }
        } else {
            input = type;
        }

        this.append(input);
        this.inputs.push(input);

        return input;
    }

    public removeInput(input: CBS_Input) {
        this.inputs.splice(this.inputs.indexOf(input), 1);
        this.removeElement(input);
    }

    submit() {
        this.trigger('submit');
    }
}


CBS.addElement('form', CBS_Form);