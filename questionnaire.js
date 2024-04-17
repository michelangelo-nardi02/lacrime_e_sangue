// questionnaire.js
document.getElementById('questionnaireButton').addEventListener('click', function() {
    chrome.tabs.create({ url: 'questionnaire.html' });
});
