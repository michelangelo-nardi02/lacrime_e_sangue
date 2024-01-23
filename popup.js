// * AIM AND OVERVIEW OF THIS SCRIPT * // 
// This JavaScript code is meant to identify newspapers' webpages based on their URL.
// The process involves comparing elements of domains with the current page's URL. 
// The script then queries a remote server with a SQL query to retrieve information about the newspaper's political orientation.
// It handles the returned data, displaying the newspaper's political leaning on the console and updating the HTML content of the popup accordingly. 
// This is the first step in creating a Chrome extention able to provide additional context and information to newspaper's readers, showing them 
// the perceived political orientation of the page.

// * 1. CHECKDOMAINS  *
// We are creating the function "checkDomains" to compare elements of the domain with the page's URL
function checkDomains(container, url) {
  for (var index = 0; index < container.length; ++index) {
    // This is the link of the newspaper's home page (ex. www.panorama.it)
    var domainString = container[index][0];
    //This retrieves the ID (ex. 21)
    var domainID = container[index][1];
    //If the URL includes the domain string, it returns the domain ID; if no match is found,
    // it  returns -1
    if (url.includes(domainString)) {
      return domainID;
    }
  }
  return -1;
}

// * 2. THE QUERY *
// This section works with the server to return the political orientation and ID of the webpage. 
// We are querying information about the current Chrome tab, and storing the information in the variable 'url'
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  var url = activeTab.url;
  //We are showing it in the console.
  console.log('Current URL:', url);

// We are now defining an asynchronous JavaScript function named 'runQuery'. 
async function runQuery(sqlQuery) {
    // We are saving as 'serverURL' the link of the server
    const serverURL = 'http://nardinan.ddns.net:6664'; 
    // Here we are defining the 'options' object that will be configuring the HTTP request to be a POST request, 
    // specifying that the content is in JSON format, and providing the SQL query in the request body.
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
       },
       body: JSON.stringify({ query: sqlQuery }),
    };
// Now we are making an asynchronous HTTP request, parsing the response body as JSON, and assigning the resulting data to the variable 'value'.
    value = await fetch(serverURL, options)
      .then(response => response.json())
      .then(data => {
        return data;
      })
      // This snippet deals with any errors that may arise. 
      .catch(error => {
         console.error('There has been an issue following your request:', error);
      });

  return value;
}

const queryNewspapers = 'SELECT * FROM GIORNALI;' ;
// The line above selects all columns from the table named 'GIORNALI'.
runQuery(queryNewspapers).then(result => {
  // 'container' is an empty array to store the data retrieved from 'result'
  var container = []
  for ( var index = 0; index < result.rows; ++index) {
    container[index] = [];
    container[index][0] = result.query_result[index].LINK;
    container[index][1] = result.query_result[index].IDGIORNALE;
 }
		
  var newspaperID = checkDomains (container, url);
  console.log('This newspaper is in our database, with ID: ', checkDomains(container, url));
  // This line logs a message to the console indicating whether the newspaper is in the database and, if so, with what ID. 
  // If the page is not present in the database, the ID will be -1. 
	
  if (newspaperID >= 0) {
    // We're firstly checking the url is present in our database.
    // We are showing the newspaper's orientation, in Italian a
    const orientationQuery = `
	    SELECT
	        G.LINK,
	        CASE COALESCE(GREATEST(G.ES, G.S, G.CS, G.C, G.CD, G.D, G.ED, G.NO), 0)
	            WHEN 0 THEN 'Non ho ancora dei valori per questa testata.'
	            WHEN G.ES THEN 'Estrema Sinistra'
	            WHEN G.S THEN 'Sinistra'
	            WHEN G.CS THEN 'Centro Sinistra'
	            WHEN G.C THEN 'Centro'
	            WHEN G.D THEN 'Destra'
	            WHEN G.CD THEN 'Centro Destra'
	            WHEN G.ED THEN 'Estrema Destra'
	            WHEN G.NO THEN 'Nessun Orientamento'
	        END AS OrientamentoPrincipale
	    FROM GIORNALI G
	    WHERE IDGIORNALE = ${newspaperID.toString()}`;
		
    runQuery(orientationQuery).then(lastResult => {
      if (lastResult.rows > 0) {
        const results = lastResult.query_result[0].OrientamentoPrincipale
            
        if (results.length > 0) {
          // Display all results in the HTML and console
          document.getElementById("htmlContent").innerText = results;
          console.log("This newspaper's perspective has been described as:", results);
        } else {
          // Handle the case when there are no results
          document.getElementById("HtmlContent").innerText = "No Result";
          console.log("No Result");
      }
    }
  });
} else {
  // Handle cases in which newspaperID is less than 0, telling the  user both in the console and in the popup
  // that the current url is not in our database. 
  console.log("Invalid newspaperID value. This means the website is not part of our database.");
  document.getElementById("htmlContent").innerText = "Oh! Questo sito non compare nel nostro database.";
 }
});
})
