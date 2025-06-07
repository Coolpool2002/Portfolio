// == main.js ==

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, get, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { startGame } from "./game.js";

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

let currentUser = null;
const userPoints = {};

const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");
const menu = document.getElementById("menu");
const userListView = document.getElementById("userListView");
const userList = document.getElementById("userList");
const gameCanvas = document.getElementById("game");
const recordView = document.getElementById("recordView");
const recordList = document.getElementById("recordList");
const pointsDisplay = document.getElementById("pointsDisplay");

function updateUserPoints(score) {
  if (!currentUser) return;
  userPoints[currentUser] = (userPoints[currentUser] || 0) + score;
  if (pointsDisplay) pointsDisplay.textContent = `Points: ${userPoints[currentUser]}`;
}

function showLogin() {
  loginView.style.display = "block";
  registerView.style.display = "none";
  menu.style.display = "none";
  gameCanvas.style.display = "none";
  userListView.style.display = "none";
  recordView.style.display = "none";
}

function showRegister() {
  loginView.style.display = "none";
  registerView.style.display = "block";
  menu.style.display = "none";
  gameCanvas.style.display = "none";
  userListView.style.display = "none";
  recordView.style.display = "none";
}

function showMenu() {
  document.getElementById("currentUser").textContent = currentUser || "Guest";
  loginView.style.display = "none";
  registerView.style.display = "none";
  menu.style.display = "block";
  gameCanvas.style.display = "none";
  userListView.style.display = "none";
  recordView.style.display = "none";
  updateUserPoints(0);

  // Display personal best
  get(ref(db, `scores`)).then(snapshot => {
    if (snapshot.exists()) {
      const scores = Object.values(snapshot.val());
      const best = scores.filter(s => s.name === currentUser).reduce((max, s) => s.score > max ? s.score : max, 0);
      const div = document.createElement("div");
      div.textContent = `Your Personal Best: ${best} points`;
      pointsDisplay.appendChild(div);
    }
  });
}

const registerBtn = document.getElementById("registerButton");
registerBtn.onclick = async () => {
  const user = document.getElementById("registerUsername").value.trim();
  const pass = document.getElementById("registerPassword").value.trim();
  if (!user || !pass) return alert("Username and password required.");

  try {
    const userRef = ref(db, `users/${user}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      alert("User already exists.");
    } else {
      const hashed = await hashPassword(pass);
      await set(userRef, { password: hashed, points: 0 });
      alert("Account created!");
      showLogin();
    }
  } catch (err) {
    console.error("Failed to register user:", err);
    alert("Registration failed. Check console.");
  }
};

const loginBtn = document.getElementById("loginButton");
loginBtn.onclick = async () => {
  const user = document.getElementById("loginUsername").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();

  const userRef = ref(db, `users/${user}`);
  const snapshot = await get(userRef);
  if (!snapshot.exists()) return alert("User not found.");

  const data = snapshot.val();
  if (data.password === await hashPassword(pass)) {
    localStorage.setItem("flappyUser", user);
    currentUser = user;
    showMenu();
  } else {
    alert("Incorrect password.");
  }
};

document.getElementById("guestLink").onclick = (e) => {
  e.preventDefault();
  localStorage.setItem("flappyUser", "Guest");
  currentUser = "Guest";
  showMenu();
};

document.getElementById("logoutButton").onclick = () => {
  localStorage.removeItem("flappyUser");
  currentUser = null;
  showLogin();
};

document.getElementById("showRegisterLink").onclick = (e) => {
  e.preventDefault();
  showRegister();
};

document.getElementById("showLoginLink").onclick = (e) => {
  e.preventDefault();
  showLogin();
};

document.getElementById("startGameButton").onclick = () => startGame();
document.getElementById("manageUsersButton").onclick = () => showUsers();
document.getElementById("viewRecordsButton").onclick = () => showRecords();
document.getElementById("backFromUsersButton").onclick = () => showMenu();
document.getElementById("backFromRecordsButton").onclick = () => showMenu();
document.getElementById("buyForestBtn").onclick = () => alert("Feature not implemented.");
document.getElementById("buyNightBtn").onclick = () => alert("Feature not implemented.");
document.getElementById("backFromShopButton").onclick = () => showMenu();

function showUsers() {
  userList.innerHTML = "";
  get(ref(db, "users")).then(snapshot => {
    const users = snapshot.val();
    if (users) {
      Object.keys(users).forEach(user => {
        const div = document.createElement("div");
        div.textContent = user;
        userList.appendChild(div);
      });
    }
  });
  menu.style.display = "none";
  userListView.style.display = "block";
}

async function showRecords() {
  recordList.innerHTML = "Loading...";
  const snapshot = await get(ref(db, "scores"));
  recordList.innerHTML = "";
  if (!snapshot.exists()) {
    recordList.innerHTML = "No records found.";
    return;
  }
  const rawScores = Object.values(snapshot.val());
  const bestPerUser = {};
  for (const s of rawScores) {
    if (!bestPerUser[s.name] || bestPerUser[s.name].score < s.score) {
      bestPerUser[s.name] = s;
    }
  }
  const scores = Object.values(bestPerUser).sort((a, b) => b.score - a.score).slice(0, 10);
  scores.forEach((s, i) => {
    const div = document.createElement("div");
    const time = new Date(s.timestamp).toLocaleString();
    div.textContent = `#${i + 1} ${s.name}: ${s.score} points (${time})`;
    recordList.appendChild(div);
  });
}

async function saveScore(name, score) {
  if (!name || typeof score !== "number") return;
  const scoresRef = ref(db, "scores");
  const newScoreRef = push(scoresRef);
  await set(newScoreRef, {
    name,
    score,
    timestamp: Date.now()
  });
}

async function hashPassword(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

const savedUser = localStorage.getItem("flappyUser");
if (savedUser) {
  currentUser = savedUser;
  showMenu();
} else {
  showLogin();
}

export {
  getDatabase,
  ref,
  push,
  set,
  get,
  remove,
  updateUserPoints,
  saveScore,
  currentUser as getCurrentUser
};
