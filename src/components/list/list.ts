

type CBS_ListOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    ordered?: boolean;
}


class CBS_List extends CBS_Component {
    constructor(options?: CBS_ListOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'list-group'
            ],
            attributes: {
                ...options?.attributes,
                type: 'list'
            }
        };

        if (this.options.ordered) {
            this.el = document.createElement('ol');
        } else {
            this.el = document.createElement('ul');
        }
    }

    set options(options: CBS_ListOptions) {
        super.options = options;

        if (this.options.ordered) {
            this.el = document.createElement('ol');
        } else {
            this.el = document.createElement('ul');
        }
    }

    set ordered(ordered: boolean) {
        this.options = {
            ...this.options,
            ordered
        };
    }

    get ordered(): boolean {
        return this.options?.ordered || false;
    }
}


CBS.addElement('list', CBS_List);