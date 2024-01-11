// Ottieni il csv
  const csvURL = chrome.runtime.getURL('GIORNALI.csv');
  
  console.log(csvURL); 
  
  

  fetch(csvURL)
    .then(response => response.text())
    .then(csvData => {
      // Separare i dati del CSV 
      var rows = csvData.split('\n');
      var domains = [];
      
      for (var row of rows) {
        // Separare la riga in diverse colonne
        var columns = row.split(';');
        // Estrarre i primi e i secondi elementi delle righe
        var domainID = columns[0];
        var domainString = columns[1];

        domains.push([domainString, domainID]); 
        
        }
        
        console.log(domains);
        
        
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
        
        // Individua scheda attiva, stora l'url nella var url
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        
            var url;
            var activeTab;
        
            
            activeTab = tabs[0];
            url = activeTab.url;
            
            console.log(url);
            
            
            const domainID_Check = checkDomains(domains, url);
            
            console.log(domainID_Check);  //test su ilpost.it dovrebbe ritornare il numero 3;

            
            // se domainID è maggiore/uguale a zero viene stampato l'id, o una frase che spiega il contrario
        if (domainID_Check >= 0) {
          console.log("Corrispondenza trovata per il dominio con ID", {domainID_Check});
          // Esegui l'azione relativa al dominio trovato qui
        } else {
          console.log('Nessuna corrispondenza trovata per il dominio attuale.');
        }
            
            document.getElementById("htmlContent").innerText = domainID_Check;
            
            
            
             });
})
