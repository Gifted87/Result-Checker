const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files from the 'public' folder

// File paths
const formFilePath = path.join(__dirname, "/public/data.csv");
const nameFilePath = path.join(__dirname, "/public/names.csv");
const pinsFilePath = path.join(__dirname, "pins.csv");
const recordsFilePath = path.join(__dirname, "records.csv");
const dataFilePath = path.join(__dirname, "/public/data.csv");

// Logger
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Helper Function: Check if a PIN is valid
function isPinValid(pin) {
  try {
    log(`Checking validity of PIN: ${pin}`);
    if (!fs.existsSync(pinsFilePath)) {
      log("PIN file not found.");
      return false;
    }
    const pins = fs
      .readFileSync(pinsFilePath, "utf8")
      .split("\n")
      .map((line) => line.trim());
    const isValid = pins.includes(pin);
    log(`PIN validity: ${isValid}`);
    return isValid;
  } catch (error) {
    log(`Error reading PIN file: ${error.message}`);
    return false;
  }
}

// Helper Function: Process the records CSV for PIN usage
function processPinAndInputs(pin, inputs) {
  const { name, class: className, session, term } = inputs;
  log(`Processing PIN: ${pin} with inputs: ${JSON.stringify(inputs)}`);

  try {
    if (!fs.existsSync(recordsFilePath)) {
      log("Records file not found. Creating a new one.");
      fs.writeFileSync(recordsFilePath, "");
    }
    const records = fs
      .readFileSync(recordsFilePath, "utf8")
      .split("\n")
      .map((line) => line.trim());
    log(`Loaded ${records.length} records from records.csv`);

    let recordFound = false;
    const updatedRecords = records.map((line) => {
      const [csvPin, csvName, csvClass, csvSession, csvTerm, csvCount] =
        line.split(",");

      if (
        csvPin === pin &&
        csvName === name &&
        csvClass === className &&
        csvSession === session &&
        csvTerm === term
      ) {
        recordFound = true;
        const count = parseInt(csvCount, 10);
        log(`Matching record found. Current usage count: ${count}`);
        if (count >= 5) {
          log("Failed to process PIN inputs or usage limit exceeded.");
          return res
            .status(400)
            .json({ success: false, message: "PIN usage limit exceeded." });
          // log("PIN usage limit exceeded.");
          // return line;
        }
        log("Incrementing PIN usage count.");
        return `${csvPin},${csvName},${csvClass},${csvSession},${csvTerm},${
          count + 1
        }`;
      } else if (csvPin === pin) {
        log("PIN has been used by someone else.");
        return res.status(400).json({
          success: false,
          message: "PIN has been used by someone else.",
        });
      }
      return line;
    });

    if (recordFound) {
      fs.writeFileSync(recordsFilePath, updatedRecords.join("\n"));
      log("Updated records.csv with incremented usage.");
      return true;
    }

    const newRecord = `${pin},${name},${className},${session},${term},1`;
    fs.appendFileSync(recordsFilePath, `${newRecord}\n`);
    log("Added a new record to records.csv.");
    return true;
  } catch (error) {
    log(`Error processing records: ${error.message}`);
    return false;
  }
}

// Helper Functions for CSV Handling
function parseCSV(csv, delimiter = ",") {
  log("Parsing CSV data.");
  const rows = csv.trim().split("\n");
  return rows.map((row) => row.split(delimiter));
}

function compareValues(col4, col5, col1, col2, value4, value5, value1, value2) {
  if (
    col4 < value4 ||
    (col4 === value4 && col5 < value5) ||
    (col4 === value4 && col5 === value5 && col1 < value1) ||
    (col4 === value4 && col5 === value5 && col1 === value1 && col2 < value2)
  ) {
    return -1;
  }
  if (
    col4 > value4 ||
    (col4 === value4 && col5 > value5) ||
    (col4 === value4 && col5 === value5 && col1 > value1) ||
    (col4 === value4 && col5 === value5 && col1 === value1 && col2 > value2)
  ) {
    return 1;
  }
  return 0;
}

function binarySearch(data, value4, value5, value1, value2) {
  log("Starting binary search.");
  let left = 0;
  let right = data.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const row = data[mid];
    const comparison = compareValues(
      row[3],
      row[4],
      row[0],
      row[1],
      value4,
      value5,
      value1,
      value2
    );

    if (comparison === 0) {
      log(`Binary search found a matching row: ${row}`);
      return row;
    } else if (comparison < 0) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  log("Binary search did not find a matching row.");
  return null;
}

