
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

    mirrorValue?: any;
    label?: string;
}

class CBS_RadioLabel extends CBS_CheckboxLabel {
    constructor(options?: CBS_RadioOptions) {
        super(options);
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
    // #mirrorValue: any;

    /**
     * Creates an instance of CBS_RadioInput.
     *
     * @constructor
     * @param {?CBS_RadioOptions} [options]
     */
    constructor(options?: CBS_RadioOptions) {
        super(options);

        this.el = document.createElement('input');
        this.addClass('form-check-input');
        this.setAttribute('type', 'radio');

        // if (options?.mirrorValue) {
        //     this.#mirrorValue = options.mirrorValue;
        // }
    }

    // get mirrorValue() {
    //     return this.#mirrorValue;
    // }

    get value():boolean {
        return (this.el as HTMLInputElement).checked;
    }
    
    select() {
        (this.el as HTMLInputElement).checked = true;
    }

    deselect() {
        (this.el as HTMLInputElement).checked = false;
    }

    disable() {
        (this.el as HTMLInputElement).disabled = true;
    }

    enable() {
        (this.el as HTMLInputElement).disabled = false;
    }
}


class CBS_Radio extends CBS_Input {
    subcomponents: CBS_ElementContainer = {
        label: new CBS_RadioLabel(),
        input: new CBS_RadioInput()
    }

    constructor(options?: CBS_RadioOptions) {
        super(options);

        if (options?.label) this.text = options.label;
    }

    set text(text: string) {
        (this.subcomponents.label as CBS_RadioLabel).text = text;
    }

    get text() {
        return (this.subcomponents.label as CBS_RadioLabel).text;
    }

    get value() {
        return (this.subcomponents.input as CBS_RadioInput).value;
    }

    // get mirrorValue() {
    //     return (this.subcomponents.input as CBS_RadioInput).mirrorValue;
    // }

    select() {
        (this.subcomponents.input as CBS_RadioInput).select();
    }

    deselect() {
        (this.subcomponents.input as CBS_RadioInput).deselect();
    }

    disable() {
        (this.subcomponents.input as CBS_RadioInput).disable();
    }

    enable() {
        (this.subcomponents.input as CBS_RadioInput).enable();
    }
};


class CBS_RadioGroup extends CBS_Input {
    radios: CBS_Radio[] = [];

    constructor(options?: CBS_RadioOptions) {
        super(options);

        this.el = document.createElement('div');
    }

    addRadio(value: string, options?: CBS_RadioOptions): CBS_Radio {
        const r = new CBS_Radio(options);
        r.text = value;

        this.append(r);
        this.radios.push(r);

        return r;
    }

    removeRadio(value: string): boolean {
        const r = this.radios.find(radio => radio.text === value);
        if (!r) return false;

        this.removeElement(r);
        this.radios.splice(this.radios.indexOf(r), 1);
        return true;
    }

    clearRadios() {
        this.radios.forEach(radio => this.removeElement(radio));
        this.radios = [];
    }
    
    get value(): string {
        const r = this.radios.find(radio => radio.value);
        return r ? r.text : '';
    }

    get mirrorValue(): any {
        const r = this.radios.find(radio => radio.value);
        return r ? r.mirrorValue : null;
    }

    deselectAll() {
        this.radios.forEach(radio => radio.deselect());
    }

    disableAll() {
        this.radios.forEach(radio => radio.disable());
    }

    enableAll() {
        this.radios.forEach(radio => radio.enable());
    }





    select(value: string): boolean {
        const r = this.radios.find(radio => radio.text === value);
        if (r) {
            this.deselectAll();
            r.select();

            return true;
        }
        return false;
    }

    disable(value: string): boolean {
        const r = this.radios.find(radio => radio.text === value);
        if (r) {
            r.disable();
            return true;
        }
        return false;
    }

    enable(value: string): boolean {
        const r = this.radios.find(radio => radio.text === value);
        if (r) {
            r.enable();
            return true;
        }
        return false;
    }
}

CBS.addElement('input-radio', CBS_RadioInput);