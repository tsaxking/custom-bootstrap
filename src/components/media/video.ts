import { CBS_Element, CBS_Options, CBS_Node, CBS_NodeMap } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_Component } from "../../1-main/3-components";
import { CustomBootstrap } from "../../1-main/1-main";



import { CBS_Container } from "../0-grid/container";
import { CBS_Button } from "../1-general/1-button";







import { CBS_H5 } from "../0-text/header";
import { CBS_CardBody } from "../1-general/card";




export type CBS_VideoOptions = CBS_Options & {
}

export class CBS_Video extends CBS_Component {
    constructor(options?: CBS_VideoOptions) {
        super(options);
    }
}


CBS.addElement('video', CBS_Video);