// The script initiates a request to the server, executing a SQL query to fetch data regarding the editorial bias and factual accuracy of online articles.
// Upon receiving the data, it processes and visualizes the website's journalistic integrity and bias directly within the browser's interface.
// This marks a pivotal phase in developing a Chrome extension aimed at enhancing the reader's awareness, presenting an insightful analysis of the content's credibility and political slant on the fly.

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
      
    // New query, selecting all elements from GIORNALI based on the ID
    if (newspaperID >= 0) {
      const orientationQuery = `
          SELECT * FROM GIORNALI
          WHERE IDGIORNALE = ${newspaperID}`;
	    
    // The query is activated, and an if circle is used to store the data in rows based on the political leaning. Data are also transformed in integers.
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
		  
     // The sum of votes is computed
            const voti_totali = ES + S + CS + C + CD + D + ED + NO;
		  
     // Percentages of votes with a specific orientation over the total votes ate computed
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
		  
            // Here the logic to update the logic for the HTML popup
            fillInterface(percentages);
          }
        })
        .catch(err => {
          console.error('Errore durante l\'esecuzione della query:', err);
        });
    }
  });
});

// Function to fill the interface with the data 
function fillInterface(topThreeResults) {
  const podiumContainer = document.getElementById('podiumContainer');
  const podiumResults = [
    topThreeResults[1],
	topThreeResults[0],
	topThreeResults[2]
  ];
  
  // Dynamic creation of elements of the podium
  podiumResults.forEach((item, index) => {
    const podiumItem = document.createElement('div');
    podiumItem.classList.add('podium__item');

    // Add class .first, .second o .third based on the idex
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

    // Append rankDiv first and then leaningParagraph
    podiumItem.appendChild(leaningParagraph);

    podiumContainer.appendChild(podiumItem);
	
  });
  // Set the height of podium elements
  const primoGradinoPodio = document.querySelector('.podium .first');
  const secondoGradinoPodio = document.querySelector('.podium .second');
  const terzoGradinoPodio = document.querySelector('.podium .third');

  // Setting the hight of the podium
  // Dividing by 200, the maximum height will be 50% of the popup's height.

  primoGradinoPodio.style.setProperty('--primo-gradino-height', `${topThreeResults[0].percentage}`);
  secondoGradinoPodio.style.setProperty('--secondo-gradino-height', `${topThreeResults[1].percentage}`);
  terzoGradinoPodio.style.setProperty('--terzo-gradino-height', `${topThreeResults[2].percentage}`);
}
