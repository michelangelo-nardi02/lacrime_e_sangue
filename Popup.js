// The script initiates a request to the server, executing a SQL query to fetch data regarding the editorial bias and factual accuracy of online articles.
// Upon receiving the data, it processes and visualizes the website's journalistic integrity and bias directly within the browser's interface.
// This marks a pivotal phase in developing a Chrome extension aimed at enhancing the reader's awareness, presenting an insightful analysis of the content's credibility and political slant on the fly.


////////////////////////////////
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


////////////////////////////////
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
	console.log('Result:', result, value);

    
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


////////////////////////////////
// * 3. THE PODIUM *
// We want to create a podium showing the top 3 results, in an interactive podium.
// We want the highest result to be in the middle, with the others following
// Each element will have a specific color and characteristics. 
function fillInterface(topThreeResults) {
	  const podiumContainer = document.getElementById('podiumContainer');
	  const podiumResults = [
		topThreeResults[1],
		topThreeResults[0],
		topThreeResults[2]
	  ];
	  
	  
	  // Dynamic creation of elements of the podium
	  // Whenever we open the popup, the podium is generated! 
		podiumResults.forEach((item, index) => {
			const podiumItem = document.createElement('div');
			podiumItem.classList.add('podium__item');

			// We're adding class .first, .second o .third based on the index
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
			
			// Now we add the label, so that the user can know to what each element is referring to. 
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

		// Setting the height of the podium!
		primoGradinoPodio.style.setProperty('--primo-gradino-height', `${topThreeResults[0].percentage}`);
		secondoGradinoPodio.style.setProperty('--secondo-gradino-height', `${topThreeResults[1].percentage}`);
		terzoGradinoPodio.style.setProperty('--terzo-gradino-height', `${topThreeResults[2].percentage}`);
}


////////////////////////////////
// * 4. DETAILS ABOUT THE NEWSPAPER *
// By clicking on the "Vuoi saperne di più?" button, the user can see more info on the newspaper
// The following function showcases the details of the webpage we're on

// The function getDetails()  takes the newspaper object as a parameter
// We have listed some details about every newspaper ID in our server 


// The function getDetails(): in this part of the project our aim is to extract information about newspapers based on their ID
async function runQuery(sqlQuery) {
    try {
        // First of all, we want to define the server and the HTTP request to it through POST method
        const serverURL = 'http://nardinan.ddns.net:6664';
        // Configuring the HTTP request to the server as for getStatistics()
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: sqlQuery }),
        };
        // We execute the HTTP request and frame our response as JSON
        const response = await fetch(serverURL, options);
        const data = await response.json();
        // Returning the data obtained from the server
        return data;
    } catch (error) {
        console.error('Error while executing SQL query:', error);
        throw error;
    }
}

// This function retrieves details about a newspaper based on its ID.
// It is designed as an asynchronous function that relies on the promise returned from the runQuery function.
// Within the .then() block, it checks whether the query returned any data.
// If data is present, it extracts the necessary details from the payload object and returns them as a new object containing the journal details.

async function getDetails(newspaperID) {
    // Defining the SQL query to select specific details of the newspaper based on its ID
    const queryDetails = 'SELECT FONDAZIONE, SEDE, DIRETTORE, EDITORE, PERIODICITA FROM DATI WHERE IDGIORNALE = ' +
        newspaperID;
    const promise = await runQuery(queryDetails)
        .then(payload => {
            // Checking if any data is returned
            if (payload.rows > 0) {
                // Extracting the required details from the query result
                const finalObject = {
                    fondazione: payload.query_result[0].FONDAZIONE,
                    sede: payload.query_result[0].SEDE,
                    direttore: payload.query_result[0].DIRETTORE,
                    editore: payload.query_result[0].EDITORE,
                    periodicita: payload.query_result[0].PERIODICITA
                };
                return (finalObject);
            } else {
                // Throws an error if no newspaper is found with the specified ID
                throw new Error("No newspaper found with the specified ID.");
            }
        })
        .catch(error => {
            throw error;
        });
    return promise;
}

// This function executes the getDetails function and logs the result.
async function runCode() {
    const promise = await getDetails(1)
        .then(payload => {
            console.log(payload);
        })
        .catch(error => {
            throw error;
        });
    return promise;
}

// Executes the runCode function
runCode();



