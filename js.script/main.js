/* =========================
   PWA - INSTALAR COMO APP
========================= */

function setupPWA() {
    const manifestLink = document.createElement("link");
    manifestLink.rel = "manifest";

    if (window.location.pathname.includes("/pages/")) {
        manifestLink.href = "../manifest.json";
    } else {
        manifestLink.href = "./manifest.json";
    }

    document.head.appendChild(manifestLink);

    const themeColor = document.createElement("meta");
    themeColor.name = "theme-color";
    themeColor.content = "#ff6b35";
    document.head.appendChild(themeColor);

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            const serviceWorkerPath = window.location.pathname.includes("/pages/")
                ? "../service-worker.js"
                : "./service-worker.js";

            navigator.serviceWorker.register(serviceWorkerPath)
                .then(() => {
                    console.log("PWA activada correctamente");
                })
                .catch((error) => {
                    console.error("Error activando PWA:", error);
                });
        });
    }
}

setupPWA();