// This files stores some useful elements for the functioning of the extension. 
// It stores a node with the names, tables and questions - clarifying the relationship between tables, questions and names to facilitate the dialogue between the html and SQL.
// It stores the SQL query.
// It stores the function to retrieve the newspaper ID.

//This element contains the name (used to build the div), the corresponding table and question for each question
    export const FormArchitecture = {
        "FASCIA_ETA": {
            name: "FASCIA_ETA", 
            table: "FASCIA_ETA", 
            question: "Seleziona la tua fascia di età"},
        
        "GENERE": {
            name: "GENERE", 
            table: "GENERE", 
            question: "Seleziona il tuo genere"},
        
        "EDUCAZIONE": {
            name: "EDUCAZIONE", 
            table: "LIVELLO_EDUCAZIONE", 
            question: "Qual è il tuo livello di educazione?"},
        
        "OP_PERSONALE": {
            name: "OP_PERSONALE",
            table: "ORIENTAMENTO_POLITICO",
            question: "Esprimi il tuo orientamento politico"
        },
        
        "OP_GIORNALE": {
            name: "OP_GIORNALE",
            table: "ORIENTAMENTO_POLITICO",
            question: "Qual è la tua opinione sul giornale?"
        },
        "REGIONI": {name: "REGIONI", table: "REGIONI", question: "Qual é la tua regione di appartenenza?"}
    };

// SQL query
export async function runQuery(sqlQuery) {
    try {
        // First of all, we want to define the server and the request
        const serverURL = 'http://nardinan.ddns.net:6664';
        // Configuring the HTTP request to the server as for getStatistics()
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: sqlQuery }),
        };
        // We execute the HTTP request and frame our response as JSON
        const response = await fetch(serverURL, options);
        const data = await response.json();
        // Returning the data obtained from the server
        return data;
    } catch (error) {
        console.error('Error while executing SQL query:', error);
        throw error;
    }
}

// Function to retrieve newspaper ID from url
export function getNewspaperByUrl(url) {
    
    // Construct the SQL query to select all columns from the GIORNALI table
    // where the provided URL contains the LINK from the table
    const query = `SELECT * FROM GIORNALI WHERE '${url}' LIKE CONCAT('%', LINK, '%');`;

    // Log the constructed query to the console for debugging purposes
    console.log(query);

    // Execute the query using the runQuery function
    return runQuery(query).then(result => {
        // Check if the query returned any rows
        if (result.rows == 0) return null;

        // Log the result of the query to the console for debugging purposes
        console.log(result);

        // Return the ID_GIORNALE from the first result row
        return result.query_result[0].ID_GIORNALE;
    });
}
