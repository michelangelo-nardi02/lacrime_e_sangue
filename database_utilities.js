// The JSON object below contains the form DIV title as keys (which also corresponds to the column title in the CONNESSIONE_QUESTIONARI table after adding ID_ at the beginning),
// and as values the name of the table that contains the values to be shown in the form.
export const FormArchitecture = {
  "FASCIA_ETA": "FASCIA_ETA",
  "GENERE": "GENERE",
  "EDUCAZIONE": "LIVELLO_EDUCAZIONE",
  "OP_PERSONALE": "ORIENTAMENTO_POLITICO",
  "OP_GIORNALE": "ORIENTAMENTO_POLITICO",
  "REGIONI": "REGIONI"
}

export async function runQuery(sqlQuery) {
  // We are saving the server link as 'serverURL'
  const serverURL = 'http://nardinan.ddns.net:6664'; 

  // Here we are defining the 'options' object that will configure the HTTP request as a POST request,
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
