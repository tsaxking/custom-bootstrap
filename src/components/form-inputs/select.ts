import { CBS_Element, CBS_Options } from "../../1-main/2-element";
import { CBS }from "../../1-main/1-main";
import { CBS_Input } from "./1-input";



/**
 * Description placeholder
 *
 * @typedef {CBS_SelectOptions}
 */
export type CBS_SelectOptions = {
}

export type CBS_OptionOptions = CBS_Options & {
    text?: string;
    value?: string;
    mirrorValue?: any;
}


export class CBS_SelectOption extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    value: string;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    _text: string = '';
    /**
     * Description placeholder
     *
     * @type {*}
     */
    mirrorValue: any;

    /**
     * Creates an instance of CBS_SelectOption.
     *
     * @constructor
     * @param {string} text
     * @param {string} value
     * @param {*} [mirrorValue=null]
     */
    constructor(options?: CBS_OptionOptions) {
        super(options);

        this.el = document.createElement('option');

        this.value = options?.value || '';

        if (options?.value) {
            this.setAttribute('value', options.value);
        }

        this.text = options?.text || '';
        this.mirrorValue = options?.mirrorValue || null;
    }

    get text(): string {
        return this._text;
    }

    set text(text: string) {
        this._text = text;
        this.clearElements();
        this.append(text);
    }

    /**
     * Description placeholder
     */
    select() {
        this.setAttribute('selected', '');
    }

    /**
     * Description placeholder
     */
    deselect() {
        this.removeAttribute('selected');
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {string}
     */
    get selected() {
        return this.getAttribute('selected');
    }

    /**
     * Description placeholder
     */
    disable() {
        this.setAttribute('disabled', '');
    }

    /**
     * Description placeholder
     */
    enable() {
        this.removeAttribute('disabled');
    }
}


/**
 * Description placeholder
 *
 * @class CBS_SelectInput
 * @typedef {CBS_SelectInput}
 * @extends {CBS_Input}
 */
export class CBS_SelectInput<MirrorValueType = unknown> extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_SelectOption[]}
     */
    selectOptions: CBS_SelectOption[] = [];

    /**
     * Creates an instance of CBS_SelectInput.
     *
     * @constructor
     * @param {?CBS_SelectOptions} [options]
     */
    constructor(options?: CBS_SelectOptions) {
        super(options);

        this.addClass('form-select');
        this.el = document.createElement('select');
    }

    /**
     * 
     *
     * @param {string} text The text to display for the option
     * @param {string} value The value of the option
     * @param {*} [mirrorValue=null] The data this option represents
     * @returns {(CBS_SelectOption|null)}
     */
    addOption(text: string, value: string, mirrorValue: any = null): CBS_SelectOption|null {
        const has = this.selectOptions.find(option => option.value === value);
        if (has) {
            console.error('CBS_Select cannot have multiple options with the same value');
            return null;
        }

        const option = new CBS_SelectOption({
            text,
            value,
            mirrorValue
        });
        this.selectOptions.push(option);
        this.append(option);

        return option;
    }

    /**
     * Description placeholder
     *
     * @param {(string|CBS_SelectOption)} valueOrOption
     */
    removeOption(valueOrOption: string|CBS_SelectOption) {
        if (typeof valueOrOption === 'string') {
            const option = this.selectOptions.find(option => option.value === valueOrOption);
            if (option) {
                this.selectOptions.splice(this.selectOptions.indexOf(option), 1);
                this.removeElement(option);
            }
        } else {
            this.selectOptions.splice(this.selectOptions.indexOf(valueOrOption), 1);
            this.removeElement(valueOrOption);
        }
    }

    /**
     * Description placeholder
     *
     * @param {string} value
     */
    select(value: string) {
        this.selectOptions.forEach(option => {
            if (option.value === value) {
                option.select();
            } else {
                option.deselect();
            }
        });
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {string}
     */
    get value():string {
        return (this.el as HTMLInputElement).value;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): MirrorValueType|null {
        const option = this.selectOptions.find(option => option.value === this.value);
        if (option) {
            return option.mirrorValue;
        }

        return null;
    }


    clearElements() {
        super.clearElements();
        this.selectOptions = [];
    }
}



CBS.addElement('select', CBS_SelectInput);