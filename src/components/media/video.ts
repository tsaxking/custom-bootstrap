type CBS_VideoOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    listeners?: {
        [key: string]: (e: Event) => void;
    }
}

class CBS_Video extends CBS_Component {
    constructor(options?: CBS_VideoOptions) {
        super(options);
    }
}


CBS.addElement('video', CBS_Video);