// the extension interacts with the current window
chrome.tabs.query({ active: true, currentWindow: true }, 
  // this function retrives the open window with the index 0 and sends a message to obtain the html
  function (tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { message: "get_html" }, function (response) {
    // <a href="www.domain.it">text message</a>
    var ilRestoDelCarlino = "www.ilrestodelcarlino.it";
    var ilMessaggero = "www.ilmessaggero.it";

    console.log("Check links: " + response.links_page);
    document.getElementById("htmlContent").innerText = response.links_page;
  });
});
