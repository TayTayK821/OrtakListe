import { db } from "./firebase-init.js";
import { CONFIG } from "./config.js";
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, deleteDoc, doc, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const nameByKey = {};
Object.values(CONFIG.people).forEach((p) => { nameByKey[p.key] = p.name; });

function applyNames() {
  document.querySelectorAll(".list-section").forEach((section) => {
    const owner = section.dataset.owner;
    const list = section.dataset.list;
    const name = nameByKey[owner] || owner;
    const h2 = section.querySelector(".list-section__header h2");
    if (owner === "you") {
      h2.textContent = list === "kesin" ? `${name} — Kesin Alınacaklar` : `${name} — Beğendiklerim`;
    } else {
      h2.textContent = list === "kesin" ? `${name} — Kesin Alınacaklar` : `${name} — Beğendikleri`;
    }
  });
}

function itemRowHTML(item, id) {
  const title = item.link
    ? `<a href="${item.link}" target="_blank" rel="noopener">${escapeHTML(item.title)}</a>`
    : escapeHTML(item.title);
  const addedBy = item.addedByName ? `eklendi: ${item.addedByName}` : "";
  return `
    <li class="item" data-id="${id}">
      <div>
        <div class="item__title">${title}</div>
        <div class="item__meta">${addedBy}</div>
      </div>
      <button class="item__delete" aria-label="Sil">✕</button>
    </li>`;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function wireSection(section, currentUserName) {
  const owner = section.dataset.owner;
  const listType = section.dataset.list;
  const listRoot = section.querySelector("[data-list-root]");
  const form = section.querySelector(".add-form");

  const itemsQuery = query(
    collection(db, "items"),
    where("owner", "==", owner),
    where("listType", "==", listType),
    orderBy("createdAt", "desc")
  );

  onSnapshot(itemsQuery, (snapshot) => {
    if (snapshot.empty) {
      listRoot.innerHTML = `<li class="item-list__empty">Henüz bir şey yok.</li>`;
      return;
    }
    listRoot.innerHTML = snapshot.docs.map((d) => itemRowHTML(d.data(), d.id)).join("");
  }, (err) => {
    listRoot.innerHTML = `<li class="item-list__empty">Liste yüklenemedi: ${err.message}</li>`;
  });

  listRoot.addEventListener("click", async (e) => {
    const btn = e.target.closest(".item__delete");
    if (!btn) return;
    const id = btn.closest(".item").dataset.id;
    await deleteDoc(doc(db, "items", id));
  });

  const errorMsg = section.querySelector(".add-form__error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errorMsg) errorMsg.hidden = true;
    const titleInput = form.querySelector(".add-form__title");
    const linkInput = form.querySelector(".add-form__link");
    const title = titleInput.value.trim();
    if (!title) return;
    const submitBtn = form.querySelector("button");
    submitBtn.disabled = true;
    try {
      await addDoc(collection(db, "items"), {
        owner,
        listType,
        title,
        link: linkInput.value.trim() || null,
        addedByName: currentUserName || null,
        createdAt: serverTimestamp(),
      });
      form.reset();
      titleInput.focus();
    } catch (err) {
      console.error("Ekleme başarısız:", err);
      if (errorMsg) {
        errorMsg.textContent = `Eklenemedi: ${err.message}`;
        errorMsg.hidden = false;
      }
    } finally {
      submitBtn.disabled = false;
    }
  });
}

document.addEventListener("app:authenticated", (e) => {
  applyNames();
  const person = CONFIG.people[e.detail.user.email];
  const currentUserName = person ? person.name : e.detail.user.email;
  document.querySelectorAll(".list-section").forEach((section) => wireSection(section, currentUserName));
}, { once: true });
