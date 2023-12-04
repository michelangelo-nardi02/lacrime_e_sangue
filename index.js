chrome.tabs.onUpdated.addListener(function (tabId, info) {
    if(info.status === 'complete') {
        chrome.tabs.executeScript({
            code: "document.documentElement.innerHTML" // or 'file: "getPagesSource.js"'
        }, function(result) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } else {
                console.log(result)
            }
        });
    }
});
