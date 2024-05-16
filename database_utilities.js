/* Il json-object qui di seguito contiene come chiavi il titolo della DIV del form (che corrisponde anche al titolo
 * della colonna nella tabella CONNESSIONE_QUESTIONARI dopo aver aggiunto ID_ all'inizio), e come valore il nome
 * della tabella che contiene i valori che devono essere mostrati nel form.
 */
    export const FormArchitecture = {
        "FASCIA_ETA": "FASCIA_ETA",
        "GENERE": "GENERE",
        "EDUCAZIONE": "LIVELLO_EDUCAZIONE",
        "OP_PERSONALE": "ORIENTAMENTO_POLITICO",
        "OP_GIORNALE": "ORIENTAMENTO_POLITICO",
        "REGIONI": "REGIONI"
    }
    export async function runQuery(sqlQuery) {
        // We are saving as 'serverURL' the link of the server
        const serverURL = 'http://nardinan.ddns.net:6664'; 
        // Here we are defining the 'options' object that will be configuring the HTTP request to be a POST request, 
        // specifying that the content is in JSON format, and providing the SQL query in the request body.
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
           },
           body: JSON.stringify({ query: sqlQuery }),
        };
        // Now we are making an asynchronous HTTP request, parsing the response body as JSON, and assigning the resulting data to the variable 'value'.
        const value = await fetch(serverURL, options)
          .then(response => response.json())
          .then(data => {
            return data;
          })
          // This snippet deals with any errors that may arise. 
          .catch(error => {
             console.error('There has been an issue following your request:', error);
          });
    
        return value;
      }

    export function checkDomains(container, url) {
        for (var index = 0; index < container.length; ++index) {
            // This is the link of the newspaper's home page (ex. www.panorama.it)
            var domainString = container[index][0];
            //This retrieves the ID (ex. 21)
            var domainID = container[index][1];
            //If the URL includes the domain string, it returns the domain ID; if no match is found,
            // it  returns -1
            if (url.includes(domainString)) {
              return domainID;
            }	
        }
        return -1;
    }
