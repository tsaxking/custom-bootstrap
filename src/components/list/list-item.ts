

type CBS_ListItemOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}


class CBS_ListItem extends CBS_Component {
    constructor(options?: CBS_ListItemOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'list-group-item'
            ],
            attributes: {
                ...options?.attributes,
                type: 'list-item'
            }
        }

        this.el = document.createElement('li');
    }
}



CBS.addElement('list-item', CBS_ListItem);