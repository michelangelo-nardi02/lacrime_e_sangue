// Funzione per la Query (versione con server)
function eseguiQuerySQL(sqlQuery) {
  // URL del server che gestirebbe le query (ancora non lo abbiamo)
  const serverURL = 'http://localhost:3000/query'; // 
  
  // Configurazione della richiesta HTTP
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sqlQuery }), // Invio della query SQL al server
  };
  
  // Proviamo a eseguire la richiesta HTTP con fetch()
  fetch(serverURL, options)
    .then(response => response.json())
    .then(data => {
      // Gestiamo i risultati della query ricevuti dal server
      console.log('Risultati della query:', data);
      // Risultati
    })

    // definiamo un protocollo per "catturare" gli errori
    .catch(error => {
      console.error('Si è verificato un errore durante la richiesta:', error);
    });
}

// Esempio tipo 
const queryDaEseguire = 'SELECT * FROM GIORNALI';
eseguiQuerySQL(queryDaEseguire);

// Selezione che avevamo fatto la scorsa volta prova
const queryDaEseguire = 'SELECT LINK FROM GIORNALI WHERE (ESTREMASINISTRA=1)';
eseguiQuerySQL(queryDaEseguire);

