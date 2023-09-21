import { CBS_Element, CBS_Options } from "../../1-main/2-element.ts";
import CBS from "../../1-main/1-main.ts";
import { CBS_BreakpointMap } from "./col.ts";
import { CBS_Row } from "./row.ts";
import { CBS_Class } from "../../1-main/classes.ts";




/**
 * Container Component Options
 *
 * @typedef {CBS_ContainerOptions}
 */
export type CBS_ContainerOptions = CBS_Options & {

    fluid?: boolean;

    breakpoints?: CBS_BreakpointMap;

    listeners?: {
        [key: string]: (e: Event) => void;
    }
}


/**
 * Bootstrap Container Element
 *
 * @class CBS_Container
 * @typedef {CBS_Container}
 * @extends {CBS_Element}
 */
export class CBS_Container extends CBS_Element {
    /**
     * Creates an instance of CBS_Container
     *
     * @constructor
     * @param {?CBS_ContainerOptions} [options]
     */
    constructor(options?: CBS_ContainerOptions) {
        super(options);
        // this.options = options || {};
        this.setContainerOptions(options || {});
    }

    private setContainerOptions(options: CBS_ContainerOptions) {
        if (options.fluid) {
            this.addClass('container-fluid');
        } else if (options.breakpoints) {
            this.removeClass(
                'container',
                'container-sm',
                'container-md',
                'container-lg',
                'container-xl',
                'container-xxl',
                'container-fluid'
            );
            this.addClass(...Object.keys(options.breakpoints).map((key) => {
                if (options.breakpoints && options.breakpoints[key as keyof CBS_BreakpointMap]) 
                    return `container-${key}-${options.breakpoints[key as keyof CBS_BreakpointMap]}`;
            }).filter(Boolean) as CBS_Class[]);
        } else {
            this.addClass('container');
        }
    }

    /**
     * Adds the given options to the element
     *
     * @type {CBS_ContainerOptions}
     */
    set options(options: CBS_ContainerOptions) {
        this.setContainerOptions(options);
        super.options = options;
    }

    /**
     * Adds the given options to the element
     */
    get options() {
        return this._options;
    }

    /**
     * Makes the container fluid
     *
     * @type {boolean}
     */
    set fluid(fluid: boolean) {
        this.options = {
            ...this.options,
            fluid
        }
    }

    /**
     * Adds a row to the container and returns it
     *
     * @returns {*}
     */
    addRow(options?: CBS_Options): CBS_Row {
        const row = new CBS_Row(options);
        this.append(row);
        return row;
    }
}

CBS.addElement('container', CBS_Container);