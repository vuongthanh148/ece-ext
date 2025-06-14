// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed 222');
  console.log("Extension ID:", chrome.runtime.id);

  // Set default state on install
  chrome.storage.sync.set({ featureAssessFinal: true }, () => {
    console.log("Background: Initialized featureAssessFinal to true");
  });
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Extension started");
  console.log("Extension ID:", chrome.runtime.id);
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background: Received message:", message);
  if (message.action === "getFeatureState") {
    chrome.storage.sync.get("featureAssessFinal", (data) => {
      console.log("Background: Sending featureAssessFinal:", data.featureAssessFinal);
      sendResponse({ featureAssessFinal: data.featureAssessFinal });
    });
    return true;  // Indicate that the response will be sent asynchronously
  } else if (message.action === "setFeatureState") {
    chrome.storage.sync.set({ featureAssessFinal: message.featureAssessFinal }, () => {
      console.log("Background: Set featureAssessFinal to:", message.featureAssessFinal);
      // Send message to content script that the feature state has changed
      chrome.tabs.query({}, tabs => {
        console.log({tabs})
        tabs.forEach(tab => {
          console.log("Background: Sending feature state change to tab:", tab.id);
          chrome.tabs.sendMessage(tab.id, { action: "featureStateChanged", featureAssessFinal: message.featureAssessFinal });
        });
      });
    });
  }
});
