// popup.js – UI logic with GIF fox + GIF confetti

document.addEventListener("DOMContentLoaded", () => {

    chrome.runtime.sendMessage("POPUP_REQUEST_DATA", (store) => {

        if (!store) return;

        updateStreakDisplay(store.currentStreak);
        updateXPDisplay(store.xp);
        updateLongest(store.longestStreak);
        updateGoalFill(store.lastTotalSolved, store.lastSolveTime);

        switchFoxState(store.currentStreak, store.lastSolveTime);

        drawRing("streakRing",
                 Math.min(store.currentStreak / 30, 1),
                 "#FFA31A");

        drawRing("xpRing",
                 Math.min(store.xp / 300, 1),
                 "#32D74B");

        updateQuote();
        updateBadge(store.currentStreak);

    });
});


// 🧡 streak label
function updateStreakDisplay(streak) {
    document.getElementById("streakDisplay").textContent =
        "Streak: " + streak + "🔥";
}


// 🧡 XP label
function updateXPDisplay(xp) {
    document.getElementById("xpDisplay").textContent =
        "XP: " + xp;
}


// 🧡 goal bar logic
function updateGoalFill(totalSolved, lastTime) {

    if (!lastTime) {
        document.getElementById("goalFill").style.width = "0%";
        return;
    }

    const now = Date.now();
    const diffHours = (now - lastTime) / 36e5;

    document.getElementById("goalFill").style.width =
        diffHours <= 24 ? "100%" : "0%";

    document.getElementById("goalText").textContent =
        diffHours <= 24 ? "Goal reached!" : "Solve 1 problem today";
}



// 🦊 fox + confetti state
function switchFoxState(streak, lastTime) {

    const fox = document.getElementById("foxImage");
    const confetti = document.getElementById("confettiImage");

    if (!lastTime) {
        fox.src = "assets/fox_idle.gif";
        confetti.style.display = "none";
        return;
    }

    const recent = (Date.now() - lastTime) <= 86400000;

    if (recent && streak > 0) {

        fox.src = "assets/fox_happy.gif";

        // confetti effect
        confetti.style.display = "block";
        setTimeout(() => {
            confetti.style.display = "none";
        }, 1200);

    } else {
        fox.src = "assets/fox_idle.gif";
        confetti.style.display = "none";
    }
}



// ✨ Quote rotation
function updateQuote() {

    const quotes = [
        "One problem a day keeps fear away.",
        "Discipline creates opportunities.",
        "Future you thanks present you.",
        "Keep going — no zero days.",
        "You’re building something powerful."
    ];

    const pick = quotes[Math.floor(Math.random() * quotes.length)];

    document.getElementById("quoteText").textContent = pick;
}



// ================== PROGRESS RINGS ===================== //

function drawRing(canvasId, percent, color) {

    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    canvas.width = 70;
    canvas.height = 70;

    ctx.clearRect(0, 0, 70, 70);

    // background grey ring
    ctx.beginPath();
    ctx.arc(35, 35, 28, 0, Math.PI * 2);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 7;
    ctx.stroke();

    // progress portion
    ctx.beginPath();
    ctx.arc(
        35,
        35,
        28,
        -Math.PI / 2,
        (-Math.PI / 2) + (Math.PI * 2 * percent),
        false
    );
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.stroke();
}



// 🧡 badge opacity rule
function updateBadge(streak) {

    const badge = document.getElementById("mainBadge");

    if (!badge) return;

    if (streak >= 1) {
        badge.style.opacity = "1";
    } else {
        badge.style.opacity = "0.25";
    }
}



// 🧡 longest streak
function updateLongest(longest) {
    document.getElementById("longestDisplay").textContent =
        "Longest streak: " + longest + "🔥";
}
