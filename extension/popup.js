let button = document.getElementById('reorder');

button.onclick = () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {file: 'extension/rearrange.js'});
    });
};
