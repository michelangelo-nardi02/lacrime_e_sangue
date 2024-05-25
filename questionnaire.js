import { FormArchitecture, runQuery } from "./database_utilities.js";

document.addEventListener("DOMContentLoaded", () => {
    function createForm() {
        Object.keys(FormArchitecture).forEach(function (selectEntryId) {
            const querySelect = "SELECT * FROM " + FormArchitecture[selectEntryId].table + ";";
            runQuery(querySelect)
            .then(payload => {
                const nameColumnValue = "ID_" + FormArchitecture[selectEntryId].table;
                const nameColumnDescription = "DESCRIZIONE";

                if (payload.rows > 0) {
                    const divName = selectEntryId + "_DIV";
                    let generatedHtml = `<label for="${FormArchitecture[selectEntryId].name}">${FormArchitecture[selectEntryId].question}</label><br>
                                         <select id="${FormArchitecture[selectEntryId].name}" name="${FormArchitecture[selectEntryId].name}">`;
                    generatedHtml+='<option value="0"> Seleziona </option>';
                    for (let index = 0; index < payload.rows; ++index) {
                        const numericValue = payload.query_result[index][nameColumnValue];
                        const humanReadableDescription = payload.query_result[index][nameColumnDescription];
                        generatedHtml += `<option value="${numericValue}">${humanReadableDescription}</option>`;
                    }

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

    async function insertSurvey(answers, newspaperID) {
        var sql = "INSERT INTO CONNESSIONE_QUESTIONARIO (";
        var columns = answers.map(function(item) { return item[0]; });
        sql += columns.join(", ");
        sql += ", ID_GIORNALE, DATA_CREAZIONE_TOKEN, TOKEN, SUBMIT, PROCESSED, COOKIE_ID) VALUES (";
        var values = answers.map(function(item) { return "'" + item[1] + "'"; });
        sql += values.join(", ");
        sql += ", '" + newspaperID + "', NOW(), 'unused', 0, 0, 'unused')";
      
        console.log(sql);
        await runQuery(sql);
      }

    function submitForm() {
        var form = document.getElementById("primaryForm");
        var answers = [];

        var allAnswered = true;
        try {
            Object.keys(FormArchitecture).forEach(function (selectEntryId) {
                var selectedOption = form.querySelector('#' + selectEntryId).value;
                const selectedOptionCasted = Number(selectedOption);

                if (isNaN(selectedOptionCasted)) {
                    alert("Attenzione! Il form è stato compromesso!");
                    allAnswered = false;
                    throw BreakException;
                }

                if (selectedOptionCasted === 0) {
                    alert("Attenzione, tutte le domande obbligatorie devono essere compilate!");
                    allAnswered = false;
                    throw BreakException;
                }

                answers.push([FormArchitecture[selectEntryId].name, selectedOptionCasted]);
            });
            console.log(answers);
            
            // Access the parameter we passed in the URL from the popup
            const params = new URLSearchParams(window.location.search);
            const newspaperID = params.get("nid");
            insertSurvey(answers, newspaperID).then(() =>
                window.close()
            );
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