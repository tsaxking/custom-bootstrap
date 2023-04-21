class CBS_CardHeader extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this._el = document.createElement('div');
        this._el.classList.add('card-header');
    }
}

class CBS_CardBody extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this._el = document.createElement('div');
        this._el.classList.add('card-body');
    }
}

class CBS_CardFooter extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this._el = document.createElement('div');
        this._el.classList.add('card-footer');
    }
}

type CBS_CardOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}


class CBS_Card extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
        header: new CBS_CardHeader(),
        body: new CBS_CardBody(),
        footer: new CBS_CardFooter()
    }

    constructor(options?: CBS_CardOptions) {
        super(options);

        this._el = document.createElement('div');
        this._el.classList.add('card');

        this.append(
            this.subcomponents.header,
            this.subcomponents.body,
            this.subcomponents.footer
        );
    }
}



CBS.addElement('card', CBS_Card);



(() => {
    const card = new CBS_Card();

    card.subcomponents.image = new CBS_Image();
    card.subcomponents.header.prepend(card.subcomponents.image);

    CBS_Card.addTemplate('image', card);
})();