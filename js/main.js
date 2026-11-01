"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // ============================================================
  // 0. Prefers Reduced Motion Check
  // ============================================================
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ============================================================
  // 1. Navbar Scroll Effect & Brand Visibility
  // ============================================================
  const navbar = document.querySelector(".navbar");
  const homeSection = document.getElementById("home");
  let scrollTicking = false;

  function onScroll() {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        handleNavbarScroll();
        handleActiveSectionHighlight();
        handleBackToTopVisibility();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  function handleNavbarScroll() {
    if (!navbar) return;

    // Navbar background blur/border on scroll
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Role text: Hidden when home section is visible, visible on all other sections
    if (homeSection) {
      const homeRect = homeSection.getBoundingClientRect();
      const isHomeVisible = homeRect.bottom > 80;
      if (isHomeVisible) {
        navbar.classList.remove("show-brand-role");
      } else {
        navbar.classList.add("show-brand-role");
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // ============================================================
  // 2. Mobile Menu Toggle
  // ============================================================
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navLinkItems = document.querySelectorAll(".nav-link");

  function openMobileMenu() {
    navLinks?.classList.add("active");
    navToggle?.classList.add("active");
    navToggle?.setAttribute("aria-expanded", "true");
    trapFocusInMenu();
  }

  function closeMobileMenu() {
    navLinks?.classList.remove("active");
    navToggle?.classList.remove("active");
    navToggle?.setAttribute("aria-expanded", "false");
  }

  function isMobileMenuOpen() {
    return navLinks?.classList.contains("active") ?? false;
  }

  navToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isMobileMenuOpen()) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close when a nav link is clicked
  navLinkItems.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (
      isMobileMenuOpen() &&
      !navLinks?.contains(e.target) &&
      !navToggle?.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // ============================================================
  // 3. Smooth Scroll for Anchor Links
  // ============================================================
  const NAVBAR_HEIGHT = 80;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const targetPosition =
        targetEl.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  // ============================================================
  // 4. Active Section Highlighting
  // ============================================================
  const sections = document.querySelectorAll("section[id]");

  function handleActiveSectionHighlight() {
    if (!sections.length) return;

    const scrollPos = window.scrollY + NAVBAR_HEIGHT + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinkItems.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  // ============================================================
  // 5. Scroll Reveal Animations (IntersectionObserver)
  // ============================================================
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ============================================================
  // 6. Project Filter
  // ============================================================
  const filterContainer = document.querySelector(".project-filters");
  const filterButtons = document.querySelectorAll(
    ".project-filters .filter-btn"
  );
  const projectCards = document.querySelectorAll(".project-card-small");

  filterContainer?.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    const filter = btn.dataset.filter;

    // Update active button
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Filter cards
    projectCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === "all" || category === filter;

      if (shouldShow) {
        card.style.display = "";
        // Trigger reflow for animation
        void card.offsetWidth;
        card.style.opacity = "1";
        card.style.transform = "scale(1) translateY(0)";
      } else {
        card.style.opacity = "0";
        card.style.transform = "scale(0.95) translateY(20px)";
        // Hide after transition
        setTimeout(() => {
          if (
            card.style.opacity === "0" &&
            (filter === "all" || card.dataset.category !== filter)
          ) {
            card.style.display = "none";
          }
        }, 350);
      }
    });
  });

  // ============================================================
  // 7. Contact Form Validation & Submission
  // ============================================================
  const contactForm = document.querySelector('form[name="contact"]');
  let isSubmitting = false;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(field, message) {
    const formGroup = field.closest(".form-group");
    if (!formGroup) return;
    formGroup.classList.add("error");
    let errorEl = formGroup.querySelector(".error-message");
    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.className = "error-message";
      formGroup.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearFieldError(field) {
    const formGroup = field.closest(".form-group");
    if (!formGroup) return;
    formGroup.classList.remove("error");
    const errorEl = formGroup.querySelector(".error-message");
    if (errorEl) errorEl.textContent = "";
  }

  function showFormMessage(type, message) {
    if (!contactForm) return;
    let msgEl = contactForm.querySelector(".form-status-message");
    if (!msgEl) {
      msgEl = document.createElement("div");
      msgEl.className = "form-status-message";
      contactForm.appendChild(msgEl);
    }
    msgEl.className = `form-status-message ${type}`;
    msgEl.textContent = message;
    msgEl.style.display = "block";

    if (type === "success") {
      setTimeout(() => {
        msgEl.style.display = "none";
      }, 5000);
    }
  }

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Clear all previous errors
    contactForm.querySelectorAll(".form-group").forEach((g) => {
      g.classList.remove("error");
      const errMsg = g.querySelector(".error-message");
      if (errMsg) errMsg.textContent = "";
    });

    const name = contactForm.querySelector('[name="name"]');
    const email = contactForm.querySelector('[name="email"]');
    const subject = contactForm.querySelector('[name="subject"]');
    const message = contactForm.querySelector('[name="message"]');

    let isValid = true;

    if (name && !name.value.trim()) {
      showFieldError(name, "Name is required.");
      isValid = false;
    } else if (name) {
      clearFieldError(name);
    }

    if (email && !email.value.trim()) {
      showFieldError(email, "Email is required.");
      isValid = false;
    } else if (email && !validateEmail(email.value.trim())) {
      showFieldError(email, "Please enter a valid email address.");
      isValid = false;
    } else if (email) {
      clearFieldError(email);
    }

    if (subject && !subject.value.trim()) {
      showFieldError(subject, "Subject is required.");
      isValid = false;
    } else if (subject) {
      clearFieldError(subject);
    }

    if (message && !message.value.trim()) {
      showFieldError(message, "Message is required.");
      isValid = false;
    } else if (message) {
      clearFieldError(message);
    }

    if (!isValid) return;

    // Submit via fetch (Netlify form handling)
    isSubmitting = true;
    const submitBtn = contactForm.querySelector('[type="submit"]');
    const originalBtnText = submitBtn?.textContent ?? "Send";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    try {
      const formData = new FormData(contactForm);
      const response = await fetch("/", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (response.ok) {
        showFormMessage("success", "Message sent successfully! I'll get back to you soon.");
        contactForm.reset();
      } else {
        showFormMessage("error", "Something went wrong. Please try again later.");
      }
    } catch {
      showFormMessage("error", "Network error. Please check your connection and try again.");
    } finally {
      isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });

  // Live clear errors on input
  contactForm?.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => clearFieldError(field));
  });

  // ============================================================
  // 8. Typing Effect for Hero
  // ============================================================
  const heroTypingEl = document.querySelector(".hero-typing-text");

  if (heroTypingEl && !prefersReducedMotion) {
    const words = [
      "Game Worlds",
      "Interactive Experiences",
      "Immersive Gameplay",
      "Mobile Adventures",
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let lastTimestamp = 0;

    const TYPE_SPEED = 80;
    const DELETE_SPEED = 45;
    const PAUSE_AFTER_WORD = 2000;
    const PAUSE_BEFORE_TYPE = 400;

    function typeEffect(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;

      const currentWord = words[wordIndex];
      let delay;

      if (!isDeleting) {
        // Typing
        delay = TYPE_SPEED;
        if (elapsed >= delay) {
          charIndex++;
          heroTypingEl.textContent = currentWord.substring(0, charIndex);
          lastTimestamp = timestamp;

          if (charIndex === currentWord.length) {
            // Pause then start deleting
            isDeleting = true;
            lastTimestamp = timestamp + PAUSE_AFTER_WORD - DELETE_SPEED;
          }
        }
      } else {
        // Deleting
        delay = DELETE_SPEED;
        if (elapsed >= delay) {
          charIndex--;
          heroTypingEl.textContent = currentWord.substring(0, charIndex);
          lastTimestamp = timestamp;

          if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            lastTimestamp = timestamp + PAUSE_BEFORE_TYPE - TYPE_SPEED;
          }
        }
      }

      requestAnimationFrame(typeEffect);
    }

    requestAnimationFrame(typeEffect);
  } else if (heroTypingEl && prefersReducedMotion) {
    // Just show the first word statically
    heroTypingEl.textContent = "Game Worlds";
  }

  // ============================================================
  // 9. Stats Counter Animation
  // ============================================================
  const statNumbers = document.querySelectorAll(".stat-number");

  if (statNumbers.length > 0) {
    const COUNTER_DURATION = 2000; // ms

    function easeOutQuad(t) {
      return t * (2 - t);
    }

    function animateCounter(el) {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      const start = performance.now();

      function updateCounter(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / COUNTER_DURATION, 1);
        const easedProgress = easeOutQuad(progress);
        const current = Math.round(easedProgress * target);

        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    }

    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    statNumbers.forEach((el) => statsObserver.observe(el));
  }

  // ============================================================
  // 10. Parallax / Mouse Move Effect (Desktop Only)
  // ============================================================
  const heroSection = document.querySelector(".hero");
  const heroVisuals = document.querySelectorAll(".hero-visual");
  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

  if (
    heroSection &&
    heroVisuals.length > 0 &&
    isDesktop &&
    !prefersReducedMotion
  ) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      heroVisuals.forEach((el, index) => {
        const depth = (index + 1) * 8;
        const moveX = x * depth;
        const moveY = y * depth;
        el.style.willChange = "transform";
        el.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });

    heroSection.addEventListener("mouseleave", () => {
      heroVisuals.forEach((el) => {
        el.style.willChange = "auto";
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  // ============================================================
  // 11. Back to Top Button
  // ============================================================
  const backToTopBtn = document.querySelector(".back-to-top");

  function handleBackToTopVisibility() {
    if (!backToTopBtn) return;
    if (window.scrollY > 500) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  }

  backToTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ============================================================
  // 13. Keyboard Accessibility
  // ============================================================
  document.addEventListener("keydown", (e) => {
    // Escape closes mobile menu
    if (e.key === "Escape" && isMobileMenuOpen()) {
      closeMobileMenu();
      navToggle?.focus();
    }
  });

  // Focus trap in mobile menu
  function trapFocusInMenu() {
    if (!navLinks) return;

    const focusableEls = navLinks.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableEls.length === 0) return;

    const firstFocusable = focusableEls[0];
    const lastFocusable = focusableEls[focusableEls.length - 1];

    function handleTabTrap(e) {
      if (e.key !== "Tab" || !isMobileMenuOpen()) {
        return;
      }

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    // Remove previous handler if any
    navLinks._tabTrapHandler && document.removeEventListener("keydown", navLinks._tabTrapHandler);
    navLinks._tabTrapHandler = handleTabTrap;
    document.addEventListener("keydown", handleTabTrap);

    firstFocusable.focus();
  }

  // ============================================================
  // 14. Current Year
  // ============================================================
  const yearEl = document.querySelector(".current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ============================================================
  // 15. Hero Live Showcase Auto-Cycle Controller
  // ============================================================
  function initHeroLiveStream() {
    const previewCard = document.getElementById("heroEnginePreview");
    if (!previewCard) return;

    const slides = previewCard.querySelectorAll(".engine-slide");
    const indicators = previewCard.querySelectorAll(".reel-indicator");
    const progressBar = document.getElementById("streamProgressBar");
    const sceneNameEl = previewCard.querySelector(".engine-scene-name");
    const activeGenreEl = document.getElementById("activeGameGenre");
    const activeTitleEl = document.getElementById("activeGameTitle");
    const activeStoreBtn = document.getElementById("activeStoreBtn");
    const timelineCounter = document.getElementById("timelineCounter");
    const tech1El = document.getElementById("footerTech1");
    const tech2El = document.getElementById("footerTech2");
    const tech3El = document.getElementById("footerTech3");

    if (slides.length === 0) return;

    const SLIDE_DURATION = 3800; // 3.8s per live game
    let currentIndex = 0;
    let cycleTimer = null;

    // Switch to Slide
    function goToSlide(index) {
      if (index < 0 || index >= slides.length) return;
      currentIndex = index;

      slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });

      indicators.forEach((ind, i) => {
        if (i === index) {
          ind.classList.add("active");
        } else {
          ind.classList.remove("active");
        }
      });

      const currentSlide = slides[index];
      if (currentSlide) {
        if (sceneNameEl) sceneNameEl.textContent = currentSlide.dataset.scene || "Arena.unity";
        if (activeGenreEl) activeGenreEl.textContent = currentSlide.dataset.genre || "Unity Game";
        if (activeTitleEl) activeTitleEl.textContent = currentSlide.dataset.title || "Game Title";
        if (activeStoreBtn) activeStoreBtn.href = currentSlide.dataset.link || "#";
        if (timelineCounter) timelineCounter.textContent = `0${index + 1} / 0${slides.length}`;
        if (tech1El) tech1El.innerHTML = currentSlide.dataset.tech1 || "C# Architecture";
        if (tech2El) tech2El.innerHTML = currentSlide.dataset.tech2 || "Gameplay Systems";
        if (tech3El) tech3El.innerHTML = currentSlide.dataset.tech3 || "Low-End Optimized";
      }

      resetProgress();
    }

    // Progress Bar Animation
    function resetProgress() {
      if (!progressBar) return;
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";
      void progressBar.offsetWidth; // Force reflow
      if (!prefersReducedMotion) {
        progressBar.style.transition = `width ${SLIDE_DURATION}ms linear`;
        progressBar.style.width = "100%";
      }
    }

    // Next Slide
    function nextSlide() {
      const next = (currentIndex + 1) % slides.length;
      goToSlide(next);
    }

    // Start auto cycle
    function startCycle() {
      if (cycleTimer) clearInterval(cycleTimer);
      if (prefersReducedMotion) return;
      resetProgress();
      cycleTimer = setInterval(() => {
        nextSlide();
      }, SLIDE_DURATION);
    }

    // Purely automatic cycle (no manual click handlers, automatically rotates)
    startCycle();
  }

  // ============================================================
  // 16. Theme Toggle (Light & Dark Mode)
  // ============================================================
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  function getActiveTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      // Storage unavailable fallback
    }

    if (themeToggleBtn) {
      const isLight = theme === "light";
      themeToggleBtn.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
      );
      themeToggleBtn.setAttribute(
        "title",
        isLight ? "Switch to Dark Mode" : "Switch to Light Mode"
      );
    }
  }

  themeToggleBtn?.addEventListener("click", () => {
    const currentTheme = getActiveTheme();
    const targetTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(targetTheme);
  });

  // ============================================================
  // Initial Calls
  // ============================================================
  handleNavbarScroll();
  handleActiveSectionHighlight();
  handleBackToTopVisibility();
  initHeroLiveStream();
  applyTheme(getActiveTheme());
});
