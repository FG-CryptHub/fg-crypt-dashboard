import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const cfg = window.__CONFIG ?? {};
const app = initializeApp(cfg.firebase);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const gateEl = document.getElementById("auth-gate");
const appEl = document.getElementById("app");
const emailEl = document.getElementById("user-email");
const signInBtn = document.getElementById("sign-in");
const signOutBtn = document.getElementById("sign-out");
const errEl = document.getElementById("gate-error");

function show(el) { el?.removeAttribute("hidden"); }
function hide(el) { el?.setAttribute("hidden", ""); }

function showGate(msg) {
  show(gateEl);
  hide(appEl);
  if (errEl) {
    if (msg) { errEl.textContent = msg; show(errEl); }
    else { hide(errEl); }
  }
}

function showApp(user) {
  hide(gateEl);
  show(appEl);
  if (emailEl) emailEl.textContent = user.email ?? "";
}

signInBtn?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    showGate(e?.message ?? "Sign-in failed.");
  }
});

signOutBtn?.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, async (user) => {
  if (!user) return showGate();

  const allowed = (cfg.allowedEmails ?? []).map((e) => e.toLowerCase());
  if (!allowed.includes((user.email ?? "").toLowerCase())) {
    await signOut(auth);
    return showGate("This account is not authorized.");
  }

  showApp(user);

  window.__auth = {
    user,
    getFreshToken: () => user.getIdToken(),
  };
  window.dispatchEvent(new CustomEvent("auth:ready"));
});
