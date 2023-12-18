// the extension interacts with the current window
chrome.tabs.query({ active: true, currentWindow: true }, 
  // this function retrives the open window with the index 0 and sends a message to obtain the html
  function (tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { message: "get_html" }, function (response) {
    // Retrieves the HTML content of the response and sets it as the inner text of the element "htmlContent".
    var doc = document.getElementById("htmlContent")
    var links = doc.getElementsByTagName("a")

    if (links.length > 0) {
      links[0].innerText = response.html;

    }
  });
});