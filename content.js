// content.js - listens for fetch requests from background
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    if (msg === "FETCH_SOLVED_COUNT") {

        // Inject script into the page
        const script = document.createElement("script");
        script.src = chrome.runtime.getURL("pageFetch.js");

        script.onload = function () {
            this.remove();
        };

        document.documentElement.appendChild(script);

        // Wait for page script message
        window.addEventListener("message", function receive(event) {
            if (event.source !== window) return;

            if (event.data.type === "SOLVED_COUNT_RESULT") {
                window.removeEventListener("message", receive);

                sendResponse({
                    success: true,
                    data: event.data.payload
                });
            }
        });

        return true;
    }
});
