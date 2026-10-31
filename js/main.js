// Theme ---------------------------------------------------------------------

const root = document.documentElement;
const toggleBtn = document.getElementById("theme-toggle");

toggleBtn.addEventListener("click", () => {
  const next = root.classList.contains("dark") ? "light" : "dark";
  root.classList.toggle("dark", next === "dark");
  localStorage.setItem("theme", next);
});

// Scroll reveal ---------------------------------------------------------------

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
} else {
  // Stagger siblings that become visible together.
  document.querySelectorAll(".reveal").forEach((el) => {
    if (el.dataset.delay) {
      el.style.setProperty("--reveal-delay", el.dataset.delay + "ms");
    } else {
      const siblings = el.parentElement
        ? Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"))
        : [el];
      const index = siblings.indexOf(el);
      if (index > 0) el.style.setProperty("--reveal-delay", Math.min(index * 90, 450) + "ms");
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

// Active nav link ---------------------------------------------------------

const navLinks = document.querySelectorAll(".nav-link");
const watched = ["about", "works", "blog", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const setActive = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + id);
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  },
  { rootMargin: "-30% 0px -60% 0px" }
);

watched.forEach((section) => sectionObserver.observe(section));

// No section is active while the hero is on screen.
const clearAtTop = () => {
  if (window.scrollY < watched[0].offsetTop - window.innerHeight * 0.4) {
    navLinks.forEach((link) => link.classList.remove("active"));
  }
};
window.addEventListener("scroll", clearAtTop, { passive: true });
clearAtTop();

// Works filter ------------------------------------------------------------

const filterButtons = document.querySelectorAll(".filter-btn");
const workCards = document.querySelectorAll(".work-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    filterButtons.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", String(active));
    });

    workCards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !show);
      if (show && !reduceMotion) {
        card.classList.remove("visible");
        requestAnimationFrame(() => card.classList.add("visible"));
      }
    });
  });
});

// Footer year ---------------------------------------------------------------

document.getElementById("year").textContent = new Date().getFullYear();
