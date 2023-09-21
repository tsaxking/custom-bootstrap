import { CBS_Options } from "../../1-main/2-element.ts";
import { CBS_Component } from "../../1-main/3-components.ts";
import { CBS_Color } from "../../1-main/enums.ts";
import { CBS_Toast } from "./toast.ts";
import { CBS_Alert } from "./alert.ts";


export type CBS_NotificationOptions = CBS_Options & {

    color?: CBS_Color
    type?: 'alert' | 'toast';
}


export class CBS_Notification extends CBS_Component {
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