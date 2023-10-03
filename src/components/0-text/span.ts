import { CBS_Element } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_TextOptions } from "./1-text";


export class CBS_Span extends CBS_Element {
    constructor(options?: CBS_TextOptions) {
        super(options);
        this.el = document.createElement('span');
    }
}

CBS.addElement('span', CBS_Span);