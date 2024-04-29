// This code creates an event listener that opens the questionnaire once the html element questionnaireButton is clicked
document.getElementById('questionnaireButton').addEventListener('click', function() {
    chrome.tabs.create({ url: 'questionnaire.html' });
});
