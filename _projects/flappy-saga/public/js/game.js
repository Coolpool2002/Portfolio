// == game.js ==

import { updateUserPoints } from "./shop.js";
import { saveScore } from "./firebase.js";
import { getCurrentUser } from "./auth.js";
import { showMenu, updatePointsDisplay } from "./ui.js";

const gameCanvas = document.getElementById("game");
const ctx = gameCanvas.getContext("2d");

let flapListenerAdded = false;

export function startGame() {
  // Hide all other views
  const views = ["loginView", "registerView", "menu", "userListView", "recordView", "shopView"];
  for (const id of views) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  }

  // Show canvas
  gameCanvas.style.display = "block";

  // Clear the canvas before starting
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  runGame(); // Start game logic
}

function runGame() {
  let y = 200;
  let velocity = 0;
  const gravity = 0.15;
  const flapStrength = -4;
  let score = 0;
  const pipes = [];
  const redDots = [];
  const gap = 150;
  let frame = 0;
  let pipeCount = 0;
  let gameEnded = false;

  const flap = () => {
    velocity = flapStrength;
  };

  if (!flapListenerAdded) {
    window.addEventListener("keydown", flap);
    flapListenerAdded = true;
  }

  const scoreInterval = setInterval(() => score++, 1000);

  function draw() {
    if (gameEnded) return;

    frame++;
    ctx.clearRect(0, 0, 400, 600);
    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, 400, 600);

    // Draw player
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(100, y, 20, 0, Math.PI * 2);
    ctx.fill();

    velocity += gravity;
    y += velocity;

    if (y > 580 || y < 0) return endGame();

    // Pipes generation
    if (frame % 90 === 0) {
      const topHeight = Math.floor(Math.random() * 200) + 50;
      pipes.push({ x: 400, top: topHeight, bottom: topHeight + gap });
      pipeCount++;

      // Spawn red dot every 10 pipes
      if (pipeCount % 10 === 0) {
        const dotY = topHeight + gap / 2;
        redDots.push({ x: 425, y: dotY, radius: 14, collected: false });
      }
    }

    // Draw pipes and check collisions
    ctx.fillStyle = "green";
    for (let pipe of pipes) {
      pipe.x -= 2;
      ctx.fillRect(pipe.x, 0, 50, pipe.top);
      ctx.fillRect(pipe.x, pipe.bottom, 50, 600 - pipe.bottom);

      const hitPipe =
        100 + 20 > pipe.x &&
        100 - 20 < pipe.x + 50 &&
        (y - 20 < pipe.top || y + 20 > pipe.bottom);

      if (hitPipe) return endGame();
    }

    // Draw and check red dots
    for (let i = redDots.length - 1; i >= 0; i--) {
      const dot = redDots[i];
      if (dot.collected) continue;

      dot.x -= 2;

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      ctx.fill();

      const dx = dot.x - 100;
      const dy = dot.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < dot.radius + 20) {
        score += 15;
        dot.collected = true;
      }

      if (dot.x < -10) redDots.splice(i, 1);
    }

    // Score display
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText("SCORE: " + score + " points", 10, 20);

    requestAnimationFrame(draw);
  }

  function endGame() {
    if (gameEnded) return;
    gameEnded = true;

    clearInterval(scoreInterval);
    window.removeEventListener("keydown", flap);
    flapListenerAdded = false;

    try {
      saveScore(getCurrentUser(), score);
      updateUserPoints(score);
    } catch (e) {
      console.error("Error during game over:", e);
    }

    alert("Game Over! You earned: " + score + " points");
    showMenu();
  }

  draw();
}
