import { CBS_Options } from "../../1-main/2-element";
import { CBS }from "../../1-main/1-main";
import { CBS_Component } from "../../1-main/3-components";




export type CBS_VideoOptions = CBS_Options & {
}

export class CBS_Video extends CBS_Component {
    constructor(options?: CBS_VideoOptions) {
        super(options);
    }
}


CBS.addElement('video', CBS_Video);