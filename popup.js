
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
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  var url = activeTab.url;

  //We are retreiving information about the current Chrome tab 
    console.log('Current URL:', url);
  

// ora, prima di fetch mettiamo la richiesta alla query. AL POSTO DI FETCH perchè giustamente non abbiamo più il csv! 


async function runQuery(sqlQuery) {
    // Log della chiamata a runQuery

    // BENE QUINDI QUI INCOLLIAMO IL SERVER DAL QUALE PRENDIAMO LA REICHIESTA HTTP 
    const serverURL = 'http://nardinan.ddns.net:6664'; 


    // ABBIAMO un oggetto named options !! <3 :) 
    // a quanto pare la richiesta è di type POST e rimanda i dati in formato JSON, Includendo la SQL as part of the request body 
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sqlQuery }),
    };

    // Quindi ora si fetcha 
    // e si convertono le risposte in formato json
    value = await fetch(serverURL, options)
        .then(response => response.json())
        .then(data => {
            return data;
        })

        // ora catchiamo gli errors
        .catch(error => {
            console.error('There has been an issue following your request:', error);
        });


    return value;
}

//trying our function, quindi selezioniamo link dalla table GIORNALI
const queryDaEseguire = 'SELECT * FROM GIORNALI;' ;
// ECCO
runQuery(queryDaEseguire).then(result => {

	var container = []
	for ( var index = 0; index < result.rows; ++index) {
		container[index] = [];
		container[index][0] = result.query_result[index].LINK;
		container[index][1] = result.query_result[index].IDGIORNALE;
	}
		
	var primary_key = checkDomains (container, url);
	console.log('This newspaper is in our database, with ID: ', checkDomains(container, url));
	
	if (primary_key >= 0) {
// bene raga, ecco le cose da risolvere 
	// non mostra  "destra" 
	// mostra "estrema sinistra" nei siti che nel server non hanno dati
	//non mostra un messaggio quando non si è in una scheda presente nel server 
// ma il risultato di queste 2 ore è che va quasi tutto 
	const anotherQuery = " SELECT G. LINK, " + 
		" (CASE GREATEST(G.ES, G.S, G.CS, G.C, G.CD, G.D, G.ED, G.NO) " +
		"	 WHEN G.ES THEN 'Estrema Sinistra' " +
		"	 WHEN G.S THEN 'Sinistra' " + 
		"	 WHEN G.CS THEN 'Centro Sinistra' " + 	
		"	 WHEN G.C THEN 'Centro' " + 	
                "        WHEN G.D THEN 'Destra' " +
		"	 WHEN G.CD THEN 'Centro Destra' " + 	
		"	 WHEN G.ED THEN 'Estrema Destra' " + 	
		"	 WHEN G.NO THEN 'Nessun Orientamento' " + 	
		" END) AS OrientamentoPrincipale" +
		" FROM " +
		" GIORNALI G" +
		" WHERE" + 
		" IDGIORNALE = " + primary_key.toString()
		
	runQuery(anotherQuery).then(lastResult => {
		if (lastResult.rows > 0) {
			document.getElementById("htmlContent").innerText = lastResult.query_result[0].OrientamentoPrincipale
			// We are printing the result in the console as well
			console.log( "This newspaper's perspective has been described as : ", lastResult.query_result[0].OrientamentoPrincipale);
			
		} if (lastResult.rows == 0) { 
			document.getElementById("HtmlContent").innerText = console.log("No Result" );
		}
	});
	}
  else {
  // Handle the case when primary_key is less than 0
  console.log("Invalid primary_key value. This means the website is not part of our database.");
  document.getElementById("htmlContent").innerText = "Oh! Questo sito non compare nel nostro database.";
 }
});
})
