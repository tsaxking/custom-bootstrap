import { CBS_Element, CBS_Options } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";


export class CBS_HorizontalLine extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('hr');
    }
}

CBS.addElement('hr', CBS_HorizontalLine);