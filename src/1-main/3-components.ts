type CBS_Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type CBS_SubComponentContainer = {
    [key: string]: CBS_Component;
}





class CBS_Component extends CBS_Element {
    subcomponents: CBS_ElementContainer = {};

    constructor(options?: CBS_Options) {
        super(options);

        // Object.values(this.subcomponents).forEach((value) => {
        //     this.append(value);
        // });
    }
}