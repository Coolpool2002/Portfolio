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
console.log("Firebase connected:", app.name);

let currentUser = null;
const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");
const menu = document.getElementById("menu");
const userListView = document.getElementById("userListView");
const userList = document.getElementById("userList");
const gameCanvas = document.getElementById("game");
const recordView = document.getElementById("recordView");
const recordList = document.getElementById("recordList");
const pointsDisplay = document.getElementById("pointsDisplay");

async function updateUserPoints(score) {
  if (!currentUser) return;
  const pointsRef = ref(db, `users/${currentUser}/points`);
  const snapshot = await get(pointsRef);
  const currentPoints = snapshot.exists() ? snapshot.val() : 0;
  const newPoints = currentPoints + score;
  await set(pointsRef, newPoints);
  if (pointsDisplay) pointsDisplay.textContent = `Points: ${newPoints}`;
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
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
}

// Register
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

// Login
const loginBtn = document.getElementById("loginButton");
loginBtn.onclick = async () => {
  const user = document.getElementById("loginUsername").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();

  const userRef = ref(db, `users/${user}`);
  const snapshot = await get(userRef);
  if (!snapshot.exists()) return alert("User not found.");

  const data = snapshot.val();
  const hashed = await hashPassword(pass);
  if (data.password === hashed) {
    localStorage.setItem("flappyUser", user);
    currentUser = user;
    showMenu();
  } else {
    alert("Incorrect password.");
  }
};

// Guest
document.getElementById("guestLink").onclick = async (e) => {
  e.preventDefault();
  const guestName = "Guest_" + Math.floor(Math.random() * 10000);
  localStorage.setItem("flappyUser", guestName);
  currentUser = guestName;
  await set(ref(db, `users/${guestName}`), { password: "guest", points: 0 });
  showMenu();
};

// Logout
document.getElementById("logoutButton").onclick = () => {
  localStorage.removeItem("flappyUser");
  currentUser = null;
  showLogin();
};

// UI Nav

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
        div.textContent = user === "admin" ? "admin (protected)" : user;
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
  const scores = Object.values(snapshot.val()).sort((a, b) => b.score - a.score).slice(0, 10);
  for (const s of scores) {
    const div = document.createElement("div");
    div.textContent = `${s.name}: ${s.score} points`;
    recordList.appendChild(div);
  }
}

// Auto-login if remembered
const savedUser = localStorage.getItem("flappyUser");
if (savedUser) {
  currentUser = savedUser;
  updateUserPoints(0).then(showMenu);
} else {
  showLogin();
}

// Export to be used by game.js
export { getDatabase, ref, push, set, get, remove, updateUserPoints, currentUser as getCurrentUser };
