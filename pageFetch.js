// pageFetch.js - runs in LeetCode page context

(async function () {
    const query = `
        {
          matchedUser(username: "aarya_p12") {
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
    `;

    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ query })
        });

        const json = await response.json();

        const submissions = json?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];

        let totalSolved = 0;
        let easy = 0, medium = 0, hard = 0;

        submissions.forEach(item => {
            if (item.difficulty === "Easy") easy = item.count;
            if (item.difficulty === "Medium") medium = item.count;
            if (item.difficulty === "Hard") hard = item.count;
            totalSolved += item.count;
        });

        window.postMessage({
            type: "SOLVED_COUNT_RESULT",
            payload: {
                totalSolved,
                easy,
                medium,
                hard,
                timestamp: Date.now()
            }
        }, "*");

    } catch (err) {
        window.postMessage({
            type: "SOLVED_COUNT_RESULT",
            payload: {
                error: true,
                message: err.toString()
            }
        }, "*");
    }
})();
