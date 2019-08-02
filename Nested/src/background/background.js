console.log('background')

chrome.browserAction.onClicked.addListener(() => chrome.tabs.create({url: "pages/main/main.html"}));
