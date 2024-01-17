//This JavaScript file content script performs a check to determine if the current webpage's domain 
// matches any entries in the CSV file.

// Getting the CSV File
// We are now retrieving the CSV file containing all the newspapers relevant for the present
// version of the extention. 
const csvURL = chrome.runtime.getURL('GIORNALI.csv');
  
console.log(csvURL); 

fetch(csvURL)
  .then(response => response.text())
  .then(csvData => {
    // We are separating the CSV data into different rows, containing a list of 
    // domain strings and their IDs. 
    var rows = csvData.split('\n');
    var domains = [];
      
    for (var row of rows) {
       // We are now separating the CSV into columns, iteratingn over each row. 
       var columns = row.split(';');
       // We are extracting the different elements of the file, namely the ID of the domain of the 1st column
       //and the String, in the second column
       var domainID = columns[0];
       var domainString = columns[1];

       //This line pushes the domain string and ID into the 'domains' array
       domains.push([domainString, domainID]); 
   }
        
   console.log(domains);
        
   // We are creating the function "checkDomains" to compare elements of domains with the page's URL
    function checkDomains(domains, url) {
      for (var index = 0; index < domains.length; ++index) {
      // This is the link of the newspaper's home page (ex. www.panorama.it)
        var domainString = domains[index][0];
        //This retrieves the ID (ex. 21)
        var domainID = domains[index][1];
        //If the URL includes the domain string, it returns the domain ID; if no match is found,
        // it  returns -1
          if (url.includes(domainString)) {
            return domainID;
          }
       }
       return -1;
    }
        
    // Get the active tab, store the URL in the var 'url'
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var url;
      var activeTab;

      //We are retreiving information about the current Chrome tab 
      activeTab = tabs[0];
      url = activeTab.url;
            
      console.log(url);
      
      // The 'checkDomains' function checks for matches between the extracted domains and the tab's URL.
      const domainID_Check = checkDomains(domains, url);

      // We are logging the result of the check above to the console
      console.log(domainID_Check);  
            
      // If a match is found, it prints the ID, otherwise, print a message explaining 
      if (domainID_Check >= 0) {
        console.log("Match found for the domain with ID", {domainID_Check});
      } else {
        console.log("No match found for the current domain");
      }

      // Update the content of an HTML element with the ID "htmlContent" with the result of the domain check.      
      document.getElementById("htmlContent").innerText = domainID_Check;
    });
})
