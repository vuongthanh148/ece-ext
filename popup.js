const featureToggle = document.getElementById('featureToggle');

// Get the current state from storage
chrome.storage.sync.get('featureAssessFinal', (data) => {
  featureToggle.checked = data.featureAssessFinal;
  console.log("Popup: Initial featureAssessFinal:", data.featureAssessFinal); // Add this line
});

// Listen for changes to the toggle
featureToggle.addEventListener('change', () => {
  const featureAssessFinal = featureToggle.checked;
  console.log("Popup: Toggle changed, new value:", featureAssessFinal); // Add this line

  // Save the new state to storage
  chrome.storage.sync.set({ featureAssessFinal: featureAssessFinal }, () => {
    console.log("Popup: Saved featureAssessFinal to storage:", featureAssessFinal); // Add this line
    chrome.runtime.sendMessage({ action: "setFeatureState", featureAssessFinal: featureAssessFinal });
  });
});