import { CBS_Element, CBS_Options } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_Component } from "../../1-main/3-components";
import { CBS_Input } from "./1-input";
import { CBS_InputLabelContainer } from "./3-input-label-container";





/**
 * Description placeholder
 *
 * @typedef {CBS_InputGroupOptions}
 */
export type CBS_InputGroupOptions = CBS_Options & {
    inputs?: (CBS_Input|CBS_InputLabelContainer)[];
}

/**
 * Description placeholder
 *
 * @class CBS_InputGroupLabel
 * @typedef {CBS_InputGroupLabel}
 * @extends {CBS_Element}
 */
export class CBS_InputGroupLabel extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    #text: string = '';

    /**
     * Creates an instance of CBS_InputGroupLabel.
     *
     * @constructor
     * @param {?CBS_InputGroupOptions} [options]
     */
    constructor(options?: CBS_InputGroupOptions) {
        super(options);

        this.el = document.createElement('span');
        this.addClass('input-group-text');
    }


    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text: string) {
        this.#text = text;
        this.el.textContent = text;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text() {
        return this.#text;
    }
}

CBS.addElement('input-group-label', CBS_InputGroupLabel);



/**
 * Description placeholder
 *
 * @class CBS_InputGroup
 * @typedef {CBS_InputGroup}
 * @extends {CBS_Component}
 */
export class CBS_InputGroup extends CBS_Component {
    // id: string = 'basic-addon-' + Math.floor(Math.random() * Date.now()).toString(16);

    /**
     * Creates an instance of CBS_InputGroup.
     *
     * @constructor
     * @param {?CBS_InputGroupOptions} [options]
     */
    constructor(options?: CBS_InputGroupOptions) {
        super(options);

        this.addClass('input-group');
        this.marginB = 3;
    }

    /**
     * Description placeholder
     *
     * @param {string} label
     */
    addGroupLabel(label: string) {
        const groupLabel = new CBS_InputGroupLabel();
        groupLabel.text = label;
        this.append(groupLabel);

        this.trigger('label.add');
    }

    /**
     * Description placeholder
     *
     * @param {(CBS_Input|CBS_InputLabelContainer)} input
     */
    addInput(input: CBS_Input|CBS_InputLabelContainer) {
        this.append(input);

        this.trigger('input.add');
    }
}

CBS.addElement('input-group', CBS_InputGroup);