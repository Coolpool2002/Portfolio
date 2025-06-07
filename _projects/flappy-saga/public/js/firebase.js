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
  databaseURL: "https://flappy-ball-2-leaderboard-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Save score to the scores list
export async function saveScore(name, score) {
  if (!name || typeof score !== "number") return;
  try {
    const scoresRef = ref(db, "scores");
    await push(scoresRef, {
      name,
      score,
      timestamp: Date.now(),
    });

    // Update high score if it's greater than current
    const userRef = ref(db, `users/${name}`);
    const snapshot = await get(userRef);
    const userData = snapshot.exists() ? snapshot.val() : {};
    const currentBest = userData.highScore || 0;

    if (score > currentBest) {
      await update(userRef, { highScore: score });
    }

  } catch (e) {
    console.error("Error saving score:", e);
  }
}

// Load top 10 high scores (best score per user)
export async function loadTopScores() {
  try {
    const scoresRef = ref(db, "users");
    const snapshot = await get(scoresRef);
    if (!snapshot.exists()) return [];

    const users = snapshot.val();
    const entries = Object.entries(users)
      .filter(([_, u]) => typeof u.highScore === "number")
      .map(([name, u]) => ({ name, score: u.highScore }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return entries;
  } catch (e) {
    console.error("Error loading scores:", e);
    return [];
  }
}

// Increment games played
export async function incrementGamesPlayed(username) {
  if (!username) return;
  try {
    const userRef = ref(db, `users/${username}`);
    const snapshot = await get(userRef);
    const data = snapshot.val() || {};
    const currentCount = data.gamesPlayed || 0;
    await set(userRef, {
      ...data,
      gamesPlayed: currentCount + 1,
    });
  } catch (e) {
    console.error("Error incrementing games played:", e);
  }
}
