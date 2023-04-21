type CBS_ListenerCallback = (event: Event) => Promise<boolean|void>|void;

class CBS_Listener {
    event: string;
    callback: CBS_ListenerCallback;
    // options?: AddEventListenerOptions;
    isAsync: boolean = true;

    constructor(event: string, callback: CBS_ListenerCallback, isAsync: boolean = true) {
        this.event = event;
        this.callback = callback;
        this.isAsync = isAsync;
    }
}

type CBS_Event = {
    event: string;
    callback: CBS_ListenerCallback;
    // options?: AddEventListenerOptions;
    isAsync: boolean;
}