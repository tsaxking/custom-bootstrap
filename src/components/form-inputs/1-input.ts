
type CBS_InputOptions = {
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
}

class CBS_Input extends CBS_Element {
    _el: HTMLInputElement = this.el as HTMLInputElement; // just to trick compiler

    constructor(options?: CBS_InputOptions) {
        super(options);

        this.el = document.createElement('input');
    }

    get value() {
        return this._el.value;
    }
}


CBS.addElement('input', CBS_Input);