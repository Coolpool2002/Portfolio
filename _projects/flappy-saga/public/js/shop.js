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
    
    // Example: apply background change
    // document.body.style.backgroundImage = `url('images/${name}.jpg')`;
  } else {
    alert("Not enough points.");
  }
}

// Set up shop buttons and view logic
export function initShopView() {
  const shopBtn = document.getElementById("shopButton");
  const backFromShopBtn = document.getElementById("backFromShopButton");

  shopBtn.onclick = () => {
    document.getElementById("menu").style.display = "none";
    document.getElementById("shopView").style.display = "block";
  };

  backFromShopBtn.onclick = () => {
    document.getElementById("shopView").style.display = "none";
    document.getElementById("menu").style.display = "block";
  };

  const shopItems = [
    { id: "buyForestBtn", name: "forest", cost: 100 },
    { id: "buyNightBtn", name: "night", cost: 200 }
  ];

  shopItems.forEach(({ id, name, cost }) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.onclick = () => buyBackground(name, cost);
    }
  });
}
