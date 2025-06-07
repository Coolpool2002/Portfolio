import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  remove,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { startGame } from "./game.js";
import { loadTopScores } from "./firebase.js";

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
const gamesPlayedDisplay = document.getElementById("gamesPlayedDisplay");
const highScoreDisplay = document.getElementById("highScoreDisplay");

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

async function showMenu() {
  document.getElementById("currentUser").textContent = currentUser || "Guest";
  loginView.style.display = "none";
  registerView.style.display = "none";
  menu.style.display = "block";
  gameCanvas.style.display = "none";
  userListView.style.display = "none";
  recordView.style.display = "none";
  updateUserPoints(0);

  if (currentUser && currentUser !== "Guest") {
    const userRef = ref(db, `users/${currentUser}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      gamesPlayedDisplay.textContent = `Games Played: ${data.gamesPlayed || 0}`;
      highScoreDisplay.textContent = `High Score: ${data.highScore || 0}`;
    }
  } else {
    gamesPlayedDisplay.textContent = "";
    highScoreDisplay.textContent = "";
  }
}

const registerBtn = document.getElementById("registerButton");
registerBtn.onclick = async () => {
  const user = document.getElementById("registerUsername").value.trim();
  const pass = document.getElementById("registerPassword").value.trim();
  if (!user || !pass) return alert("Username and password required.");

  const userRef = ref(db, `users/${user}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    alert("User already exists.");
  } else {
    await set(userRef, { password: pass, points: 0, gamesPlayed: 0, highScore: 0 });
    alert("Account created!");
    showLogin();
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
  if (data.password === pass) {
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

const showRegisterLink = document.getElementById("showRegisterLink");
showRegisterLink.onclick = (e) => {
  e.preventDefault();
  showRegister();
};

const showLoginLink = document.getElementById("showLoginLink");
showLoginLink.onclick = (e) => {
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
  get(ref(db, "users")).then((snapshot) => {
    const users = snapshot.val();
    if (users) {
      Object.keys(users).forEach((user) => {
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
  try {
    const scores = await loadTopScores();
    recordList.innerHTML = "";
    if (scores.length === 0) {
      recordList.innerHTML = "No records found.";
    } else {
      scores.forEach((r, i) => {
        const div = document.createElement("div");
        const date = new Date(r.timestamp || Date.now()).toLocaleString();
        div.textContent = `#${i + 1} ${r.name}: ${r.score} points (${date})`;
        recordList.appendChild(div);
      });
    }
    menu.style.display = "none";
    recordView.style.display = "block";
  } catch (e) {
    console.error("Failed to load records:", e);
    recordList.innerHTML = "Failed to load records.";
  }
}

const savedUser = localStorage.getItem("flappyUser");
if (savedUser) {
  currentUser = savedUser;
  showMenu();
} else {
  showLogin();
}

export function getCurrentUser() {
  return currentUser;
}

export {
  getDatabase,
  ref,
  push,
  set,
  get,
  remove,
  updateUserPoints,
  loadTopScores,
};
