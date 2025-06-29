import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
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

function getCurrentUser() {
  return localStorage.getItem("flappyUser") || "Guest";
}

function updateUserPoints(score) {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  let points = Number(pointsDisplay.textContent.replace(/[^\d]/g, "")) || 0;
  points += score;
  pointsDisplay.textContent = `Points: ${points}`;
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
  const currentUser = getCurrentUser();

  document.getElementById("currentUser").textContent = currentUser;
  loginView.style.display = "none";
  registerView.style.display = "none";
  menu.style.display = "block";
  gameCanvas.style.display = "none";
  userListView.style.display = "none";
  recordView.style.display = "none";

  if (currentUser !== "Guest") {
    const userRef = ref(db, `users/${currentUser}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      gamesPlayedDisplay.textContent = `Games Played: ${data.gamesPlayed || 0}`;
      highScoreDisplay.textContent = `High Score: ${data.highScore || 0}`;
      pointsDisplay.textContent = `Points: ${data.points || 0}`;
    } else {
      gamesPlayedDisplay.textContent = "";
      highScoreDisplay.textContent = "";
      pointsDisplay.textContent = "";
    }
  } else {
    gamesPlayedDisplay.textContent = "";
    highScoreDisplay.textContent = "";
    pointsDisplay.textContent = "";
  }
}

document.getElementById("registerButton").onclick = async () => {
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

document.getElementById("loginButton").onclick = async () => {
  const user = document.getElementById("loginUsername").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();

  const userRef = ref(db, `users/${user}`);
  const snapshot = await get(userRef);
  if (!snapshot.exists()) return alert("User not found.");

  const data = snapshot.val();
  if (data.password === pass) {
    localStorage.setItem("flappyUser", user);
    await showMenu();
  } else {
    alert("Incorrect password.");
  }
};

document.getElementById("guestLink").onclick = (e) => {
  e.preventDefault();
  localStorage.setItem("flappyUser", "Guest");
  showMenu();
};

document.getElementById("logoutButton").onclick = () => {
  localStorage.removeItem("flappyUser");
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
  get(ref(db, "users"))
    .then((snapshot) => {
      const users = snapshot.val();
      if (users) {
        Object.keys(users).forEach((user) => {
          const div = document.createElement("div");
          div.textContent = user;
          userList.appendChild(div);
        });
      }
    })
    .catch((e) => console.error("Error loading users:", e));

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

window.onload = () => {
  if (localStorage.getItem("flappyUser")) {
    showMenu();
  } else {
    showLogin();
  }
};

export { getCurrentUser, updateUserPoints };