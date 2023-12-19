// Adds listener, susceptible to the sending of message from another part of the extension
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // If the message "get_html" arrives the function gets started
  if (request.message === "get_html") {
    // creates a variable called 'html' and stores the html content of the page
    var links = document.getElementsByTagName("a");
    var contentLinks = "";
    for (link of links) {
      contentLinks = contentLinks + ", " + link.getAttribute("href");
    }
    // sends back the response
    sendResponse({ links_page: contentLinks });
  }
});
