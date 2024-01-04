// Individua scheda attiva, stora l'url nella var url
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  var url = activeTab.url;
  
chrome.runtime.onDomReady.addListener(function() {
  // Ottieni il csv
  const csvURL = chrome.runtime.getURL('GIORNALISTI.csv');

  // Qui al posto di copiare la lista manualmente come avevamo fatto è meglio accedere direttamente al csv. 
  // Per farlo ho modificato il manifest e qui dovremmo effettivamente estrarre id e string
  // Estrarre il contenuto del csv
  fetch(csvURL)
    .then(response => response.text())
    .then(csvData => {
      // Separare i dati del CSV 
      var rows = csvData.split('\n');
      for (var row of rows) {
        // Separare la riga in diverse colonne
        var columns = row.split(',');
        // Estrarre i primi e i secondi elementi delle righe
        var domainID = columns[0];
        var domainString = columns[1];
        var domains = []
        push.domains = ([domainString, domainID])

// crea una funzione "checkDomains" per confrontare elementi di domains e l'url della pagina
  function checkDomains(domains, url) {
    for (var index = 0; index < domains.length; ++index) {
      // con l'index 0 si ottiene il primo elemento della sottolista (ex. www.panorama.it)
      var domainString = domains[index][0];
      //con l'index 1 si ottiene l'ID (ex. 21)
      var domainID = domains[index][1];
      if (url.includes(domainString)) {
        return domainID;
      }
    }
    return -1;
  }
// chiama la funzione "checkDomains" con la lista "domains" e "url". Il risultato è stored "domainID"
  const domainID = checkDomains(domains, url);
  
// se domainID è maggiore/uguale a zero viene stampato l'id, o una frase che spiega il contrario
  if (domainID >= 0) {
    console.log(`Corrispondenza trovata per il dominio con ID ${domainID}`);
    // Esegui l'azione relativa al dominio trovato qui
  } else {
    console.log('Nessuna corrispondenza trovata per il dominio attuale.');
  }

  // Visualizza il contenuto della pagina nell'elemento HTML
  document.getElementById("htmlContent").innerText = url;
});
