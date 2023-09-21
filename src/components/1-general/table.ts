import { CBS_Element, CBS_Options, CBS_Node } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_Component } from "../../1-main/3-components";

import { CBS_Text } from "../0-text/1-text";






export type CBS_TableOptions = CBS_Options & {
    responsive?: boolean;
};




export type CBS_TableRowCellOptions = CBS_Options & {

    colspan?: number;
    rowspan?: number;
    scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';

    getData: (data: any) => CBS_Node;
}

export class CBS_TableBody extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('tbody');
    }

    addRow(options?: CBS_Options): CBS_TableRow {
        const row = new CBS_TableRow(options);
        this.append(row);
        return row;
    }

    addRows(cellOptions: CBS_TableRowCellOptions[], data: any[]): CBS_TableRow[] {
        return data.map(d => {
            const r = this.addRow();
            for (const cell of cellOptions) {
                const c = r.addCell(cell.getData(d), cell);
            }
            return r;
        });;
    }
}

export class CBS_TableData extends CBS_Element {
    constructor(options?: CBS_TableRowCellOptions) {
        super(options);

        this.el = document.createElement('td');
    }

    set options(options: CBS_TableRowCellOptions) {
        super.options = options;

        if (options?.colspan) this.colspan = options.colspan;
        if (options?.rowspan) this.rowspan = options.rowspan;
        if (options?.scope) this.scope = options.scope;
    }

    get options(): CBS_TableRowCellOptions {
        return this._options as CBS_TableRowCellOptions;
    }

    set colspan(colspan: number) {
        this.el.setAttribute('colspan', colspan.toString());
    }

    get colspan(): number {
        return parseInt(this.el.getAttribute('colspan') || '');
    }

    set rowspan(rowspan: number) {
        this.el.setAttribute('rowspan', rowspan.toString());
    }

    get rowspan(): number {
        return parseInt(this.el.getAttribute('rowspan') || '');
    }

    set scope(scope: 'col' | 'row' | 'colgroup' | 'rowgroup') {
        this.el.setAttribute('scope', scope);
    }

    get scope(): 'col' | 'row' | 'colgroup' | 'rowgroup' {
        return this.el.getAttribute('scope') as 'col' | 'row' | 'colgroup' | 'rowgroup';
    }
}

export class CBS_TableHeader extends CBS_Element {
    constructor(options?: CBS_TableHeaderOptions) {
        super(options);

        this.el = document.createElement('th');
    }
}

export class CBS_TableHead extends CBS_Element {
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

export class CBS_TableFoot extends CBS_TableHead {
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

export class CBS_TableRow extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('tr');
    }

    addCell(content: CBS_Node, options?: CBS_TableRowCellOptions): CBS_TableData {
        const d = new CBS_TableData(options);
        d.append(content);
        this.append(d);
        return d;
    }
}


export type CBS_TableHeaderOptions = CBS_Options & {
    content: CBS_Node;
}




export class CBS_TableHeadRow extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('tr');
    }

    addHeader(content: CBS_Node, options?: CBS_TableHeaderOptions): CBS_TableHeader {
        const d = new CBS_TableHeader(options);
        d.append(content);
        this.append(d);
        return d;
    }

    addHeaders(...headers: CBS_TableHeaderOptions[]): CBS_TableHeader[] {
        return headers.map(c => {
            const h = this.addHeader(c.content, c);
            return h;
        });
    }
}


export class CBS_TableFootRow extends CBS_TableHeadRow {
    constructor(options?: CBS_Options) {
        super(options);
    }
}


export class CBS_TableCaption extends CBS_Text {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('caption');
    }
}

export class CBS_SubTable extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('table');
        this.addClass('table');
    }
}

export class CBS_Table extends CBS_Component {
    static fromHTML(table: HTMLTableElement) {}

    
    fromData<T>(data: T[]): CBS_Table {
        if (!data.length) throw new Error('No data. To use this method, there must be at least one element in the array.');

        const table = CBS.createElement('table');

        const isArray = Array.isArray(data[0]);

        const headers = isArray ? data[0] as any[] : Object.keys(data[0] as object);

        const thead = table.addHead();
        thead.addRow().addHeaders(...headers.map(h => ({ content: h })));

        const tbody = table.addBody();
        tbody.addRows(
            headers.map((h, i) => {
                if (isArray) return {
                    getData: (d: any) => d[i]
                };
                else return {
                    getData: (d: any) => d[h]
                }
            })
            , data);

        return table;
    }


    subcomponents: {
        table: CBS_SubTable;
    }
    buildData?: {
        headers: CBS_TableHeaderOptions[],
        rows: CBS_TableRowCellOptions[],
        data: any[]
    } = {
        headers: [],
        rows: [],
        data: []
    };

    constructor(options?: CBS_TableOptions) {
        super();

        this.el = document.createElement('div');
        if (options?.responsive) this.addClass('table-responsive');

        this.subcomponents = {
            table: new CBS_SubTable(options)
        }

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











    build(headers: CBS_TableHeaderOptions[], rows: CBS_TableRowCellOptions[], data: any[]): { headers: CBS_TableHeader[], body: CBS_TableBody } {
        if (!this.buildData) {
            this.buildData = {
                headers,
                rows,
                data
            };
        }
        const head = this.addHead();
        const _headers = head.addRow().addHeaders(...headers);

        const body = this.addBody();
        body.addRows(rows, data);

        return {
            headers: _headers,
            body: body
        }
    }

    update(data?: any[]) {
        if (!this.buildData) return console.error('No build data');

        if (data) this.buildData.data = data;
        this.build(
            this.buildData.headers,
            this.buildData.rows,
            this.buildData.data
        );
    }
}



CBS.addElement('table', CBS_Table);