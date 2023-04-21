/**
 * Description placeholder
 *
 * @typedef {CBS_CheckboxOptions}
 */
type CBS_CheckboxOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    label?: string;
}

/**
 * Description placeholder
 *
 * @class CBS_CheckboxInput
 * @typedef {CBS_CheckboxInput}
 * @extends {CBS_Input}
 */
class CBS_CheckboxInput extends CBS_Input {
    /**
     * Creates an instance of CBS_CheckboxInput.
     *
     * @constructor
     * @param {?CBS_CheckboxOptions} [options]
     */
    constructor(options?: CBS_CheckboxOptions) {
        super(options);

        this.el = document.createElement('input');

        this.addClass('form-check-input');
        this.setAttribute('type', 'checkbox');
    }

    get value(): boolean {
        return (this.el as HTMLInputElement).checked;
    }

    select() {
        (this.el as HTMLInputElement).checked = true;
    }

    deselect() {
        (this.el as HTMLInputElement).checked = false;
    }

    toggle() {
        (this.el as HTMLInputElement).checked = !(this.el as HTMLInputElement).checked;
    }
}


class CBS_CheckboxLabel extends CBS_Element {
    #text: string = '';

    constructor(options?: CBS_CheckboxOptions) {
        super(options);

        this.el = document.createElement('label');
        this.addClass('form-check-label');
    }

    set text(text: string) {
        this.#text = text;
        this.el.textContent = text;
    }

    get text() {
        return this.#text;
    }
};

class CBS_Checkbox extends CBS_Input {};



/**
 * Description placeholder
 *
 * @class CBS_CheckboxGroup
 * @typedef {CBS_CheckboxGroup}
 * @extends {CBS_Component}
 */
class CBS_CheckboxGroup extends CBS_Input {};


CBS.addElement('input-checkbox', CBS_CheckboxInput);