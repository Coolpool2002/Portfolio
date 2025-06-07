// == ui.js ==

import { getCurrentUser } from "./auth.js";
import { getPointsForUser } from "./shop.js";

const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");
const menu = document.getElementById("menu");
const gameCanvas = document.getElementById("game");
const userListView = document.getElementById("userListView");
const recordView = document.getElementById("recordView");
const pointsDisplay = document.getElementById("pointsDisplay");
const currentUserDisplay = document.getElementById("currentUser");

export function showLogin() {
  loginView.style.display = "block";
  registerView.style.display = "none";
  menu.style.display = "none";
  gameCanvas.style.display = "none";
  userListView.style.display = "none";
  recordView.style.display = "none";
}

export function showRegister() {
  loginView.style.display = "none";
  registerView.style.display = "block";
  menu.style.display = "none";
  gameCanvas.style.display = "none";
  userListView.style.display = "none";
  recordView.style.display = "none";
}

export function showMenu() {
  if (currentUserDisplay) currentUserDisplay.textContent = getCurrentUser();
  loginView.style.display = "none";
  registerView.style.display = "none";
  menu.style.display = "block";
  gameCanvas.style.display = "none";
  userListView.style.display = "none";
  recordView.style.display = "none";
  updatePointsDisplay();
}

export function updatePointsDisplay(points) {
  if (pointsDisplay) {
    const displayPoints =
      typeof points === "number" ? points : getPointsForUser(getCurrentUser());
    pointsDisplay.textContent = `Points: ${displayPoints}`;
  }
}
