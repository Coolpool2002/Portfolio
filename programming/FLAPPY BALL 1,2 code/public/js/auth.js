// == auth.js ==

export const users = { admin: "admin123" };
export let currentUser = null;

export function login(user, pass) {
  if (users[user] === pass) {
    currentUser = user;
    return true;
  }
  return false;
}

export function register(user, pass) {
  if (user && pass && !users[user]) {
    users[user] = pass;
    return true;
  }
  return false;
}

export function logout() {
  currentUser = null;
}

export function getCurrentUser() {
  return currentUser || "Guest";
}

export function isAdmin() {
  return currentUser === "admin";
} 
