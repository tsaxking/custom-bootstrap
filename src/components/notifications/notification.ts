type CBS_NotificationOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    color?: CBS_Color
    type?: 'alert' | 'toast';
}


class CBS_Notification extends CBS_Component {
    subcomponents: CBS_ElementContainer;

    constructor(options?: CBS_NotificationOptions) {
        super(options);

        if (options?.type) {
            let notification: CBS_Component;
            switch (options.type) {
                case 'alert':
                    notification = new CBS_Alert(options);
                    this.subcomponents = {
                        notification
                    };
                    break;
                case 'toast':
                    notification = new CBS_Toast(options);
                    this.subcomponents = {
                        notification
                    };
                    break;
            }
        } else {
            this.subcomponents = {
                container: new CBS_Alert()
            };
        }
    }
}