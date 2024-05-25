/* Il json-object qui di seguito contiene come chiavi il titolo della DIV del form (che corrisponde anche al titolo
 * della colonna nella tabella CONNESSIONE_QUESTIONARI dopo aver aggiunto ID_ all'inizio), e come valore il nome
 * della tabella che contiene i valori che devono essere mostrati nel form.
 */


    export const FormArchitecture = {
        "FASCIA_ETA": {name: "FASCIA_ETA", table: "FASCIA_ETA", question: "Seleziona la tua fascia di età"},
        "GENERE": {name: "GENERE", table: "GENERE", question: "Seleziona il tuo genere"},
        "EDUCAZIONE": {name: "EDUCAZIONE", table: "LIVELLO_EDUCAZIONE", question: "Qual è il tuo livello di educazione?"},
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

export function getNewspaperByUrl(url) {
    const query = `SELECT * FROM GIORNALI WHERE '${url}' LIKE CONCAT('%', LINK, '%');`;
    console.log(query);
    return runQuery(query).then(result => {
        if (result.rows == 0) return null;
        console.log(result);
        return result.query_result[0].ID_GIORNALE;
    });
}