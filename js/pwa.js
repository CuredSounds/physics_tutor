/*
 * PWA glue: registers the service worker and wires up the Android/desktop
 * "Install" button using the beforeinstallprompt event.
 */
(function () {
  "use strict";

  // Register the service worker for offline support.
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch((err) => {
        console.warn("Service worker registration failed:", err);
      });
    });
  }

  // Custom install prompt (Chrome/Edge on Android & desktop).
  let deferredPrompt = null;
  const btn = document.getElementById("install-btn");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (btn) btn.hidden = false;
  });

  if (btn) {
    btn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      try {
        await deferredPrompt.userChoice;
      } finally {
        deferredPrompt = null;
        btn.hidden = true;
      }
    });
  }

  // Hide the button once installed.
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    if (btn) btn.hidden = true;
  });
})();
