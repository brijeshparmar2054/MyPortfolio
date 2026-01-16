"use strict";

/* =======================
   Navbar Resize on Scroll
======================= */
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  navbar?.classList.toggle("sticky", window.scrollY > 20);
});

/* =======================
   Nav Toggler
======================= */
const navMenu = document.querySelector(".menu");
const navToggle = document.querySelector(".menu-btn");

navToggle?.addEventListener("click", () => {
  navMenu?.classList.toggle("active");
});

// Close menu on link click
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("active");
  });
});

/* =======================
   Scroll Section Active Link
======================= */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".links a");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const height = section.offsetHeight;
    const top = section.offsetTop - 50;
    const id = section.id;

    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        scrollY > top && scrollY <= top + height && link.href.includes(id)
      );
    });
  });
}

/* =======================
   Skills Animation
======================= */
const skillsWrap = document.querySelector(".about-skills");
const skillBars = document.querySelectorAll(".progress-line");

function skillsEffect() {
  if (!skillsWrap) return;

  const rect = skillsWrap.getBoundingClientRect();
  const isVisible = window.innerHeight >= rect.top + skillsWrap.offsetHeight;

  if (isVisible) {
    skillBars.forEach(bar => {
      bar.style.width = bar.dataset.progress;
    });
  }
}

/* =======================
   Scroll Listener (Combined)
======================= */
window.addEventListener("scroll", () => {
  scrollActive();
  skillsEffect();
});

/* =======================
   Portfolio Filter
======================= */
const filterContainer = document.querySelector(".portfolio-filter");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterContainer?.addEventListener("click", e => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;

  filterContainer.querySelector(".active")?.classList.remove("active");
  btn.classList.add("active");

  const filter = btn.dataset.filter;

  portfolioItems.forEach(item => {
    const match = filter === "all" || item.dataset.category === filter;
    item.classList.toggle("show", match);
    item.classList.toggle("hide", !match);
  });
});

/* =======================
   Lightbox
======================= */
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox?.querySelector(".lightbox-img");
const lightboxText = lightbox?.querySelector(".caption-text");
const lightboxCounter = lightbox?.querySelector(".caption-counter");
const lightboxClose = lightbox?.querySelector(".lightbox-close");

let itemIndex = 0;

portfolioItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    itemIndex = index;
    updateLightbox();
    toggleLightbox(true);
  });
});

function updateLightbox() {
  const item = portfolioItems[itemIndex];
  lightboxImg.src = item.querySelector("img").src;
  lightboxText.textContent = item.querySelector("h4").textContent;
  lightboxCounter.textContent = `${itemIndex + 1} of ${portfolioItems.length}`;
}

function toggleLightbox(open) {
  lightbox?.classList.toggle("open", open);
}

function nextItem() {
  itemIndex = (itemIndex + 1) % portfolioItems.length;
  updateLightbox();
}

function prevItem() {
  itemIndex =
    (itemIndex - 1 + portfolioItems.length) % portfolioItems.length;
  updateLightbox();
}

lightbox?.addEventListener("click", e => {
  if (e.target === lightbox || e.target === lightboxClose) {
    toggleLightbox(false);
  }
});

/* =======================
   Skill Cards Read More
======================= */
const COLLAPSED_HEIGHT = 160;

document.querySelectorAll(".skill-card").forEach(card => {
  const list = card.querySelector(".skill-list");
  const button = card.querySelector(".read-more-btn");

  if (!list || !button) return;

  // Measure height
  list.classList.remove("collapsed");
  const fullHeight = list.scrollHeight;
  list.classList.add("collapsed");

  if (fullHeight > COLLAPSED_HEIGHT) {
    button.style.display = "inline";
    button.setAttribute("aria-expanded", "false");
  }

  const toggle = () => {
    const expanded = !list.classList.toggle("collapsed");
    button.classList.toggle("expanded", expanded);
    button.setAttribute("aria-expanded", expanded);
    button.innerHTML = expanded
      ? 'Read Less <span class="arrow">▼</span>'
      : 'Read More <span class="arrow">▼</span>';
  };

  button.addEventListener("click", toggle);
  button.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });
});
