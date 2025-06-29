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

// Get any user's points (for external UI display)
export function getPointsForUser(user) {
  return userPoints[user] || 0;
}

// Internal: purchase and feedback logic
function purchaseItem(name, cost, onSuccess) {
  const user = getCurrentUser();
  const currentPoints = userPoints[user] || 0;

  if (currentPoints >= cost) {
    userPoints[user] -= cost;
    updatePointsDisplay(userPoints[user]);
    alert(`${name} purchased!`);
    if (onSuccess) onSuccess();
  } else {
    alert("Not enough points.");
  }
}

// Set up shop buttons and logic
export function initShopView() {
  const shopBtn = document.getElementById("shopButton");
  const shopView = document.getElementById("shopView");
  const menu = document.getElementById("menu");
  const backBtn = document.getElementById("backFromShopButton");

  const buyForestBtn = document.getElementById("buyForestBtn");
  const buyNightBtn = document.getElementById("buyNightBtn");

  if (shopBtn && shopView && menu && backBtn) {
    shopBtn.onclick = () => {
      menu.style.display = "none";
      shopView.style.display = "block";
    };
    backBtn.onclick = () => {
      shopView.style.display = "none";
      menu.style.display = "block";
    };
  }

  if (buyForestBtn) {
    buyForestBtn.onclick = () =>
      purchaseItem("Forest Background", 100, () => {
        // Apply background logic here (optional)
        // document.body.style.backgroundImage = "url('images/forest.jpg')";
      });
  }

  if (buyNightBtn) {
    buyNightBtn.onclick = () =>
      purchaseItem("Night Background", 200, () => {
        // Apply background logic here (optional)
        // document.body.style.backgroundImage = "url('images/night.jpg')";
      });
  }
}
