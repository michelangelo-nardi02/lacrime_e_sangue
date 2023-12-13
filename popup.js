// popup.js
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  var activeTabId = activeTab.id;

  chrome.scripting.executeScript({
    target: { tabId: activeTabId },
    func: DOMtoString,
  }, function (results) {
    var message = document.querySelector('#message');
    message.innerText = results[0].result;
  });
});

function DOMtoString(selector) {
  if (selector) {
    selector = document.querySelector(selector);
    if (!selector) return "ERROR: querySelector failed to find node";
  } else {
    selector = document.documentElement;
  }
  return { result: selector.outerHTML };
}
