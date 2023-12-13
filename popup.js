// popup.js
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  var activeTabId = activeTab.id;

  chrome.scripting.executeScript({
    target: { tabId: activeTabId },
    func: DOMtoString,
  }, function (results) {
    var message = document.querySelector('#message');
    message.innerText = results[0].result.outerHTML; // Estrai outerHTML direttamente qui
  });
});

function DOMtoString(selector) {
  if (selector) {
    selector = document.querySelector(selector);
    if (!selector) return { result: "ERROR: querySelector failed to find node" }; // Restituisci un oggetto invece di una stringa
  } else {
    selector = document.documentElement;
  }
  return { result: selector }; // Restituisci un oggetto contenente l'elemento DOM
}
