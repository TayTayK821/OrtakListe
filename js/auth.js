import { auth } from "./firebase-init.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const loginGate = document.getElementById("login-gate");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const app = document.getElementById("app");
const logoutBtn = document.getElementById("logout-btn");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.hidden = true;
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    loginError.textContent = "Giriş olmadı — e-posta ya da şifreyi kontrol et.";
    loginError.hidden = false;
  }
});

logoutBtn.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginGate.hidden = true;
    app.hidden = false;
    document.dispatchEvent(new CustomEvent("app:authenticated", { detail: { user } }));
  } else {
    app.hidden = true;
    loginGate.hidden = false;
  }
});
