var EVENT_DOM_CONTENT_LOADED = 'DOMContentLoaded';

function getGreetingId() {
  return 'greeting';
}

function getGreeting() {
  return "Una semplice estensione di prova, realizzata 'senza il minimo problema' e 'capendo tutto istantaneamente'. Ho trovato l'estensione originale su github -- Ho finalmente capito come funzioni manifest, e come si aggiungano estensioni a Chrome. Poco ma buono, direi";
}

function getGreetingElement() {
  return document.getElementById(getGreetingId());
}

function renderGreeting() {
  getGreetingElement().textContent = getGreeting();
}
//ma non è una ripetizione?

function fireWhenDOMContentIsLoaded() {
  renderGreeting();
}
// anche questa; non basta dirlo all'inizio del documento?
document.addEventListener(EVENT_DOM_CONTENT_LOADED, fireWhenDOMContentIsLoaded);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.tabs.executeScript({
      tabId: tabId,
      code: 'document.body.textContent;'
    }, function(results) {
      console.log(results[0]);
    });
  }
});

