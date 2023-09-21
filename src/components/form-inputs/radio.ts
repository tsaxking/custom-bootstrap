import { CBS_Element, CBS_Options, CBS_Node } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_Component } from "../../1-main/3-components";
import { CustomBootstrap } from "../../1-main/1-main";



import { CBS_Container } from "../0-grid/container";
import { CBS_Button } from "../1-general/1-button";
import { CBS_InputOptions, CBS_Input, CBS_InputInterface, CBS_InputMirrorValueMap } from "./1-input";



import { CBS_Label } from "./2-label";
import { CBS_CheckboxLabel } from "./checkbox";


/**
 * Description placeholder
 *
 * @typedef {CBS_RadioOptions}
 */
export type CBS_RadioOptions = CBS_Options & {
    mirrorValue?: any;
    label?: string;
}

export class CBS_RadioLabel extends CBS_CheckboxLabel {
    /**
     * Creates an instance of CBS_RadioLabel.
     *
     * @constructor
     * @param {?CBS_RadioOptions} [options]
     */
    constructor(options?: CBS_RadioOptions) {
        super(options);
    }
}

CBS.addElement('radio-label', CBS_RadioLabel);



/**
 * Description placeholder
 *
 * @class CBS_RadioInput
 * @typedef {CBS_RadioInput}
 * @extends {CBS_Input}
 */
export class CBS_RadioInput extends CBS_Input {
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

    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get value():boolean {
        return (this.el as HTMLInputElement).checked;
    }
    
    /**
     * Description placeholder
     */
    select() {
        (this.el as HTMLInputElement).checked = true;
    }

    /**
     * Description placeholder
     */
    deselect() {
        (this.el as HTMLInputElement).checked = false;
    }

    /**
     * Description placeholder
     */
    disable() {
        (this.el as HTMLInputElement).disabled = true;
    }

    /**
     * Description placeholder
     */
    enable() {
        (this.el as HTMLInputElement).disabled = false;
    }
}

CBS.addElement('input-radio', CBS_RadioInput);


/**
 * Description placeholder
 *
 * @class CBS_Radio
 * @typedef {CBS_Radio}
 * @extends {CBS_Input}
 */
export class CBS_Radio extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: {
        label: CBS_RadioLabel;
        input: CBS_RadioInput;
    } = {
        label: new CBS_RadioLabel(),
        input: new CBS_RadioInput()
    }

    /**
     * Creates an instance of CBS_Radio.
     *
     * @constructor
     * @param {?CBS_RadioOptions} [options]
     */
    constructor(options?: CBS_RadioOptions) {
        super(options);

        if (options?.label) this.text = options.label;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text: string) {
        (this.subcomponents.label as CBS_RadioLabel).text = text;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text() {
        return (this.subcomponents.label as CBS_RadioLabel).text;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get value() {
        return (this.subcomponents.input as CBS_RadioInput).value;
    }

    // get mirrorValue() {
    //     return (this.subcomponents.input as CBS_RadioInput).mirrorValue;
    // }

    /**
     * Description placeholder
     */
    select() {
        (this.subcomponents.input as CBS_RadioInput).select();
    }

    /**
     * Description placeholder
     */
    deselect() {
        (this.subcomponents.input as CBS_RadioInput).deselect();
    }

    /**
     * Description placeholder
     */
    disable() {
        (this.subcomponents.input as CBS_RadioInput).disable();
    }

    /**
     * Description placeholder
     */
    enable() {
        (this.subcomponents.input as CBS_RadioInput).enable();
    }
};

CBS.addElement('radio', CBS_Radio);


/**
 * Description placeholder
 *
 * @class CBS_RadioGroup
 * @typedef {CBS_RadioGroup}
 * @extends {CBS_Input}
 */
export class CBS_RadioGroup extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_Radio[]}
     */
    radios: CBS_Radio[] = [];

    /**
     * Creates an instance of CBS_RadioGroup.
     *
     * @constructor
     * @param {?CBS_RadioOptions} [options]
     */
    constructor(options?: CBS_RadioOptions) {
        super(options);

        this.el = document.createElement('div');
    }

    /**
     * Description placeholder
     *
     * @param {string} value
     * @param {?CBS_RadioOptions} [options]
     * @returns {CBS_Radio}
     */
    addRadio(value: string, options?: CBS_RadioOptions): CBS_Radio {
        const r = new CBS_Radio(options);
        r.text = value;

        this.append(r);
        this.radios.push(r);

        return r;
    }

    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
    removeRadio(value: string): boolean {
        const r = this.radios.find(radio => radio.text === value);
        if (!r) return false;

        this.removeElement(r);
        this.radios.splice(this.radios.indexOf(r), 1);
        return true;
    }

    /**
     * Description placeholder
     */
    clearRadios() {
        this.radios.forEach(radio => this.removeElement(radio));
        this.radios = [];
    }
    
    /**
     * Description placeholder
     *
     * @readonly
     * @type {string}
     */
    get value(): string {
        const r = this.radios.find(radio => radio.value);
        return r ? r.text : '';
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any {
        if (this.getMirrorValue) return this.getMirrorValue(this.value);

        const r = this.radios.find(radio => radio.value);
        return r ? r.mirrorValue : null;
    }

    /**
     * Description placeholder
     */
    deselectAll() {
        this.radios.forEach(radio => radio.deselect());
    }

    /**
     * Description placeholder
     */
    disableAll() {
        this.radios.forEach(radio => radio.disable());
    }

    /**
     * Description placeholder
     */
    enableAll() {
        this.radios.forEach(radio => radio.enable());
    }





    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
    select(value: string): boolean {
        const r = this.radios.find(radio => radio.text === value);
        if (r) {
            this.deselectAll();
            r.select();

            return true;
        }
        return false;
    }

    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
    disable(value: string): boolean {
        const r = this.radios.find(radio => radio.text === value);
        if (r) {
            r.disable();
            return true;
        }
        return false;
    }

    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
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