import { calculateSkillAverage } from './finalAssess';

console.log("Content script loaded!");

let featureAssessFinal = false;

// Function to run calculations
function runCalculations() {
  calculateSkillAverage("KỸ NĂNG SPEAKING");
  calculateSkillAverage("KỸ NĂNG WRITING");
}

// Create a MutationObserver to watch for changes to the DOM
const observer = new MutationObserver((mutations) => {
  // Check if the target elements are now available
  const skillRows = document.querySelectorAll('tr.tr-skill');
  if (skillRows.length > 0) {
    console.log("Target elements found, running calculations...");
    runCalculations();
    observer.disconnect(); // Stop observing once calculations are run
  }
});

// Get initial feature state from background script
chrome.runtime.sendMessage({ action: "getFeatureState" }, (response) => {
  featureAssessFinal = response.featureAssessFinal;
  console.log("Content: Initial featureAssessFinal:", featureAssessFinal);
  if (featureAssessFinal) {
    // Start observing the DOM for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "featureStateChanged") {
    featureAssessFinal = message.featureAssessFinal;
    console.log("Content: Feature state changed:", featureAssessFinal);
    if (featureAssessFinal) {
      console.log("Manipulating DOM...");
      runCalculations();
    } else {
      console.log("Resetting DOM...");
      resetDOM();
    }
  }
});

export function resetDOM() {
  // Reset skill-point values
  const skillPoints = document.querySelectorAll('.skill-point .value');
  skillPoints.forEach(skillPoint => {
    const originalValue = skillPoint.getAttribute('data-original-value');
    if (originalValue) skillPoint.textContent = originalValue;
    skillPoint.removeAttribute('data-original-value');
  });
}