let pending;
export function loadGoogleIdentity() {
  if (window.google?.accounts?.id)
    return Promise.resolve(window.google.accounts.id);
  if (pending) return pending;
  pending = new Promise((resolve, reject) => {
    let script = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (script?.dataset.failed === "true") {
      script.remove();
      script = null;
    }
    const created = !script;
    if (created) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
    }
    const cleanup = () => {
      clearTimeout(timeout);
      clearInterval(interval);
      script.removeEventListener("error", fail);
    };
    const fail = () => {
      cleanup();
      script.dataset.failed = "true";
      reject(
        new Error(
          "Google could not load. Check your connection or continue with email.",
        ),
      );
    };
    const check = () => {
      if (window.google?.accounts?.id) {
        cleanup();
        resolve(window.google.accounts.id);
      }
    };
    const timeout = setTimeout(fail, 12000);
    const interval = setInterval(check, 100);
    script.addEventListener("error", fail, { once: true });
    if (created) document.head.appendChild(script);
    check();
  }).catch((error) => {
    pending = null;
    throw error;
  });
  return pending;
}
