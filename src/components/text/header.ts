type CBS_HeadingOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

class CBS_Heading extends CBS_Text {
    constructor(options?: CBS_HeadingOptions) {
        super(options);
    }
}

class CBS_H1 extends CBS_Heading {
    constructor(options?: CBS_HeadingOptions) {
        super(options);

        this.el = document.createElement('h1');
    }
}

class CBS_H2 extends CBS_Heading {
    constructor(options?: CBS_HeadingOptions) {
        super(options);

        this.el = document.createElement('h2');
    }
}

class CBS_H3 extends CBS_Heading {
    constructor(options?: CBS_HeadingOptions) {
        super(options);

        this.el = document.createElement('h3');
    }
}

class CBS_H4 extends CBS_Heading {
    constructor(options?: CBS_HeadingOptions) {
        super(options);

        this.el = document.createElement('h4');
    }
}

class CBS_H5 extends CBS_Heading {
    constructor(options?: CBS_HeadingOptions) {
        super(options);

        this.el = document.createElement('h5');
    }
}

class CBS_H6 extends CBS_Heading {
    constructor(options?: CBS_HeadingOptions) {
        super(options);

        this.el = document.createElement('h6');
    }
}

CBS.addElement('heading', CBS_Heading);
CBS.addElement('h1', CBS_H1);
CBS.addElement('h2', CBS_H2);
CBS.addElement('h3', CBS_H3);
CBS.addElement('h4', CBS_H4);
CBS.addElement('h5', CBS_H5);
CBS.addElement('h6', CBS_H6);