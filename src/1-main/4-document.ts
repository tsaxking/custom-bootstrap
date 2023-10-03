import { CBS_Component } from "./3-components";
import { CBS_Options } from "./2-element";
import { CBS } from './1-main';

export class CBS_Document extends CBS_Component {
    constructor(options?: CBS_Options) {
        super(options);
    }
}

CBS.addElement('dom', CBS_Document);