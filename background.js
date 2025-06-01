chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'get-paused') {
    chrome.storage.local.get(['paused'], result => {
      sendResponse({ paused: result.paused || false });
    });
    return true;
  }
});