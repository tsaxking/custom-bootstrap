# CBS_Table

The `CBS_Table` class is capable of having multiple `<thead>`s and `<tbody>`s, and can be created with the following syntax:


```typescript
const table = CBS.createElement('table'); // CBS_Table

const thead = table.addHead(); // CBS_TableHead
const tbody = table.addBody(); // CBS_TableBody
const tfoot = table.addFoot(); // CBS_TableFoot
const caption = table.addCaption(); // CBS_TableCaption

// header rows use .addHeader()
const headers = thead.addRow();
headers.addHeader('Header 1');
headers.addHeader('Header 2');
headers.addHeader('Header 3');

// data rows use .addCell()
const row1 = tbody.addRow();
row1.addCell('Cell 1');
row1.addCell('Cell 2');
row1.addCell('Cell 3');

const row2 = tbody.addRow();
row2.addCell('Cell 4');
row2.addCell('Cell 5');
row2.addCell('Cell 6');
```

Every method returns the element it is creating, so you can easily build a table:


## Example

Here is the data we want to display
```typescript
const players = [{
    name: 'John',
    age: 20,
    score: 100
}, {
    name: 'Jane',
    age: 21,
    score: 200
}, {
    name: 'Jack',
    age: 22,
    score: 300
}];
```
Here is the output we want:
```html
<table class="table">
    <thead>
        <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Score</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>John</td>
            <td>20</td>
            <td>100</td>
        </tr>
        <tr>
            <td>Jane</td>
            <td>21</td>
            <td>200</td>
        </tr>
        <tr>
            <td>Jack</td>
            <td>22</td>
            <td>300</td>
        </tr>
    </tbody>
</table>
```


This is how you would build the table using `CBS_Table`:
```typescript
const table = CBS.createElement('table');
const header = table.addHead().addRow();
header.addHeader('Name');
header.addHeader('Age');
header.addHeader('Score');

for (const player of players) {
    const row = table.addBody().addRow();

    row.addCell(player.name);
    row.addCell(player.age);
    row.addCell(player.score);
}
```

To build the same table using the native DOM API, you would have to do the following:
```javascript
const table = document.createElement('table');
table.classList.add('table');
const thead = document.createElement('thead');
const tbody = document.createElement('tbody');

const headerRow = document.createElement('tr');
const header1 = document.createElement('th');
const header2 = document.createElement('th');
const header3 = document.createElement('th');

header1.textContent = 'Name';
header2.textContent = 'Age';
header3.textContent = 'Score';

headerRow.appendChild(header1);
headerRow.appendChild(header2);
headerRow.appendChild(header3);

thead.appendChild(headerRow);

for (const player of players) {
    const row = document.createElement('tr');

    const data1 = document.createElement('td');
    const data2 = document.createElement('td');
    const data3 = document.createElement('td');

    data1.textContent = player.name;
    data2.textContent = player.age;
    data3.textContent = player.score;

    row.appendChild(data1);
    row.appendChild(data2);
    row.appendChild(data3);

    tbody.appendChild(row);
}

table.appendChild(thead);
table.appendChild(tbody);
```


It's pretty obvious which one is easier to read, understand, and as a result, maintain.