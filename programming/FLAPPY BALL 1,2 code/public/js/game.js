import { updateUserPoints } from "./shop.js";
import { saveScore, updateHighScore, incrementGamesPlayed, getUserStats } from "./firebase.js";
import { getCurrentUser } from "./main.js";
import { showMenu } from "./ui.js";

const gameCanvas = document.getElementById("game");
const ctx = gameCanvas.getContext("2d");

let flapListenerAdded = false;

export function startGame() {
  const views = ["loginView", "registerView", "menu", "userListView", "recordView", "shopView"];
  for (const id of views) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  }
  gameCanvas.style.display = "block";
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  runGame();
}

function runGame() {
  let y = 200;
  let velocity = 0;
  const gravity = 0.150;
  const flapStrength = -4;
  let score = 0;
  const pipes = [];
  const gap = 150;
  let frame = 0;
  let redDot = null;
  let gameEnded = false;
  let isNewHigh = false;

  const flap = () => { velocity = flapStrength; };
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

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(100, y, 20, 0, Math.PI * 2);
    ctx.fill();

    velocity += gravity;
    y += velocity;
    if (y > 580 || y < 0) return endGame();

    if (frame % 90 === 0) {
      const topHeight = Math.floor(Math.random() * 200) + 50;
      pipes.push({ x: 400, top: topHeight, bottom: topHeight + gap });
      if (pipes.length % 10 === 0) {
        redDot = { x: 425, y: topHeight + gap / 2, collected: false };
      }
    }

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

    if (redDot && !redDot.collected) {
      redDot.x -= 2;
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(redDot.x, redDot.y, 14, 0, Math.PI * 2);
      ctx.fill();

      if (Math.abs(redDot.x - 100) < 25 && Math.abs(redDot.y - y) < 25) {
        score += 5;
        redDot.collected = true;
      }
      if (redDot.x < -10) redDot = null;
    }

    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText("SCORE: " + score + " points", 10, 20);
    requestAnimationFrame(draw);
  }

  async function endGame() {
    if (gameEnded) return;
    gameEnded = true;
    clearInterval(scoreInterval);
    window.removeEventListener("keydown", flap);
    flapListenerAdded = false;

    const user = getCurrentUser();

    try {
      await saveScore(user, score);
      updateUserPoints(score);
      await incrementGamesPlayed(user);

      const stats = await getUserStats(user);
      if (!stats.highScore || score > stats.highScore) {
        await updateHighScore(user, score);
        isNewHigh = true;
      }
    } catch (e) {
      console.error("Error on endGame:", e);
    }

    const modal = document.getElementById("gameOverModal");
    const message = document.getElementById("gameOverMessage");
    const closeBtn = document.getElementById("gameOverCloseBtn");

    message.textContent = `Game Over! You earned: ${score} points${isNewHigh ? " - New High Score! 🎉" : ""}`;
    modal.style.display = "block";

    closeBtn.onclick = () => {
      modal.style.display = "none";
      showMenu();
    };
  }

  draw();
}
