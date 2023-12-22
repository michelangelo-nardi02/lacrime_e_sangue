// the extension interacts with the current window
chrome.tabs.query({ active: true, currentWindow: true }, 
  // this function retrives the open window with the index 0 and sends a message to obtain the html
  function (tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { message: "get_html" }, function (response) {
    // <a href="www.domain.it">text message</a>
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

  
    // create checkDomains function
    function checkDomains(domains) {
  var lengthArray = domains.length; // length of the array
  for (var index = 0; index < lengthArray; ++index) {
    var domainString = domains[index][0];
    var domainID = domains[index][1];
    // 1 - check if the domainString matches with the domain from the browser
    // 2 - return the ID of the domain that matches
  }
  // 3 - return -1 if the domain doesn't match with any domain in the list
  return -1;
}
    var ID = checkDomains(domains);

    

  const domainID = checkDomains(domains);

  if (domainID >= 0) {
    console.log(`Corrispondenza trovata per il dominio con ID ${domainID}`);
    // Qui puoi eseguire l'azione relativa al dominio trovato
  } else {
    console.log('Nessuna corrispondenza trovata per il dominio attuale.');
  }

    
    console.log("Check links: " + response.links_page);
    document.getElementById("htmlContent").innerText = response.links_page;
  });
});
