document.getElementById('rearrange').onclick = () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {file: 'extension/rearrange.js'});
    });
};

const recorderButton = document.getElementById('recorder');
const recorderButtonInitialLabel = 'Start Recording';
recorderButton.textContent = recorderButtonInitialLabel;

recorderButton.onclick = () => {
    if (recorderButton.textContent === recorderButtonInitialLabel) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {file: 'extension/record.js'});
        });

        recorderButton.textContent = 'Stop Recording';
    } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {file: 'extension/download.js'});
        });

        recorderButton.textContent = recorderButtonInitialLabel;
    }

    // TODO: can I grab returned values so as to trigger a stop recording button?
};
