import { CBS_Element, CBS_Options, CBS_Node } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_Component } from "../../1-main/3-components";
import { CustomBootstrap } from "../../1-main/1-main";



import { CBS_Container } from "../0-grid/container";
import { CBS_Button } from "../1-general/1-button";
import { CBS_InputOptions, CBS_Input, CBS_InputInterface, CBS_InputMirrorValueMap } from "./1-input";



import { CBS_Label } from "./2-label";


/**
 * Description placeholder
 *
 * @class CBS_FormText
 * @typedef {CBS_FormText}
 * @extends {CBS_Element}
 */
export class CBS_FormText extends CBS_Element {
    /**
     * Creates an instance of CBS_FormText.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('small');

        this.addClass('form-text');
    }
}

CBS.addElement('input-form-text', CBS_FormText);