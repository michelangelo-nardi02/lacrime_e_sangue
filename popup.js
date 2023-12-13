// popup.js
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  var activeTabId = activeTab.id;

  chrome.scripting.executeScript({
    target: { tabId: activeTabId },
    func: function () {
      return document.documentElement.outerHTML;
    },
  }, function (results) {
    var message = document.querySelector('#message');
    message.innerText = results[0];
  });
});
