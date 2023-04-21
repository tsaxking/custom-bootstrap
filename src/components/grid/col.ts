type CBS_ColOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

type CBS_BreakpointMap = {
    [key: string]: number;
}

class CBS_Col extends CBS_Element {
    breakpoints: {
        [key: string]: number;
    } = {};

    constructor(options?: CBS_ColOptions) {
        super(options);

        this.el = document.createElement('div');
    }

    addBreakpoint(breakpoint: string, size: number) {
        this.addClass(`col-${breakpoint}-${size}`);
        this.breakpoints[breakpoint] = size;
    }

    removeBreakpoint(breakpoint: string) {
        this.removeClass(`col-${breakpoint}-${this.breakpoints[breakpoint]}`);
        delete this.breakpoints[breakpoint];
    }
}