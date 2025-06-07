<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Account Management + Flappy Bird</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #1e1e1e;
      color: #f5f5f5;
      text-align: center;
      padding: 40px;
    }
    input, button {
      margin: 5px;
      padding: 10px;
      font-size: 1rem;
    }
    #menu, #game, #loginView, #registerView, #userListView, #recordView, #shopView {
      display: none;
    }
  </style>
</head>
<body>

  <!-- Login View -->
  <div id="loginView">
    <h1>Login</h1>
    <input type="text" id="loginUsername" placeholder="Username" /><br />
    <input type="password" id="loginPassword" placeholder="Password" /><br />
    <button id="loginButton">Login</button>
    <p>
      Don't have an account? <a href="#" id="showRegisterLink">Register here</a>
    </p>
    <p><a href="#" id="guestLink">Sign in as Guest</a></p>
  </div>

  <!-- Register View -->
  <div id="registerView">
    <h1>Register</h1>
    <input type="text" id="registerUsername" placeholder="Username" /><br />
    <input type="password" id="registerPassword" placeholder="Password" /><br />
    <button id="registerButton">Register</button>
    <p>
      Already have an account? <a href="#" id="showLoginLink">Login</a>
    </p>
  </div>

  <!-- Main Menu -->
  <div id="menu">
    <h1>Welcome, <span id="currentUser"></span></h1>
    <div id="pointsDisplay"></div>
    <div id="gamesPlayedDisplay"></div>
    <div id="highScoreDisplay"></div>
    <button id="startGameButton">Play Flappy Ball 2</button>
    <button id="manageUsersButton">Manage Users</button>
    <button id="viewRecordsButton">View Records</button>
    <button id="logoutButton">Logout</button>
    <button id="shopButton">Shop</button>
  </div>

  <!-- Shop -->
  <div id="shopView">
    <h2>Shop</h2>
    <div id="pointsDisplay"></div>
    <button id="buyForestBtn">Buy Forest Background (100 points)</button>
    <button id="buyNightBtn">Buy Night Background (200 points)</button>
    <button id="backFromShopButton">Back</button>
  </div>

  <!-- User List -->
  <div id="userListView">
    <h2>All Users</h2>
    <div id="userList"></div>
    <button id="backFromUsersButton">Back</button>
  </div>

  <!-- Records -->
  <div id="recordView">
    <h2>All Scores</h2>
    <div id="recordList"></div>
    <button id="backFromRecordsButton">Back</button>
  </div>

  <!-- Game Canvas -->
  <canvas id="game" width="400" height="600"></canvas>

  <!-- Game Over Modal -->
  <div
    id="gameOverModal"
    style="
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      font-size: 2rem;
      text-align: center;
      padding-top: 20vh;
      z-index: 9999;
    "
  >
    <div id="gameOverMessage"></div>
    <button
      id="gameOverCloseBtn"
      style="font-size: 1.5rem; margin-top: 20px; cursor: pointer"
    >
      Close
    </button>
  </div>

  <!-- Load Main JS -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
