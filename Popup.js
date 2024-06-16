// The script initiates a request to the server, executing a SQL query to fetch data regarding the editorial bias and factual accuracy of online articles.
// Upon receiving the data, it processes and visualizes the website's journalistic integrity and bias directly within the browser's interface.
// This marks a pivotal phase in developing a Chrome extension aimed at enhancing the reader's awareness, presenting an insightful analysis of the content's credibility and political slant on the fly.

////////////////////////////////
// * 1. CHECKDOMAINS + IMPORT + Function that obtains the percentages *
// Here we import functions from database.utilities
import { FormArchitecture, runQuery, getNewspaperByUrl } from "./database_utilities.js";

document.addEventListener("DOMContentLoaded", () => {
    // We are creating the function "checkDomains" to compare elements of the domain with the page's URL
    function checkDomains(container, url) {
        for (var index = 0; index < container.length; ++index) {
            // This is the link of the newspaper's home page (ex. www.panorama.it)
            var domainString = container[index][0];
            // This retrieves the ID (ex. 21)
            var domainID = container[index][1];
            // If the URL includes the domain string, it returns the domain ID; if no match is found,
            // it returns -1
            if (url.includes(domainString)) {
                return domainID;
            }
        }
        return -1;
    }

    function queryPercentage(activeTab) {
        var url = activeTab.url;

        const queryNewspapers = 'SELECT * FROM GIORNALI;';

        // The line above selects all columns from the table named 'GIORNALI'.
        return runQuery(queryNewspapers).then(result => {
            // 'container' is an empty array to store the data retrieved from 'result'
            var container = [];

            for (var index = 0; index < result.rows; ++index) {
                container[index] = [];
                container[index][0] = result.query_result[index].LINK;
                container[index][1] = result.query_result[index].ID_GIORNALE;
            }

            var newspaperID = checkDomains(container, url);

            // This line logs a message to the console indicating whether the newspaper is in the database and, if so, with what ID.
            // If the page is not present in the database, the ID will be -1.

            // New query, selecting all elements from GIORNALI based on the ID
            if (newspaperID >= 0) {
                const orientationQuery = `
                SELECT * FROM GIORNALI
                WHERE ID_GIORNALE = ${newspaperID}`;

                // The query is activated, and an if circle is used to store the data in rows based on the political leaning. Data are also transformed in integers.
                return runQuery(orientationQuery).then(rows => {
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

                        // Percentages of votes with a specific orientation over the total votes are computed
                        if (voti_totali > 0) {
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
                            return percentages;
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                });
            } else {
                return null;
            }
        });
    }

    ////////////////////////////////
    // * 2. THE QUERY *
    // This section works with the server to return the political orientation and ID of the webpage. 
    // We are querying information about the current Chrome tab, and storing the information in the variable 'url'
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        queryPercentage(tabs[0])
            .then(percentages => {
                if (percentages) {
                    fillInterface(percentages);
                } else {
                    document.getElementById('podiumContainer').innerHTML = `
                        <p class="no-data-message">
                            Ops! Non abbiamo dati per questa pagina. Prova con un'altra testata!
                        </p>`;
                }
            })
            .catch(err => {
                console.error('Errore durante l\'esecuzione della query:', err);
            });
    });

    ////////////////////////////////
    // * 3. THE PODIUM *
    // We want to create a podium showing the top 3 results, in an interactive podium.
    // We want the highest result to be in the middle, with the others following
    // Each element will have a specific color and characteristics. 
    function fillInterface(topThreeResults) {
        const podiumContainer = document.getElementById('podiumContainer');
        if (!topThreeResults) {
            podiumContainer.innerHTML = `
                <p class="no-data-message">
                    Ops! Non abbiamo dati per questa pagina. Prova con un'altra testata!
                </p>`;
            return;
        }

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

            // We are appending rankDiv first and then leaningParagraph
            podiumItem.appendChild(leaningParagraph);
            podiumContainer.appendChild(podiumItem);
        });

        // This section sets the height of podium elements
        const firstStepPodium = document.querySelector('.podium .first');
        const secondStepPodium = document.querySelector('.podium .second');
        const thirdStepPodium = document.querySelector('.podium .third');

        // This specifies the height of the podium!
        firstStepPodium.style.setProperty('--first-step-height', `${topThreeResults[0].percentage}`);
        secondStepPodium.style.setProperty('--second-step-height', `${topThreeResults[1].percentage}`);
        thirdStepPodium.style.setProperty('--third-step-height', `${topThreeResults[2].percentage}`);
    }

    ////////////////////////////////
    // * 4. DETAILS ABOUT THE NEWSPAPER *
    // By clicking on the "Vuoi saperne di più?" button, the user can see more info on the newspaper
    // The following function showcases the details of the webpage we're on
    // The function getDetails() takes the newspaper object as a parameter
    // This function retrieves details about a newspaper based on its ID.
    // It is designed as an asynchronous function that relies on the promise returned from the runQuery function.
    // Within the .then() block, it checks whether the query returned any data.
    // If data is present, it extracts the necessary details from the payload object and returns them as a new object containing the journal details.

    async function getDetails(newspaperID) {
        // Defining the SQL query to select specific details of the newspaper based on its ID
        const queryDetails = 'SELECT FONDAZIONE, SEDE, DIRETTORE, EDITORE, PERIODICITA FROM DATI WHERE ID_GIORNALE = ' + newspaperID;
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
                    return finalObject;
                } else {
                    // Throws an error if no newspaper is found with the specified ID
                    throw new Error("No newspaper found with the specified ID.");
                }
            })
            .catch(err => {
                console.error('An error occurred while executing the query:', err);
            });
        return promise;
    }

    // This function executes the getDetails function and logs the result.
    async function runCode() {
        const promise = await getDetails(1)
            .then(payload => {

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

        // Creating newspaperID
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var activeTab = tabs[0];
            var url = activeTab.url;

            runQuery('SELECT * FROM GIORNALI;').then(result => {
                var container = [];
                for (var index = 0; index < result.rows; ++index) {
                    container[index] = [];
                    container[index][0] = result.query_result[index].LINK;
                    container[index][1] = result.query_result[index].ID_GIORNALE;
                }

                var newspaperID = checkDomains(container, url);
                if (newspaperID >= 0) {
                    getDetails(newspaperID)
                        .then(details => {
                            var detailsHTML = `
                            <h2 style="color: #000;"> <strong>Una panoramica dettagliata su questa testata</strong></h2>
                            <p><strong>Fondazione:</strong> ${details.fondazione}</p>
                            <p><strong>Sede:</strong> ${details.sede}</p>
                            <p><strong>Direttore:</strong> ${details.direttore}</p>
                            <p><strong>Editore:</strong> ${details.editore}</p>
                            <p><strong>Periodicità:</strong> ${details.periodicita}</p>
                        `;
                            // Ensuring the user can see this in the HTML
                            document.getElementById('surprise').innerHTML = detailsHTML;
                            document.getElementById('surprise').style.display = 'block';
                        })
                        .catch(error => {
                            console.error('Errore durante il recupero dei dettagli del giornale:', error);
                        });
                } else {
                    console.log('Newspaper not found in our database for the current URL.');
                }
            }).catch(error => {
                console.error('Error while executing SQL query:', error);
            });
        });


        ////////////////////////////////
        // * 5. ALL THE PERCENTAGES  *		
        // This allows users to see all the results we have for a given newspaper
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            queryPercentage(tabs[0])
                .then(percentages => {
                    const container = document.getElementById('surprise');
                    const chartContainer = document.getElementById('barchartContainer');

                    // We want to make sure the popup doesn't keep on expanding at each request
                    while (chartContainer.firstChild) {
                        chartContainer.removeChild(chartContainer.firstChild);
                    }

                    // Defining the width of the chart
                    const maxBarWidth = 700;

                    // Defining the height of each bar
                    const barHeight = 20; // You can adjust this value

                    // Creating an SVG element
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('width', '500');
                    svg.setAttribute('height', percentages.length * barHeight);

                    // Creating the bars
                    for (let i = 0; i < percentages.length; i++) {
                        const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                        const barWidth = (percentages[i].percentage / 100) * maxBarWidth;

                        bar.setAttribute('height', barHeight);
                        bar.setAttribute('width', barWidth);
                        bar.setAttribute('y', i * barHeight);
                        bar.setAttribute('x', 0); // This makes the bar start from the left of the SVG
                        bar.setAttribute('fill', 'rgba(43, 89, 141, 0.8)'); 

                        svg.appendChild(bar);

                        // Creating a text element for the label
                        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

                        // The text is set to the right of the bars, to label each accordingly 
                        text.setAttribute('x', barWidth + 5); 
                        text.setAttribute('y', (i * barHeight) + (barHeight / 2)); 
                        text.textContent = `${percentages[i].label}: ${percentages[i].percentage.toFixed(2)}%`;

                        svg.appendChild(text);
                    }

                    // Appending the SVG to the container
                    document.getElementById('barchartContainer').appendChild(svg);

                    // Making the container visible
                    document.getElementById('barchartContainer').style.display = 'block';

                    const title = document.createElement('h2');
                    title.textContent = 'Tutti i nostri risultati: ';
                    title.style.color = '#000'; 

                    container.appendChild(title);

                    const sottotitolo = document.createElement('h3');
                    sottotitolo.textContent = 'Il podio non basta? Scopri come gli altri utenti hanno classificato l\'orientamento politico di questa testata';
                    container.appendChild(sottotitolo);
                })
                .catch(err => {
                    console.error('Errore durante l\'esecuzione della query:', err);
                });
        });

        // This shows the hide button
        document.querySelector('.close_admin_popup').classList.remove('hide');
        document.getElementById('questionnaire_expand').style.display = 'block';
    });

    document.getElementById('questionnaire_expand').addEventListener('click', function () {
        // Showing the questionnaire button only after the popup has been expanded
        document.getElementById('questionnaireButton').style.display = 'block';
        document.getElementById('Questionario_Link').style.display = 'block'; // Show the paragraph
    });

    document.querySelector('.close_admin_popup').addEventListener('click', function () {
        var popup = document.getElementById('popup');
        popup.style.height = '50px';

        // Hiding the "close" button
        this.classList.add('hide');

        document.getElementById('barchartContainer').style.display = 'none';
        document.getElementById('surprise').style.display = 'none';
        document.getElementById('questionnaireButton').style.display = 'none';
        document.getElementById('questionnaire_expand').style.display = 'none';
        document.getElementById('Questionario_Link').style.display = 'none';
    });

    const questionnaireButton = document.getElementById('questionnaireButton');
    if (questionnaireButton) {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            const activeTab = tabs[0];
            getNewspaperByUrl(activeTab.url).then(newspaperID =>
                questionnaireButton.addEventListener('click', function () {
                    chrome.tabs.create({ url: `questionnaire.html?nid=${newspaperID}` });
                })
            );
        })
    }
});
