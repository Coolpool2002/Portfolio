import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  update,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAytbPQR5h8w8YmR-zo-xpBNn6lYlVmZjk",
  authDomain: "flappy-ball-2-leaderboard.firebaseapp.com",
  projectId: "flappy-ball-2-leaderboard",
  storageBucket: "flappy-ball-2-leaderboard.appspot.com",
  messagingSenderId: "678584043682",
  appId: "1:678584043682:web:869514b82e6b4676c82ffb",
  measurementId: "G-6MDV8B1CCP",
  databaseURL:
    "https://flappy-ball-2-leaderboard-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function saveScore(name, score) {
  try {
    if (!name || typeof score !== "number" || score < 0) throw new Error("Invalid data");
    const scoresRef = ref(db, "scores");
    const newScoreRef = push(scoresRef);
    await set(newScoreRef, {
      name,
      score,
      timestamp: Date.now(),
    });
  } catch (e) {
    console.error("Failed to save score:", e);
  }
}

async function loadTopScores() {
  try {
    const scoresRef = ref(db, "scores");
    const snapshot = await get(scoresRef);
    if (!snapshot.exists()) return [];

    const raw = snapshot.val();
    const bestScores = {};

    for (const key in raw) {
      const { name, score, timestamp } = raw[key];
      if (!name || typeof score !== "number") continue;

      if (!bestScores[name] || score > bestScores[name].score) {
        bestScores[name] = { name, score, timestamp };
      }
    }

    return Object.values(bestScores).sort((a, b) => b.score - a.score).slice(0, 10);
  } catch (e) {
    console.error("Failed to load scores:", e);
    return [];
  }
}

async function incrementGamesPlayed(username) {
  if (!username || username === "Guest") return;
  const userRef = ref(db, `users/${username}`);
  try {
    const snapshot = await get(userRef);
    const data = snapshot.val() || {};
    const count = data.gamesPlayed || 0;
    await update(userRef, { gamesPlayed: count + 1 });
  } catch (e) {
    console.error("Failed to increment games played:", e);
  }
}

async function updateHighScore(username, score) {
  if (!username || username === "Guest") return false;
  const userRef = ref(db, `users/${username}`);
  try {
    const snapshot = await get(userRef);
    const data = snapshot.val() || {};
    const currentHigh = data.highScore || 0;

    if (score > currentHigh) {
      await update(userRef, { highScore: score });
      return true;
    }
  } catch (err) {
    console.error("Error updating high score:", err);
  }
  return false;
}

async function getUserStats(username) {
  if (!username || username === "Guest") return null;
  const userRef = ref(db, `users/${username}`);

  try {
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (e) {
    console.error("Failed to get user stats:", e);
    return null;
  }
}

export {
  saveScore,
  loadTopScores,
  incrementGamesPlayed,
  updateHighScore,
  getUserStats,
};
