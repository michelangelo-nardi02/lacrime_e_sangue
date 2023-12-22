// provandoci di nuovo 

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  var url = activeTab.url;

   var domains = [];
domains.push(["www.corriere.it", 1]);
domains.push(["www.ilsole24ore.com", 2]);
domains.push(["www.ilpost.it", 3]);
domains.push(["www.laverità.info", 4]);
domains.push(["www.internazionale.it", 5]);
domains.push(["www.ilfoglio.it", 6]);
domains.push(["www.unita.it", 7]);
domains.push(["www.ilmanifesto.it", 8]);
domains.push(["www.lespresso.it", 9]);
domains.push(["www.lastampa.it", 10]);
domains.push(["www.italiaoggi.it", 11]);
domains.push(["www.avvenire.it", 12]);
domains.push(["www.quotidiano.net", 13]);
domains.push(["www.ilmessaggero.it", 14]);
domains.push(["www.ilmattino.it", 15]);
domains.push(["www.ilrestodelcarlino.it", 16]);
domains.push(["www.liberoquotidiano.it", 17]);
domains.push(["www.repubblica.it", 18]);
domains.push(["www.ilgiornale.it", 19]);
domains.push(["www.ilfattoquotidiano.it", 20]);

  function checkDomains(domains, url) {
    for (var index = 0; index < domains.length; ++index) {
      var domainString = domains[index][0];
      var domainID = domains[index][1];
      if (url.includes(domainString)) {
        return domainID;
      }
    }
    return -1;
  }

  const domainID = checkDomains(domains, url);

  if (domainID >= 0) {
    console.log(`Corrispondenza trovata per il dominio con ID ${domainID}`);
    // Esegui l'azione relativa al dominio trovato qui
  } else {
    console.log('Nessuna corrispondenza trovata per il dominio attuale.');
  }

  // Visualizza il contenuto della pagina nell'elemento HTML
  document.getElementById("htmlContent").innerText = url;
});
