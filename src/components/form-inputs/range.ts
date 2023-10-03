import CBS from "../../1-main/1-main";
import { CBS_InputOptions, CBS_Input } from "./1-input";



import { CBS_Label } from "./2-label";




/**
 * Description placeholder
 *
 * @typedef {CBS_RangeInputOptions}
 */
export type CBS_RangeInputOptions = CBS_InputOptions & {

    min?: number;
    max?: number;
    step?: number;
};

/**
 * Description placeholder
 *
 * @class CBS_RangeInput
 * @typedef {CBS_RangeInput}
 * @extends {CBS_Input}
 */
export class CBS_RangeInput extends CBS_Input {

    /**
     * Creates an instance of CBS_RangeInput.
     *
     * @constructor
     * @param {?CBS_RangeInputOptions} [options]
     */
    constructor(options?: CBS_RangeInputOptions) {
        super(options);

        this.addClass('form-control');
        this.setAttribute('type', 'range');

        if (options?.min) this.setAttribute('min', options.min.toString());
        else this.setAttribute('min', '0');
        
        if (options?.max) this.setAttribute('max', options.max.toString());
        else this.setAttribute('max', '100');

        if (options?.step) this.setAttribute('step', options.step.toString());
        else this.setAttribute('step', '1');
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    get value(): number {
        return +(this.el as HTMLInputElement).value;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set value(value: number) {
        (this.el as HTMLInputElement).value = value.toString();
    }


    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any {
        if (this.getMirrorValue) return this.getMirrorValue(this.value);
        return this.mirrorValues[this.value];
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    get min(): number {
        return this.getAttribute('min') ? +this.getAttribute('min') : 0;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set min(min: number) {
        this.setAttribute('min', min.toString());
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    get max(): number {
        return this.getAttribute('max') ? +this.getAttribute('max') : 100;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set max(max: number) {
        this.setAttribute('max', max.toString());
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    get step(): number {
        return this.getAttribute('step') ? +this.getAttribute('step') : 1;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set step(step: number) {
        this.setAttribute('step', step.toString());
    }
}


CBS.addElement('input-range', CBS_RangeInput);
CBS.addElement('range', CBS_RangeInput);