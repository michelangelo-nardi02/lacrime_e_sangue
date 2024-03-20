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
    var container = [];
    for (var index = 0; index < result.rows; ++index) {
      container[index] = [];
      container[index][0] = result.query_result[index].LINK;
      container[index][1] = result.query_result[index].IDGIORNALE;
    }
    
    var newspaperID = checkDomains(container, url);
    console.log('This newspaper is in our database, with ID: ', checkDomains(container, url));
    // This line logs a message to the console indicating whether the newspaper is in the database and, if so, with what ID. 
    // If the page is not present in the database, the ID will be -1. 
      
    // NUOVA QUERY: cerchiamo di concentrarci solo su estrazione dei dati
    if (newspaperID >= 0) {
      const orientationQuery = `
          SELECT * FROM GIORNALI
          WHERE IDGIORNALE = ${newspaperID}`;
  
      runQuery(orientationQuery)
        .then(rows => {
          if (rows.rows > 0) {
            const ES = parseInt(rows.query_result[0].ES);
            const S = parseInt(rows.query_result[0].S);
            const CS = parseInt(rows.query_result[0].CS);
            const C = parseInt(rows.query_result[0].C);
            const CD = parseInt(rows.query_result[0].CD);
            const D = parseInt(rows.query_result[0].D);
            const ED = parseInt(rows.query_result[0].ED);
            const NO = parseInt(rows.query_result[0].NO);

            console.log(rows)
  
            const voti_totali = ES + S + CS + C + CD + D + ED + NO;
            const percentages = [
              { label: 'Estrema Sinistra', percentage: (ES / voti_totali) * 100 },
              { label: 'Sinistra', percentage: (S / voti_totali) * 100 },
              { label: 'Centro Sinistra', percentage: (CS / voti_totali) * 100 },
              { label: 'Centro', percentage: (C / voti_totali) * 100 },
              { label: 'Destra', percentage: (D / voti_totali) * 100 },
              { label: 'Centro Destra', percentage: (CD / voti_totali) * 100 },
              { label: 'Estrema Destra', percentage: (ED / voti_totali) * 100 },
              { label: 'Nessun Orientamento', percentage: (NO / voti_totali) * 100 },
            ];
  
            percentages.sort((a, b) => b.percentage - a.percentage);
            console.log(percentages);
            // Inserire qui la logica per aggiornare l'HTML del popup

            fillInterface(percentages);
          }
        })
        .catch(err => {
          console.error('Errore durante l\'esecuzione della query:', err);
        });
    }
  });
});

// Funzione per riempire l'interfaccia con i dati delle statistiche
function fillInterface(topThreeResults) {
  const podiumContainer = document.getElementById('podiumContainer');
  const podiumResults = [
    topThreeResults[1],
	topThreeResults[0],
	topThreeResults[2]
  ];
  
  // Creazione dinamica degli elementi del podio
  podiumResults.forEach((item, index) => {
    const podiumItem = document.createElement('div');
    podiumItem.classList.add('podium__item');

    // Aggiungi la classe .first, .second o .third in base all'indice
    switch (index) {
      case 0:
        podiumItem.classList.add('second');
        break;
      case 1:
        podiumItem.classList.add('first');
        break;
      case 2:
        podiumItem.classList.add('third');
        break;
    }

    const leaningParagraph = document.createElement('p');
    leaningParagraph.classList.add('podium__leaning');
    leaningParagraph.innerText = `${item.label}: ${item.percentage.toFixed(2)}%`;

    // Appendi prima rankDiv e poi leaningParagraph
    podiumItem.appendChild(leaningParagraph);

    podiumContainer.appendChild(podiumItem);
	
  });
  // Set the height of podium elements
  const primoGradinoPodio = document.querySelector('.podium .first');
  const secondoGradinoPodio = document.querySelector('.podium .second');
  const terzoGradinoPodio = document.querySelector('.podium .third');

  // Qui imposto l'altezza dei diversi gradini del podio.
  // Dividendo per 200, l'altezza massima dovrebbe essere il 50% dell'altezza del popup.

  console.log(`Primo gradino height: ${topThreeResults[0].percentage}`);
  console.log(`Secondo gradino height: ${topThreeResults[1].percentage}`);
  console.log(`Terzo gradino height: ${topThreeResults[2].percentage}`);

  primoGradinoPodio.style.setProperty('--primo-gradino-height', `${topThreeResults[0].percentage}`);
  secondoGradinoPodio.style.setProperty('--secondo-gradino-height', `${topThreeResults[1].percentage}`);
  terzoGradinoPodio.style.setProperty('--terzo-gradino-height', `${topThreeResults[2].percentage}`);
}
