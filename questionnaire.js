/**
 * This script dynamically creates a form based, handles form submissions by validating user inputs and inserting the data into a database.
 * It also includes error handling and user feedback mechanisms to ensure data integrity and user experience.
 */

// Import necessary functions and objects from the module
import { FormArchitecture, runQuery } from "./database_utilities.js";

// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // FormArchitecture is used to generate the form dynamically
    function createForm() {
        Object.keys(FormArchitecture).forEach(function (selectEntryId) {

            // Data is fetched with an SQL query
            // Definition of the query
            const querySelect = "SELECT * FROM " + FormArchitecture[selectEntryId].table + ";";

            // Running the query
            runQuery(querySelect)
                // Define two coloumns, with the value and description
                .then(payload => {
                    const nameColumnValue = "ID_" + FormArchitecture[selectEntryId].table;
                    const nameColumnDescription = "DESCRIZIONE";

                    // Generate the HTML for the form 
                    if (payload.rows > 0) {
                        const divName = selectEntryId + "_DIV";
                        let generatedHtml = `<label for="${FormArchitecture[selectEntryId].name}">${FormArchitecture[selectEntryId].question}</label><br>
                                         <select id="${FormArchitecture[selectEntryId].name}" name="${FormArchitecture[selectEntryId].name}">`;
                        generatedHtml += '<option value="0"> Seleziona </option>';

                        // Iterate over the query results to populate the select options
                        for (let index = 0; index < payload.rows; ++index) {
                            const numericValue = payload.query_result[index][nameColumnValue];
                            const humanReadableDescription = payload.query_result[index][nameColumnDescription];
                            generatedHtml += `<option value="${numericValue}">${humanReadableDescription}</option>`;
                        }

                        // Locate the generated HTML into the corresponding div element
                        generatedHtml += '</select>';
                        const targetDiv = document.getElementById(divName);
                        if (targetDiv) {
                            targetDiv.innerHTML = generatedHtml;
                        } else {
                            console.error(`Element with ID ${divName} not found.`);
                        }
                    }
                })
                .catch(error => {
                    console.error("Error running query:", error);
                });
        });
    }

    // Function to insert survey answers into the database
    async function insertSurvey(answers, newspaperID) {
        var sql = "INSERT INTO CONNESSIONE_QUESTIONARIO (";
        var columns = answers.map(function (item) { return item[0]; });
        // Define the SQL query for inserting the survey answers
        sql += columns.join(", ");
        sql += ", ID_GIORNALE, DATA_CREAZIONE_TOKEN, TOKEN, SUBMIT, PROCESSED, COOKIE_ID) VALUES (";
        var values = answers.map(function (item) { return "'" + item[1] + "'"; });
        sql += values.join(", ");
        sql += ", '" + newspaperID + "', NOW(), 'unused', 0, 0, 'unused')";

        // Execute the SQL query
        await runQuery(sql);
    }

    // Function to manage form submission
    function submitForm() {
        var form = document.getElementById("primaryForm");
        var answers = [];

        var allAnswered = true;
        try {
            // Iterate over each entry in the FormArchitecture object to validate and collect answers
            Object.keys(FormArchitecture).forEach(function (selectEntryId) {
                var selectedOption = form.querySelector('#' + selectEntryId).value;
                const selectedOptionCasted = Number(selectedOption);

                // Check validity of answers
                if (isNaN(selectedOptionCasted)) {
                    alert("Attenzione! Il form è stato compromesso!");
                    allAnswered = false;
                    throw BreakException;
                }

                // Check that all questions have been answered
                if (selectedOptionCasted === 0) {
                    alert("Attenzione, tutte le domande obbligatorie devono essere compilate!");
                    allAnswered = false;
                    throw BreakException;
                }

                // Add the answer to the answers array
                answers.push([FormArchitecture[selectEntryId].name, selectedOptionCasted]);
            });

            // Access the parameter we passed in the URL from the popup, close the survey page and open a "thanks" page
            const params = new URLSearchParams(window.location.search);
            const newspaperID = params.get("nid");
            insertSurvey(answers, newspaperID).then(() => {
                window.close();
                window.open('thanks.html', '_blank');
            });
        } catch (e) { }
    }

    // Add event listener to the submit button
    const submitButton = document.querySelector('.invia-button');
    if (submitButton) {
        submitButton.addEventListener('click', submitForm);
    } else {
        console.error("Element with class 'invia-button' not found.");
    }

    createForm();
});
