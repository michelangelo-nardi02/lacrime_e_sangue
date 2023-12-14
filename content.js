// Adds listener, susceptible to the sending of message from another part of the extension
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // If the message "get_html" arrives the function gets started
  if (request.message === "get_html") {
    // creates a variable called 'html' and stores the html content of the page
    var html = document.documentElement.outerHTML;
    // sends back the response
    sendResponse({ html: html });
  }
});