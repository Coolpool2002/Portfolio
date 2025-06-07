// == users.js ==

import { users, isAdmin } from "./auth.js";
import { showMenu } from "./ui.js";

const userListView = document.getElementById("userListView");
const userList = document.getElementById("userList");

export function showUsers() {
  userList.innerHTML = "";
  Object.keys(users).forEach(user => {
    const div = document.createElement("div");
    div.style.textAlign = "center";
    div.style.marginBottom = "10px";

    const span = document.createElement("span");
    span.textContent = user;
    span.style.display = "inline-block";
    span.style.width = "200px";
    span.style.color = "white";
    div.appendChild(span);

    if (isAdmin()) {
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.disabled = user === "admin";
      delBtn.addEventListener("click", () => deleteUser(user));
      div.appendChild(delBtn);
    }

    userList.appendChild(div);
  });

  document.getElementById("menu").style.display = "none";
  userListView.style.display = "block";
}

function deleteUser(username) {
  if (!isAdmin() || username === "admin") return;
  if (confirm(`Delete '${username}'?`)) {
    delete users[username];
    showUsers();
  }
} 
