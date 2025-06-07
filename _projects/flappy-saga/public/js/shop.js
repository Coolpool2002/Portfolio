// == shop.js ==

import { getCurrentUser } from "./auth.js";
import { updatePointsDisplay } from "./ui.js";

const userPoints = {};

export function updateUserPoints(score) {
  const user = getCurrentUser();
  if (!user) return;
  userPoints[user] = (userPoints[user] || 0) + score;
  updatePointsDisplay(userPoints[user]);
}

export function getUserPoints() {
  const user = getCurrentUser();
  return userPoints[user] || 0;
}

export function buyBackground(name, cost) {
  const user = getCurrentUser();
  if ((userPoints[user] || 0) >= cost) {
    userPoints[user] -= cost;
    updatePointsDisplay(userPoints[user]);
    alert(`${name} background purchased!`);
    // background switching logic can be added here
  } else {
    alert("Not enough points.");
  }
} 
