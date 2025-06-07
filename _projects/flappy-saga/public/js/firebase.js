// == firebase.js ==

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, get, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAytbPQR5h8w8YmR-zo-xpBNn6lYlVmZjk",
  authDomain: "flappy-ball-2-leaderboard.firebaseapp.com",
  projectId: "flappy-ball-2-leaderboard",
  storageBucket: "flappy-ball-2-leaderboard.appspot.com",
  messagingSenderId: "678584043682",
  appId: "1:678584043682:web:869514b82e6b4676c82ffb",
  measurementId: "G-6MDV8B1CCP",
  databaseURL: "https://flappy-ball-2-leaderboard-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function saveScore(name, score) {
  try {
    if (typeof name !== "string" || name.trim() === "") throw new Error("Invalid name");
    if (typeof score !== "number" || isNaN(score) || score < 0) throw new Error("Invalid score");

    const scoresRef = ref(db, "scores");
    const newScoreRef = push(scoresRef);
    await set(newScoreRef, {
      name: name.trim(),
      score,
      timestamp: Date.now()
    });
  } catch (e) {
    console.error("Failed to save score:", e);
  }
}

export async function loadTopScores() {
  try {
    const scoresRef = ref(db, "scores");
    const snapshot = await get(scoresRef);
    if (!snapshot.exists()) return [];

    const raw = snapshot.val();
    const scores = Object.keys(raw).map(key => raw[key]);

    const validScores = scores.filter(s =>
      typeof s.score === "number" &&
      typeof s.name === "string" &&
      s.name.trim().length > 0
    );

    return validScores.sort((a, b) => b.score - a.score).slice(0, 10);
  } catch (e) {
    console.error("Failed to load scores:", e);
    return [];
  }
}

export async function showRecords() {
  const recordView = document.getElementById("recordView");
  const recordList = document.getElementById("recordList");

  recordView.style.display = "block";
  recordList.innerHTML = "Loading...";

  try {
    const scores = await loadTopScores();
    recordList.innerHTML = "";

    if (scores.length === 0) {
      recordList.innerHTML = "No records found.";
    } else {
      scores.forEach(r => {
        const div = document.createElement("div");
        div.textContent = `${r.name}: ${r.score} points`;
        recordList.appendChild(div);
      });
    }
  } catch (e) {
    console.error("Error loading records:", e);
    recordList.innerHTML = "Failed to load records.";
  }
}
