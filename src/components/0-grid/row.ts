import { CBS_Element, CBS_Options } from "../../1-main/2-element";
import { CBS_BreakpointMap } from "./col";
import { CBS_Col } from "./col";


/**
 * Row component Options
 *
 * @typedef {CBS_RowOptions}
 */
export type CBS_RowOptions = CBS_Options & {
}

/**
 * Row Component
 *
 * @class CBS_Row
 * @typedef {CBS_Row}
 * @extends {CBS_Element}
 */
export class CBS_Row extends CBS_Element {
    /**
     * Creates an instance of CBS_Row
     *
     * @constructor
     * @param {?CBS_RowOptions} [options]
     */
    constructor(options?: CBS_RowOptions) {
        super(options);

        this.el = document.createElement('div');
        this.addClass('row');
    }

    /**
     * Adds a column to the row and returns it
     *
     * @param {?CBS_BreakpointMap} [breakpoints]
     * @returns {CBS_Col}
     */
    addCol(breakpoints?: CBS_BreakpointMap): CBS_Col {
        const col = new CBS_Col({
            breakpoints: breakpoints
        });

        this.append(col);

        return col;
    }

    /**
     * Removes the given column from the row
     *
     * @param {CBS_Col} col
     */
    removeCol(col: CBS_Col) {
        this.removeElement(col);
    }
}