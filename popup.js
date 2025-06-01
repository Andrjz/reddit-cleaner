document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const status = document.getElementById("statusMessage");
  const counter = document.getElementById("counter");
  const usernameInput = document.getElementById("username");

  chrome.storage.local.get(["username", "paused", "deletedCount"], result => {
    if (result.username) usernameInput.value = result.username;
    if (result.paused) {
      pauseBtn.textContent = "Resume";
    }
    if (result.deletedCount !== undefined) {
      counter.textContent = result.deletedCount;
    }
  });

  startBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if (!username) return alert("Please enter your Reddit username.");
    chrome.storage.local.set({ username, startCleaner: true, paused: false, deletedCount: 0 });
    chrome.tabs.create({ url: `https://old.reddit.com/user/${username}/` });
    status.textContent = `Cleaning in progress for user: ${username}`;
  });

  pauseBtn.addEventListener("click", () => {
    chrome.storage.local.get(["paused"], result => {
      const newState = !result.paused;
      chrome.storage.local.set({ paused: newState });
      pauseBtn.textContent = newState ? "Resume" : "Pause";
      status.textContent = newState ? "Cleaning paused" : "Cleaning resumed";
    });
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "update-count") {
      counter.textContent = message.count;
    }
  });
});