// Endpoint 1: Validate PIN and fetch CSV row
app.post("/validate", (req, res) => {
  const { pin, name, class: className, session, term } = req.body;
  log(
    `Received validation request for PIN: ${pin}, name: ${name}, class: ${className}, session: ${session}, term: ${term}`
  );

  if (!isPinValid(pin)) {
    log("Invalid PIN provided.");
    return res.status(400).json({ success: false, message: "Invalid PIN." });
  }

  const success = processPinAndInputs(pin, {
    name,
    class: className,
    session,
    term,
  });
  if (!success) {
    log("Failed to process PIN inputs or usage limit exceeded.");
    return res
      .status(400)
      .json({ success: false, message: "PIN usage limit exceeded." });
  }

  try {
    log("Reading data.csv for matching row.");
    const csvData = fs.readFileSync(dataFilePath, "utf8");
    let rows = parseCSV(csvData);

    const value4 = name.toUpperCase();
    const value5 = className.toUpperCase();
    const value1 = session.toUpperCase();
    const value2 = term.toUpperCase();

    log("Sorting CSV rows.");
    rows.sort((a, b) =>
      compareValues(a[3], a[4], a[0], a[1], b[3], b[4], b[0], b[1])
    );

    log("Performing binary search on sorted rows.");
    const result = binarySearch(rows, value4, value5, value1, value2);

    if (result) {
      log(`Matching row found: ${result}`);
      // return res.redirect(`http://localhost:3000/check.html?data=${encodeURIComponent(result)}`);
      return res.status(200).json({ success: true, data: result });
    } else {
      log("No matching row found.");
      return res
        .status(404)
        .json({ success: false, message: "No matching record found." });
    }
  } catch (error) {
    log(`Error during CSV processing: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

// Endpoint 2: Handle detailed form submission
app.post("/submit", (req, res) => {
  console.log("[DEBUG] /submit endpoint called. Request Body:", req.body);

  const {
    session,
    term: schoolTerm,
    next_term,
    name,
    class: studentClass,
    student_id,
    attendance,
    days_absent,
    sex: studentSex,
    no_of_subjects,
    total_score,
    students_average,
    class_average,
    position_in_class,
    out_of,
    neatness,
    punctuality,
    sense_of_responsibility,
    teamwork,
    initiatiave,
    communication_skills,
    musical_skills,
    sports,
    craft,
    hardworking,
    teachers_remark,
    head_remark,
    subjects,
  } = req.body;

  const row = [
    session,
    schoolTerm,
    next_term,
    name,
    studentClass,
    student_id,
    attendance,
    days_absent,
    studentSex,
    no_of_subjects,
    total_score,
    students_average,
    class_average,
    position_in_class,
    out_of,
    neatness,
    punctuality,
    sense_of_responsibility,
    teamwork,
    initiatiave,
    communication_skills,
    musical_skills,
    sports,
    craft,
    hardworking,
    teachers_remark,
    head_remark,
    ...subjects.flatMap((subject) => [
      subject.subject,
      subject.test,
      subject.exam,
      subject.total,
      subject.grade,
      subject.remark,
    ]),
  ]
    .map((field) => (typeof field === "string" ? field.toUpperCase() : field)) // Convert strings to uppercase
    .join(",");

  console.log(`[DEBUG] Processed Row for CSV: ${row}`);

  // Append data to the main form CSV file
  fs.appendFile(formFilePath, `${row}\n`, (err) => {
    if (err) {
      console.error("[ERROR] Failed to write to form file:", err);
      return res.status(500).send("Error writing to form file");
    }

    // Read the names file to check if the name is already present
    fs.readFile(nameFilePath, "utf8", (err, data) => {
      if (err) {
        console.error("[ERROR] Failed to read names file:", err);
        return res.status(500).send("Error reading names file");
      }

      // Check if the name already exists in the file
      const namesList = data.split("\n");
      const nameExists = namesList.includes(name.toUpperCase());

      if (nameExists) {
        console.log("[INFO] Name already exists, not adding to names.csv.");
        return res
          .status(200)
          .send("Data saved successfully, but name already exists.");
      }

      // If name doesn't exist, append it to the names file
      fs.appendFile(nameFilePath, `${name.toUpperCase()}\n`, (err) => {
        if (err) {
          console.error("[ERROR] Failed to write to names file:", err);
          return res.status(500).send("Error writing name to file");
        }
        console.log("[INFO] Name saved successfully to names.csv.");
        res.status(200).send("Data saved successfully");
      });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  log(`Server is running on http://localhost:${PORT}`);
});
