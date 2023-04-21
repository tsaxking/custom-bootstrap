type CBS_RowOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

class CBS_Row extends CBS_Element {
    constructor(options?: CBS_RowOptions) {
        super(options);

        this.el = document.createElement('div');
        this.addClass('row');
    }

    addCol(breakpoints?: CBS_BreakpointMap) {
        const col = new CBS_Col();

        if (breakpoints) {
            for (const breakpoint in breakpoints) {
                col.addBreakpoint(breakpoint, breakpoints[breakpoint]);
            }
        }

        this.append(col);

        return col;
    }

    removeCol(col: CBS_Col) {
        this.removeElement(col);
    }
}