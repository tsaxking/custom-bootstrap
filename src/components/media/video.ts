type CBS_VideoOptions = CBS_Options & {
}

class CBS_Video extends CBS_Component {
    constructor(options?: CBS_VideoOptions) {
        super(options);
    }
}


CBS.addElement('video', CBS_Video);