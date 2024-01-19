//Defining the SQL Query that will be executed
function eseguiQuerySQL(sqlQuery) {
// Server URL: this is the server to which the HTTP request will be sent
  const serverURL = 'http://nardinan.ddns.net:6667'; // 
  
// An object named options is declared, which holds the options for the HTTP request. 
//The request will be of type POST and will send data in JSON format, including the provided SQL query as part of the request body.
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sqlQuery }), // Invio della query SQL al server
  };
  
// The fetch() function is used to execute the HTTP request to the server with the specified options. 
// The responses are converted to JSON format, and the query results are printed
  fetch(serverURL, options)
    .then(response => response.json())
    .then(data => {

// Gestiamo i risultati della query ricevuti dal server
      console.log('Risultati della query:', data);
// Results
    })

// Defining a protocol to catch errors using catch(), any error will be signaled, thus printed on the console
    .catch(error => {
      console.error('Si è verificato un errore durante la richiesta:', error);
    });
}

//Trying our function: we want to select LINK from the table GIORNALI, in which the value of ESTREMASINISTRA is equal to 1
const queryDaEseguire = 'SELECT LINK FROM GIORNALI WHERE (ESTREMASINISTRA=1)';
//Executing the request
eseguiQuerySQL(queryDaEseguire);



