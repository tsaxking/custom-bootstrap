type CBS_ContainerOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    fluid?: boolean;
}


class CBS_Container extends CBS_Element {
    constructor(options?: CBS_ContainerOptions) {
        super(options);

        this.el = document.createElement('div');
        if (this.options.fluid) {
            this.addClass('container-fluid');
        } else {
            this.addClass('container');
        }
    }

    set options(options: CBS_ContainerOptions) {
        super.options = options;
        this.removeClass('container-fluid', 'container');

        if (this.options.fluid) {
            this.addClass('container-fluid');
        } else {
            this.addClass('container');
        }
    }

    set fluid(fluid: boolean) {
        this.options = {
            ...this.options,
            fluid
        }
    }

    addRow() {
        const row = new CBS_Row();

        this.append(row);

        return row;
    }
}