import { CBS_Component } from "./3-components.ts";
import { CBS_Options } from "./2-element.ts";
import CBS from './1-main.ts';

export class CBS_Document extends CBS_Component {
    constructor(options?: CBS_Options) {
        super(options);
    }
}

CBS.addElement('dom', CBS_Document);