// == shop.js ==

import { getCurrentUser } from "./auth.js";
import { updatePointsDisplay } from "./ui.js";

const userPoints = {};

// Add score to user's points
export function updateUserPoints(score) {
  const user = getCurrentUser();
  if (!user) return;
  userPoints[user] = (userPoints[user] || 0) + score;
  updatePointsDisplay(userPoints[user]);
}

// Get current user's points
export function getUserPoints() {
  const user = getCurrentUser();
  return userPoints[user] || 0;
}

// Buy a background with point deduction
export function buyBackground(name, cost) {
  const user = getCurrentUser();
  const currentPoints = userPoints[user] || 0;

  if (currentPoints >= cost) {
    userPoints[user] -= cost;
    updatePointsDisplay(userPoints[user]);
    alert(`${name} background purchased!`);
    
    // TODO: Apply the background effect here
    // Example: document.body.style.backgroundImage = `url('images/${name}.jpg')`;
  } else {
    alert("Not enough points.");
  }
}

// Optional: provide raw access for UI display
export function getPoints(user) {
  return userPoints[user] || 0;
}

// Make buyBackground accessible to inline HTML buttons
window.buyBackground = buyBackground;
