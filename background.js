// background.js – master logic with injected fetch communication

const USERNAME = "aarya_p12";

// run at install to initialize storage defaults
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        lastTotalSolved: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastSolveTime: 0,
        xp: 0
    });
});

// ask content script for solved count
async function requestSolvedCount() {

    return new Promise((resolve) => {

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

            if (!tabs[0]) return resolve(null);

            chrome.tabs.sendMessage(
                tabs[0].id,
                "FETCH_SOLVED_COUNT",
                (response) => {

                    if (!response || !response.data) {
                        resolve(null);
                    } else {
                        resolve(response.data);
                    }
                }
            );
        });
    });
}

// check streak logic
async function updateStreak() {

    const solved = await requestSolvedCount();
    if (!solved || solved.error) return;

    chrome.storage.local.get([
        "lastTotalSolved",
        "currentStreak",
        "longestStreak",
        "lastSolveTime",
        "xp"
    ], (store) => {

        const { lastTotalSolved, lastSolveTime } = store;

        const now = Date.now();
        const TIMEZONE_OFFSET = 3; // 3AM reset rule

        let shouldIncrement = false;

        if (solved.totalSolved > lastTotalSolved) {
            shouldIncrement = true;
        }

        if (shouldIncrement) {

            let newStreak = store.currentStreak + 1;
            let newXP = store.xp + 10; 

            chrome.storage.local.set({
                lastTotalSolved: solved.totalSolved,
                lastSolveTime: now,
                currentStreak: newStreak,
                longestStreak: Math.max(store.longestStreak, newStreak),
                xp: newXP
            });

        } else {

            const hoursSinceLast = (now - lastSolveTime) / 36e5;

            if (hoursSinceLast > (24 + TIMEZONE_OFFSET)) {

                chrome.storage.local.set({
                    currentStreak: 0
                });
            }
        }
    });
}

// run every 6 hours automatically
chrome.alarms.create("leetcodeCheck", {
    periodInMinutes: 360
});

// alarm event
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "leetcodeCheck") {
        updateStreak();
    }
});

// message path for popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    if (msg === "POPUP_REQUEST_DATA") {

        chrome.storage.local.get([
            "lastTotalSolved",
            "currentStreak",
            "longestStreak",
            "lastSolveTime",
            "xp"
        ], (store) => {
            sendResponse(store);
        });

        return true;
    }
});
