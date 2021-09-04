if (typeof browser !== 'undefined') {
    chrome = browser
}

chrome.tabs.query({ active: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {command: "OpenMenu"}, () => {})
})