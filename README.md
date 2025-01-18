## Secondary School Result Checker System for Nigerians

This project provides a web-based system for entering and retrieving student results for Secondary Schools in Nigeria. It allows authorized personnel to input detailed student performance data, including academic scores, affective and psychomotor skills assessments, and remarks. Students (or parents) can then access their results using a unique PIN, ensuring data privacy and security.

### Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
    * [Data Entry](#data-entry)
    * [Result Retrieval](#result-retrieval)
5. [File Structure](#file-structure)
6. [Technologies Used](#technologies-used)
7. [Data Flow](#data-flow)
8. [Security Considerations](#security-considerations)
9. [Error Handling](#error-handling)
10. [Future Enhancements](#future-enhancements)
11. [Contributing](#contributing)
12. [License](#license)
13. [Contact](#contact)


### 1. Introduction

The Result Checker simplifies the process of managing student results.  It eliminates the need for manual result compilation and distribution, offering a secure and efficient digital solution.

### 2. Features

* **Detailed Result Entry:**  Capture comprehensive student information, including subject-specific scores, grades, remarks, attendance, and extra-curricular activities.
* **Secure Result Retrieval:** Students can access their results using a unique PIN, ensuring data privacy and preventing unauthorized access.
* **PIN Usage Limit:** Each PIN has a limited number of uses to prevent abuse.
* **User-Friendly Interface:**  Intuitive forms for easy data entry and clear result presentation.
* **Searchable Student Database:** Quickly locate students by name for result retrieval.
* **Printable Reports:** Generate print-friendly reports for official documentation.
* **Responsive Design:** Accessible on various devices (desktops, tablets, and smartphones).


### 3. Installation

1. **Clone the repository:** `git clone https://github.com/your-username/result-checker.git`
2. **Navigate to the project directory:** `cd result-checker`
3. **Install dependencies:** `npm install`


### 4. Usage

#### 4.1 Data Entry

1. Open `entry.html` in your web browser.
2. Fill in the student's information, including academic scores for each subject.  Click "+ Add Another Subject" to add more subjects as needed.
3. Verify the information and click "Submit."
4. The data is saved to `data.csv`, and the student's name is added to `names.csv` if it doesn't already exist.


#### 4.2 Result Retrieval

1. Open `index.html` in your web browser.
2. Start typing the student's name in the search field. The system will automatically suggest names from the database.
3. Select the student's name, class, session, term and enter the unique PIN provided by the school.
4. Click "Search."
5. If the PIN is valid and the information matches, the student's result will be displayed on `report.html`.




---

## Page 2 of README


### 5. File Structure

```
result-checker/
├── public/
│   ├── check.js             // JavaScript for displaying data in a table
│   ├── data.csv             // CSV file storing student results
│   ├── entry.html           // HTML form for data entry
│   ├── index.html           // HTML page for result retrieval
│   ├── names.csv            // CSV file storing student names for autocompletion
│   ├── pinscript.js         // JavaScript file for validating pins, (currently not in use)
│   ├── report.html          // HTML page to display the student report
│   └── styles.css           // CSS styling for the web pages
├── pins.csv                // CSV file containing valid PINs
├── records.csv             // CSV file logging PIN usage
├── package.json           // Node.js project dependencies
├── package-lock.json      // Lockfile for dependency versions
└── server.js              // Server-side logic (Node.js/Express)
```

### 6. Technologies Used

* **Node.js:** Server-side runtime environment.
* **Express.js:** Web framework for Node.js.
* **HTML, CSS, JavaScript:** Front-end development.
* **CSV:** Data storage and manipulation.
* **Body-parser:** Middleware for parsing request bodies.



### 7. Data Flow

1. **Data Entry:** Data is entered via `entry.html` and sent to the server using a POST request to `/submit`.
2. **Server Processing:** The server appends the data to `data.csv` and adds the student's name to `names.csv`.
3. **Result Retrieval:** The user enters search criteria and a PIN on `index.html` and sends a POST request to `/validate`.
4. **PIN Validation:** The server checks if the PIN is valid and its usage count.
5. **Data Retrieval:**  If the PIN is valid, the server searches `data.csv` for the matching student record.
6. **Result Display:** The server returns a JSON response with the matching result's data. The client uses this to redirect to `report.html`, which displays the result.

### 8. Security Considerations

* **PIN System:**  The PIN system acts as a basic authentication mechanism, restricting access to student results.
* **PIN Usage Limit:** Limits the number of times a PIN can be used to prevent unauthorized access.
* **Server-Side Validation:** All validations are performed on the server-side to prevent client-side manipulation.
* **Data Storage:** Sensitive data should be stored securely.  Consider database encryption and secure server configurations for production environments.

### 9. Error Handling

The server implements error handling for various scenarios:

* **Invalid PIN:** Returns a 400 error with a message.
* **PIN Usage Limit Exceeded:** Returns a 400 error.
* **No Matching Record:** Returns a 404 error.
* **Server Errors:** Returns a 500 error for internal server issues.

### 10. Future Enhancements

* **Improved Search:** Implement more robust search functionality.
* **User Authentication:** Add user roles and authentication for data entry personnel.
* **Database Integration:** Replace CSV storage with a database for better scalability and data management.
* **Result Generation:**  Automate result calculations and grading.
* **Report Customization:** Allow customization of report formats.


### 11. Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

### 12. License

This project is licensed under the MIT License.

### 13. Contact


For any questions or inquiries, please contact Braimah Gifted at braimahgifted@gmail.com.
