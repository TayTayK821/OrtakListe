const layer = document.getElementById("hero-photos");
const INTERVAL_MS = 6000;

async function loadPhotos() {
  try {
    const res = await fetch("assets/photos/photos.json", { cache: "no-store" });
    if (!res.ok) return [];
    const list = await res.json();
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function startCarousel(files) {
  if (!files.length) return;

  files.forEach((file, i) => {
    const img = document.createElement("img");
    img.src = `assets/photos/${file}`;
    img.alt = "";
    img.loading = i === 0 ? "eager" : "lazy";
    if (i === 0) img.classList.add("is-active");
    layer.appendChild(img);
  });

  if (files.length === 1) return;

  let current = 0;
  const imgs = () => layer.querySelectorAll("img");

  setInterval(() => {
    const nodes = imgs();
    const next = (current + 1) % nodes.length;
    nodes[current].classList.remove("is-active");
    nodes[next].classList.add("is-active");
    current = next;
  }, INTERVAL_MS);
}

// Reuse the same manifest for the "Anılarımız" gallery grid at the bottom.
function fillGallery(files) {
  const grid = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");
  if (!files.length) return;
  empty.remove();
  files.forEach((file) => {
    const img = document.createElement("img");
    img.src = `assets/photos/${file}`;
    img.alt = "";
    img.loading = "lazy";
    grid.appendChild(img);
  });
}

loadPhotos().then((files) => {
  startCarousel(files);
  fillGallery(files);
});
