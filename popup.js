// the extension interacts with the current window
chrome.tabs.query({ active: true, currentWindow: true }, 
  // this function retrives the open window with the index 0 and sends a message to obtain the html
  function (tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { message: "get_html" }, function (response) {
    // <a href="www.domain.it">text message</a>
    //// da aggiungere tutti i giornali
   var domains = [];
domains.push(["www.corriere.it", 1]);
domains.push(["www.ilsole24ore.com", 2)];
domains.push(["www.ilpost.it", 3)];
domains.push(["www.laverità.info", 4)];
domains.push(["www.internazionale.it", 5)];
domains.push(["www.ilfoglio.it", 6)];
domains.push(["www.unita.it", 7)];
domains.push(["www.ilmanifesto.it", 8)];
domains.push(["www.lespresso.it", 9)];
domains.push(["www.lastampa.it", 10)]
domains.push(["www.italiaoggi.it", 11]);
domains.push(["www.avvenire.it", 12])
  domains.push(["www.quotidiano.net", 13]);
  domains.push(["www.ilmessaggero.it", 14]);
   domains.push(["www.ilmattino.it", 15]);
  domains.push(["www.ilrestodelcarlino.it", 16]);
   domains.push(["www.liberoquotidiano.it", 17]);
  domains.push(["www.repubblica.it", 18]);
   domains.push(["www.ilgiornale.it", 19]);
  domains.push(["www.ilfattoquotidiano.it", 20]);
    
    var ID = checkDomains(domains);

    console.log("Check links: " + response.links_page);
    document.getElementById("htmlContent").innerText = response.links_page;
  });
});
