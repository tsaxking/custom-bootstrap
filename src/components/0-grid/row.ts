/**
 * Description placeholder
 *
 * @typedef {CBS_RowOptions}
 */
type CBS_RowOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

/**
 * Description placeholder
 *
 * @class CBS_Row
 * @typedef {CBS_Row}
 * @extends {CBS_Element}
 */
class CBS_Row extends CBS_Element {
    /**
     * Creates an instance of CBS_Row.
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
     * Description placeholder
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
     * Description placeholder
     *
     * @param {CBS_Col} col
     */
    removeCol(col: CBS_Col) {
        this.removeElement(col);
    }
}