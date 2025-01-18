// Path to your CSV file
const csvPath = './data.csv';
let csvData = [];

// Load and parse the CSV file
async function loadCSV() {
  try {
    const response = await fetch(csvPath);
    const text = await response.text();
    csvData = parseCSV(text);
    console.log('CSV data loaded:', csvData);
  } catch (error) {
    console.error('Error loading CSV:', error);
  }
}

// Parse CSV into an array of rows
function parseCSV(csv, delimiter = ',') {
  const rows = csv.trim().split('\n');
  return rows.map(row => row.split(delimiter));
}

// Perform binary search on the CSV data
function binarySearch(data, value4, value5, value1, value2) {
  let left = 0;
  let right = data.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const row = data[mid];
    const comparison = compareValues(row[3], row[4], row[0], row[1], value4, value5, value1, value2);

    if (comparison === 0) {
      return row;
    } else if (comparison < 0) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return null;
}

// Compare values for sorting and searching
function compareValues(col4, col5, col1, col2, value4, value5, value1, value2) {
  if (col4 < value4 || (col4 === value4 && col5 < value5) ||
      (col4 === value4 && col5 === value5 && col1 < value1) ||
      (col4 === value4 && col5 === value5 && col1 === value1 && col2 < value2)) {
    return -1;
  }
  if (col4 > value4 || (col4 === value4 && col5 > value5) ||
      (col4 === value4 && col5 === value5 && col1 > value1) ||
      (col4 === value4 && col5 === value5 && col1 === value1 && col2 > value2)) {
    return 1;
  }
  return 0;
}

// Search the CSV data based on user input
async function searchCSV() {
  const value4 = document.getElementById('name').value.trim().toUpperCase();
  const value5 = document.getElementById('class').value.trim().toUpperCase();
  const value1 = document.getElementById('session').value.trim().toUpperCase();
  const value2 = document.getElementById('term').value.trim().toUpperCase();

  if (!value4 || !value5 || !value1 || !value2) {
    alert('Please provide all four inputs.');
    return;
  }

  if (!csvData.length) {
    alert('CSV data is not loaded yet.');
    return;
  }

  // Sort the data by 4th, 5th, 1st, and 2nd columns
  csvData.sort((a, b) => compareValues(a[3], a[4], a[0], a[1], b[3], b[4], b[0], b[1]));

  // Perform the binary search
  const result = binarySearch(csvData, value4, value5, value1, value2);

  if (result) {
    console.log('Row found:', result);
    alert(`Row found: ${result.join(', ')}`);
  } else {
    console.log('No matching row found.');
    alert('No matching row found.');
  }
}

// Load the CSV file on page load
window.onload = loadCSV;