// Now we want these additional details to be showcased when we expand the popup 
 document.getElementById('results_button').addEventListener('click', function () {
	var popup = document.getElementById('popup');

		// The "chiudi" button can be seen only when the popup is expanded 
		document.querySelector('.close_admin_popup').classList.remove('hide');
		
		
			
			//creating newspaperID a
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			var activeTab = tabs[0];
			var url = activeTab.url;
			
			
					runQuery('SELECT * FROM GIORNALI;').then(result => {
					var container = [];
					for (var index = 0; index < result.rows; ++index) {
						container[index] = [];
						container[index][0] = result.query_result[index].LINK;
						container[index][1] = result.query_result[index].IDGIORNALE;
					}


		// Definisci la funzione runQuery e getDetails qui o assicurati che siano accessibili


        var newspaperID = checkDomains(container, url);
        if (newspaperID >= 0) {
            console.log('This newspaper is in our database, with ID: ', newspaperID);
			
			getDetails(newspaperID)
	.then(details => {
		var detailsHTML = `
			<h2 style= "color: #000;"> <strong>Una panoramica dettagliata su questa testata</strong></h2>
			<p><strong>Fondazione:</strong> ${details.fondazione}</p>
			<p><strong>Sede:</strong> ${details.sede}</p>
			<p><strong>Direttore:</strong> ${details.direttore}</p>
			<p><strong>Editore:</strong> ${details.editore}</p>
			<p><strong>Periodicità:</strong> ${details.periodicita}</p>
		`;
		// Ensuring the user can see this in the HTML
		document.getElementById('sorpresa').innerHTML = detailsHTML;
		document.getElementById('sorpresa').style.display = 'block';
		console.log(document.getElementById('sorpresa').innerHTML);
	});
        } else {
            console.log('Newspaper not found in our database for the current URL.');
        }
    }).catch(error => {
        console.error('Error while executing SQL query:', error);
    });
});

	// Onto the details ! 
	// Users should see the full list of information about the relevant newspaper.

		////////////////////////////////
		// * 5. ALL THE PERCENTAGES  *		
		// Albeit reduntant, this is the function from section * 1 * . 
		// We copypasted it into the parenthesis so that it works
		// from now on, it's all old stuff for a while
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

		//just like before, we check the current tab
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			var activeTab = tabs[0];
			var url = activeTab.url;

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
							const container = document.getElementById('sorpresa');
							const chartContainer = document.getElementById('barchartContainer');
							
							// We want to make sure the popup doesn't
							while (chartContainer.firstChild) {
								chartContainer.removeChild(chartContainer.firstChild);
							}

							// 
							const maxBarWidth = 700;

							// Define the height of each bar
							const barHeight = 20; // You can adjust this value

							// Create an SVG element
							const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
							svg.setAttribute('width', '500');
							svg.setAttribute('height', percentages.length * barHeight);

							// Create the bars
							for (let i = 0; i < percentages.length; i++) {
								const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
								const barWidth = (percentages[i].percentage / 100) * maxBarWidth;

								bar.setAttribute('height', barHeight);
								bar.setAttribute('width', barWidth);
								bar.setAttribute('y', i * barHeight);
								bar.setAttribute('x', 0); // This makes the bar start from the left of the SVG
								bar.setAttribute('fill', 'rgba(43, 89, 141, 0.8)'); // Imposta il colore a #2b598d con 50% di opacità

								svg.appendChild(bar);

								// Create a text element for the label
								const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

								// Position the text to the right of the bar
								text.setAttribute('x', barWidth + 5); // 5 is a padding value
								text.setAttribute('y', (i * barHeight) + (barHeight / 2)); // This positions the text in the middle of the bar
								text.textContent = `${percentages[i].label}: ${percentages[i].percentage.toFixed(2)}%`;

								svg.appendChild(text);
							}

							// Append the SVG to the container
							document.getElementById('barchartContainer').appendChild(svg);

							// Make the container visible
							document.getElementById('barchartContainer').style.display = 'block';


							// ora qui si mette tutto nel popup,  quindi intanto creo un titolo per distinguerle
							// dai dettagli sopra
							const title = document.createElement('h2');
							title.textContent = 'Tutti i nostri risultati: ';
							title.style.color = '#000'; // Imposta il colore del testo a #2b598d

							container.appendChild(title);
							
							const sottotitolo = document.createElement ('h3');
							sottotitolo.textContent = 'Il podio non basta? Scopri come gli altri utenti hanno classificato l\' orientamento politico di questa testata';
							container.appendChild(sottotitolo);
						};	 
					})
					.catch(err => {
						console.error('Errore durante l\'esecuzione della query:', err);
					});

					// 'chartContainer' is the id of a canvas element in your HTML
					var myChart = new Chart(
						document.getElementById('barchartContainer'),
						config
					);
				}
			})
			.catch(error => {
				console.error('Errore durante il recupero dei dettagli del giornale:', error);
			});
		});

		//This shows the hide button
		document.querySelector('.close_admin_popup').classList.remove('hide');
		  document.getElementById('questionnaire_expand').style.display = 'block';

});

document.getElementById('questionnaire_expand').addEventListener('click', function() {
  // Show the questionnaire button only after the popup has been expanded
  document.getElementById('questionnaireButton').style.display = 'block';
  		    document.getElementById('Questionario_Link').style.display = 'block'; // Show the paragraph

});


		document.querySelector('.close_admin_popup').addEventListener('click', function () {
			var popup = document.getElementById('popup');
			popup.style.height = '50px';

			// Hide the "close" button
			this.classList.add('hide');

		this.classList.add('hide');
  document.getElementById('barchartContainer').style.display = 'none';
  document.getElementById('sorpresa').style.display = 'none';
  document.getElementById('questionnaireButton').style.display = 'none';
  document.getElementById('questionnaire_expand').style.display = 'none';
  document.getElementById('Questionario_Link').style.display = 'none';


	}); 
