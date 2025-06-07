// == main.js ==

import { login, register, logout } from "./auth.js";
import { showLogin, showRegister, showMenu } from "./ui.js";
import { startGame } from "./game.js";
import { showUsers } from "./users.js";
import { showRecords } from "./firebase.js";
import { updateUserPoints, initShopView } from "./shop.js";

// DOM Elements
const loginBtn = document.getElementById("loginButton");
const registerBtn = document.getElementById("registerButton");
const guestLink = document.getElementById("guestLink");
const showRegisterLink = document.getElementById("showRegisterLink");
const showLoginLink = document.getElementById("showLoginLink");
const logoutBtn = document.getElementById("logoutButton");
const startGameBtn = document.getElementById("startGameButton");
const manageUsersBtn = document.getElementById("manageUsersButton");
const viewRecordsBtn = document.getElementById("viewRecordsButton");
const backFromUsersBtn = document.getElementById("backFromUsersButton");
const backFromRecordsBtn = document.getElementById("backFromRecordsButton");

// Login flow
loginBtn.onclick = () => {
  const user = document.getElementById("loginUsername").value;
  const pass = document.getElementById("loginPassword").value;
  if (login(user, pass)) {
    showMenu();
  } else {
    alert("Incorrect login.");
  }
};

registerBtn.onclick = () => {
  const user = document.getElementById("registerUsername").value;
  const pass = document.getElementById("registerPassword").value;
  if (register(user, pass)) {
    alert("Account created!");
    showLogin();
  } else {
    alert("Invalid input or user exists.");
  }
};

guestLink.onclick = (e) => {
  e.preventDefault();
  login("Guest", "");
  showMenu();
};

showRegisterLink.onclick = (e) => {
  e.preventDefault();
  showRegister();
};

showLoginLink.onclick = (e) => {
  e.preventDefault();
  showLogin();
};

logoutBtn.onclick = () => {
  logout();
  showLogin();
};

// Navigation
startGameBtn.onclick = () => startGame();
manageUsersBtn.onclick = () => showUsers();
viewRecordsBtn.onclick = () => showRecords();
backFromUsersBtn.onclick = () => showMenu();
backFromRecordsBtn.onclick = () => showMenu();

// Initialize shop logic
initShopView();

// Start at login screen
showLogin();
