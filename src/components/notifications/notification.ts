type CBS_NotificationOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    listeners?: {
        [key: string]: (e: Event) => void;
    }

    color?: CBS_Color
    type?: 'alert' | 'toast';
}


class CBS_Notification extends CBS_Component {
    subcomponents: {
        notification: CBS_Alert | CBS_Toast;
    };

    constructor(options?: CBS_NotificationOptions) {
        super(options);

        if (options?.type) {
            let notification: CBS_Alert | CBS_Toast;
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
                notification: new CBS_Alert()
            };
        }
    }
}