/**
 * Column Options
 *
 * @typedef {CBS_ColOptions}
 */
type CBS_ColOptions = CBS_Options & {
    breakpoints?: CBS_BreakpointMap;
}

/**
 * Breakpoint Map (for cols)
 *
 * @typedef {CBS_BreakpointMap}
 */
type CBS_BreakpointMap = {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
}

/**
 * Container Column
 *
 * @class CBS_Col
 * @typedef {CBS_Col}
 * @extends {CBS_Element}
 */
class CBS_Col extends CBS_Element {
    /**
     * All breakpoints for this column
     *
     * @type {CBS_BreakpointMap}
     */
    private breakpoints: CBS_BreakpointMap = {};

    /**
     * Creates an instance of CBS_Col
     *
     * @constructor
     * @param {?CBS_ColOptions} [options]
     */
    constructor(options?: CBS_ColOptions) {
        options = {
            classes: ['col'],
            ...options
        }
        super(options);
    }

    /**
     * Add a breakpoint to this column
     *
     * @param {string} breakpoint
     * @param {number} size
     */
    addBreakpoint(breakpoint: string, size: number) {
        this.addClass(`col-${breakpoint}-${size}` as CBS_Class);
        this.breakpoints[breakpoint] = size;
    }

    /**
     * Remove a breakpoint from this column
     *
     * @param {string} breakpoint
     */
    removeBreakpoint(breakpoint: string) {
        this.removeClass(`col-${breakpoint}-${this.breakpoints[breakpoint]}` as CBS_Class);
        delete this.breakpoints[breakpoint];
    }

    /**
     * Adds the options (including breakpoints) to this column
     * @date 8/26/2023
     *
     * @type {CBS_ColOptions}
     */
    set options(options: CBS_ColOptions) {
        super.options = options;

        if (options.breakpoints) {
            if (!this.breakpoints) this.breakpoints = {}
            for (const breakpoint in options.breakpoints) {
                this.addBreakpoint(breakpoint, options.breakpoints[breakpoint]);
            }
        }
    }

    /**
     * Returns the options (including breakpoints) of this column
     * @date 8/26/2023
     *
     * @type {CBS_ColOptions}
     */
    get options() {
        return this._options;
    }
}

CBS.addElement('col', CBS_Col);