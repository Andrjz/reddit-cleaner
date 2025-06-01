function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const config = await chrome.storage.local.get(['startCleaner']);
  if (!config.startCleaner) return;

  let deletedCount = 0;
  await chrome.storage.local.set({ deletedCount });

  while (true) {
    const pausedState = await new Promise(resolve => {
      chrome.runtime.sendMessage({ action: 'get-paused' }, resolve);
    });
    if (pausedState.paused) {
      await sleep(2000);
      continue;
    }

    await sleep(2000);
    const deleteButtons = Array.from(document.querySelectorAll('a[data-event-action="delete"]'));
    if (deleteButtons.length === 0) break;

    for (const btn of deleteButtons) {
      btn.scrollIntoView({ behavior: "smooth", block: "center" });
      btn.click();
      await sleep(500);
      const yesBtn = document.querySelector('a.yes[onclick*="del"]');
      if (yesBtn) {
        yesBtn.click();
        deletedCount++;
        await chrome.storage.local.set({ deletedCount });
        chrome.runtime.sendMessage({ type: 'update-count', count: deletedCount });
        await sleep(1500);
      }
    }

    const next = document.querySelector('.next-button a');
    if (next) {
      next.click();
      await sleep(5000);
    } else {
      break;
    }
  }

  await chrome.storage.local.set({ startCleaner: false });
})();