import { CBS_Element } from "../../1-main/2-element.ts";
import CBS from "../../1-main/1-main.ts";
import { CBS_TextOptions } from "./1-text.ts";


export class CBS_Span extends CBS_Element {
    constructor(options?: CBS_TextOptions) {
        super(options);
        this.el = document.createElement('span');
    }
}

CBS.addElement('span', CBS_Span);