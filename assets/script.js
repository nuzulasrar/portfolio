// Theme toggle: starts light (set on <html>) and remembers the visitor's choice when storage is available
(function () {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  } catch (e) {}

  btn.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();

// Mobile menu
(function () {
  const btn = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");
  btn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
})();

// Lightbox: every .shot button opens its image; arrows move within the same group
(function () {
  const box = document.getElementById("lightbox");
  const img = box.querySelector("img");
  const caption = box.querySelector(".lb-caption");
  let group = [];
  let index = 0;
  let lastFocus = null;

  function show(i) {
    index = (i + group.length) % group.length;
    const el = group[index].querySelector("img");
    img.src = el.currentSrc || el.src;
    img.alt = el.alt;
    caption.textContent = `${el.alt}  ·  ${index + 1} / ${group.length}`;
    const multi = group.length > 1;
    box.querySelector(".lb-prev").hidden = !multi;
    box.querySelector(".lb-next").hidden = !multi;
  }

  function open(shot) {
    const container = shot.closest("[data-gallery]");
    group = container ? [...container.querySelectorAll(".shot")] : [shot];
    lastFocus = shot;
    show(group.indexOf(shot));
    box.classList.add("open");
    document.body.style.overflow = "hidden";
    box.querySelector(".lb-close").focus();
  }

  function close() {
    box.classList.remove("open");
    document.body.style.overflow = "";
    img.src = "";
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener("click", (e) => {
    const shot = e.target.closest(".shot");
    if (shot) open(shot);
  });
  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(index + 1));
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();

document.getElementById("year").textContent = new Date().getFullYear();

