"use strict";

/* =======================
   Navbar Toggle & Scroll Effect
======================= */
const navbar = document.querySelector(".navbar");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

// Sticky navbar on scroll
window.addEventListener("scroll", () => {
  if (navbar) {
    navbar.classList.toggle("sticky", window.scrollY > 50);
  }
});

// Mobile menu toggle
hamburger?.addEventListener("click", () => {
  navMenu?.classList.toggle("active");
  hamburger.classList.toggle("active");
});

// Close menu on link click
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("active");
    hamburger?.classList.remove("active");
  });
});

/* =======================
   Active Link on Scroll
======================= */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function setActiveLink() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");

    navLinks.forEach(link => {
      const isActive = scrollY > sectionTop && scrollY <= sectionTop + sectionHeight;
      link.classList.toggle("active", isActive && link.getAttribute("href") === `#${sectionId}`);
    });
  });
}

window.addEventListener("scroll", setActiveLink);

/* =======================
   Portfolio Filter
======================= */
const filterContainer = document.querySelector(".portfolio-filter");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterContainer?.addEventListener("click", e => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;

  // Update active button
  filterContainer.querySelector(".active")?.classList.remove("active");
  btn.classList.add("active");

  const filter = btn.dataset.filter;

  portfolioItems.forEach(item => {
    const categories = item.dataset.category.split(" ");
    const shouldShow = filter === "all" || categories.includes(filter);
    
    if (shouldShow) {
      item.classList.remove("hide");
      item.style.display = "block";
    } else {
      item.classList.add("hide");
      item.style.display = "none";
    }
  });
});

/* =======================
   Lightbox Functionality
======================= */
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox?.querySelector(".lightbox-img");
const lightboxText = lightbox?.querySelector(".caption-text");
const lightboxCounter = lightbox?.querySelector(".caption-counter");
const lightboxClose = lightbox?.querySelector(".lightbox-close");
const lightboxPrev = lightbox?.querySelector(".lightbox-prev");
const lightboxNext = lightbox?.querySelector(".lightbox-next");

let currentIndex = 0;
const visibleItems = Array.from(portfolioItems).filter(item => 
  !item.classList.contains("hide")
);

function openLightbox(index) {
  const items = Array.from(portfolioItems).filter(item => 
    !item.classList.contains("hide")
  );
  
  if (items.length === 0) return;
  
  currentIndex = index % items.length;
  if (currentIndex < 0) currentIndex = items.length - 1;
  
  const item = items[currentIndex];
  const img = item.querySelector("img");
  const title = item.querySelector("h4");
  
  if (lightboxImg && img) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }
  
  if (lightboxText && title) {
    lightboxText.textContent = title.textContent;
  }
  
  if (lightboxCounter) {
    lightboxCounter.textContent = `${currentIndex + 1} of ${items.length}`;
  }
  
  lightbox?.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox?.classList.remove("open");
  document.body.style.overflow = "";
}

function nextImage() {
  openLightbox(currentIndex + 1);
}

function prevImage() {
  openLightbox(currentIndex - 1);
}

// Open lightbox on portfolio item click
portfolioItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    if (!item.classList.contains("hide")) {
      openLightbox(index);
    }
  });
});

// Lightbox event listeners
lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", e => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});
lightboxPrev?.addEventListener("click", prevImage);
lightboxNext?.addEventListener("click", nextImage);

// Keyboard navigation
document.addEventListener("keydown", e => {
  if (!lightbox?.classList.contains("open")) return;
  
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
});

/* =======================
   Contact Form Handler
======================= */
const contactForm = document.getElementById("contactForm");

contactForm?.addEventListener("submit", e => {
  e.preventDefault();
  
  // Get form values
  const formData = new FormData(contactForm);
  
  // Show success message (you can integrate with email service)
  alert("Thank you for your message! I'll get back to you soon.");
  contactForm.reset();
});

/* =======================
   Smooth Scroll for Anchor Links
======================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const href = this.getAttribute("href");
    if (href !== "#" && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }
  });
});

/* =======================
   Animation on Scroll (Simple)
======================= */
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll(".skill-card, .portfolio-item, .contact-item").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
});

/* =======================
   Stats Counter Animation
======================= */
function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number");
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.textContent);
    const suffix = stat.textContent.replace(/[0-9]/g, "");
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        stat.textContent = target + suffix;
        clearInterval(timer);
      } else {
        stat.textContent = Math.floor(current) + suffix;
      }
    }, 30);
  });
}

// Trigger stats animation when hero section is visible
const heroSection = document.querySelector(".hero");
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

if (heroSection) {
  statsObserver.observe(heroSection);
}

console.log("Portfolio loaded successfully! 🎮");
