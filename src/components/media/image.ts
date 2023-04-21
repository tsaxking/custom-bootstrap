type CBS_ImageOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    src?: string
}

class CBS_Image extends CBS_Component {
    constructor(options?: CBS_ImageOptions) {
        super(options);

        this.el = document.createElement('img');
    }




    set options(options: CBS_ImageOptions) {
        super.options = options;

        (this.el as HTMLImageElement).src = options.src || '';
    }

    set src(src: string) {
        this.options = {
            ...this.options,
            src
        };
    }
}


CBS.addElement('picture', CBS_Image);