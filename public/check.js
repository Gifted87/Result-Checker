// Path to your CSV file
const csvFilePath = 'http://localhost:3000/data.csv';

window.onload = function() {
    fetch(csvFilePath)
        .then(response => response.text())
        .then(data => parseCSV(data));
};

function parseCSV(data) {
    const rows = data.split('\n').map(row => row.split(','));

    // Extract the headers
    const headers = rows[0];

    // Extract the rest of the rows (data)
    const tableBody = rows.slice(1);

    generateTable(headers, tableBody);
}

function generateTable(headers, tableBody) {
    const tableHead = document.querySelector('#data-table thead');
    const tableBodyElement = document.querySelector('#data-table tbody');

    // Generate table headers
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header.trim();
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Generate table rows
    tableBody.forEach(row => {
        const rowElement = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell.trim();
            rowElement.appendChild(td);
        });
        tableBodyElement.appendChild(rowElement);
    });
}

function printPage() {
    window.print();
}
