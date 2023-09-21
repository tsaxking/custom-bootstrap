import { CBS_Element, CBS_Options, CBS_Node, CBS_NodeMap } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_Component } from "../../1-main/3-components";
import { CustomBootstrap } from "../../1-main/1-main";



import { CBS_Container } from "../0-grid/container";
import { CBS_Button } from "../1-general/1-button";







import { CBS_H5 } from "../0-text/header";
import { CBS_CardBody } from "../1-general/card";




/**
 * Description placeholder
 *
 * @typedef {CBS_ImageOptions}
 */
export type CBS_ImageOptions = CBS_Options & {
    src?: string
}

/**
 * Description placeholder
 *
 * @class CBS_Image
 * @typedef {CBS_Image}
 * @extends {CBS_Component}
 */
export class CBS_Image extends CBS_Component {
    /**
     * Creates an instance of CBS_Image.
     *
     * @constructor
     * @param {?CBS_ImageOptions} [options]
     */
    constructor(options?: CBS_ImageOptions) {
        super(options);

        this.el = document.createElement('img');
    }




    /**
     * Description placeholder
     *
     * @type {CBS_ImageOptions}
     */
    set options(options: CBS_ImageOptions) {
        super.options = options;

        (this.el as HTMLImageElement).src = options.src || '';
    }

    get options() {
        return this._options;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set src(src: string) {
        this.options = {
            ...this.options,
            src
        };
    }
}


CBS.addElement('picture', CBS_Image);