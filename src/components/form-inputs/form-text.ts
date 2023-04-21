class CBS_FormText extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.options = {
            ...this.options,
            classes: [
                ...(this.options.classes || []),
                'form-text'
            ]
        }

        this.el = document.createElement('small');
    }

    set content(content: string) {
        this.el.innerHTML = content;
    }
}