type CBS_TableOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
    responsive?: boolean;
};

class CBS_TableBody extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('tbody');
    }

    addRow(options?: CBS_Options): CBS_TableRow {
        const row = new CBS_TableRow(options);
        this.append(row);
        return row;
    }
}

class CBS_TableData extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('td');
    }
}

class CBS_TableHeader extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('th');
    }
}

class CBS_TableHead extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('thead');
    }

    addRow(options?: CBS_Options): CBS_TableHeadRow {
        const row = new CBS_TableHeadRow(options);
        this.append(row);
        return row;
    }
}

class CBS_TableFoot extends CBS_TableHead {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('tfoot');
    }

    addRow(options?: CBS_Options): CBS_TableFootRow {
        const row = new CBS_TableFootRow(options);
        this.append(row);
        return row;
    }
}

class CBS_TableRow extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('tr');
    }

    addCell(content: CBS_Node, options?: CBS_Options): CBS_TableData {
        const d = new CBS_TableData(options);
        d.append(content);
        this.append(d);
        return d;
    }
}

class CBS_TableHeadRow extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('tr');
    }

    addHeader(content: CBS_Node, options?: CBS_Options): CBS_TableHeader {
        const d = new CBS_TableHeader(options);
        d.append(content);
        this.append(d);
        return d;
    }
}


class CBS_TableFootRow extends CBS_TableHeadRow {
    constructor(options?: CBS_Options) {
        super(options);
    }
}


class CBS_TableCaption extends CBS_Text {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('caption');
    }
}

class CBS_SubTable extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('table');
        this.addClass('table');
    }
}

class CBS_Table extends CBS_Component {
    static from(table: HTMLTableElement) {}

    subcomponents: CBS_ElementContainer = {}

    constructor(options?: CBS_TableOptions) {
        super();

        this.el = document.createElement('div');
        if (options?.responsive) this.addClass('table-responsive');

        this.subcomponents.table = new CBS_SubTable(options);

        this.append(this.subcomponents.table);
    }

    addBody(options?: CBS_Options): CBS_TableBody {
        const body = new CBS_TableBody(options);
        this.subcomponents.table.append(body);
        return body;
    }

    addHead(options?: CBS_Options): CBS_TableHead {
        const head = new CBS_TableHead(options);
        this.subcomponents.table.append(head);
        return head;
    }

    addFoot(options?: CBS_Options): CBS_TableFoot {
        const foot = new CBS_TableFoot(options);
        this.subcomponents.table.append(foot);
        return foot;
    }

    addCaption(options?: CBS_Options): CBS_TableCaption {
        const caption = new CBS_TableCaption(options);
        this.subcomponents.table.append(caption);
        return caption;
    }
}



CBS.addElement('table', CBS_Table);