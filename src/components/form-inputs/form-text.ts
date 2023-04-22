class CBS_FormText extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('small');

        this.addClass('form-text');
    }

    set content(content: string) {
        this.el.innerHTML = content;

        if (content) this.show();
        else this.hide();
    }

    get content() {
        return this.el.innerHTML;
    }
}