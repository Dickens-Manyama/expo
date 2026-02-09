/**
 * Unlock & Connect Expo – Tanzania
 * Main JavaScript: AOS, counters, parallax, form handling
 */
document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("js-ready");

  // Add ambient animated orbs to all sections
  document.querySelectorAll("main section").forEach(function (section) {
    const orbA = document.createElement("div");
    const orbB = document.createElement("div");
    orbA.className = "section-orb orb-a";
    orbB.className = "section-orb orb-b";
    section.prepend(orbA, orbB);
  });
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      offset: 80,
      once: true,
      disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    window.addEventListener("load", function () {
      AOS.refreshHard();
    });
  }

  // Parallax effect for hero
  const hero = document.getElementById("hero");
  const heroParallax = document.querySelector(".hero-parallax");
  const heroVisual = document.querySelector(".hero-visual");
  let ticking = false;

  if (hero && heroParallax) {
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          ticking = false;
          return;
        }
        const scrolled = window.scrollY;
        const heroHeight = hero.offsetHeight;
        if (scrolled < heroHeight) {
          const rate = scrolled * 0.4;
          heroParallax.style.transform = "translate3d(0, " + rate + "px, 0) scale(1.1)";
        }
        ticking = false;
      });
    });
  }

  // Hero tilt interaction
  if (hero && heroVisual && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    hero.addEventListener("mousemove", function (event) {
      const rect = hero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const xPercent = (x / rect.width - 0.5) * 2;
      const yPercent = (y / rect.height - 0.5) * 2;
      heroVisual.style.setProperty("--tilt-x", `${xPercent * 6}deg`);
      heroVisual.style.setProperty("--tilt-y", `${-yPercent * 6}deg`);
    });

    hero.addEventListener("mouseleave", function () {
      heroVisual.style.setProperty("--tilt-x", "0deg");
      heroVisual.style.setProperty("--tilt-y", "0deg");
    });
  }

  // Animated counters for impact metrics
  const metricsSection = document.getElementById("impact-metrics");
  const metricValues = document.querySelectorAll("[data-counter]");
  let metricsTriggered = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-counter"), 10) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * easeOut);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  if (metricsSection && metricValues.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !metricsTriggered) {
            metricsTriggered = true;
            metricValues.forEach(function (el) {
              animateCounter(el);
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(metricsSection);
  }

  // Contact form handling
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector(".btn-submit");
      const origText = btn ? btn.textContent : "Submit";
      if (btn) {
        btn.textContent = "Sending…";
        btn.disabled = true;
      }
      setTimeout(function () {
        if (btn) {
          btn.textContent = "Message Sent!";
          btn.style.background = "#19C2C2";
        }
        contactForm.reset();
        setTimeout(function () {
          if (btn) {
            btn.textContent = origText;
            btn.disabled = false;
            btn.style.background = "";
          }
        }, 3000);
      }, 800);
    });
  }

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Smooth scroll for anchor links (fallback)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Section reveal + navigation active state
  const sections = Array.from(document.querySelectorAll("main section, header.hero"));
  const navLinks = document.querySelectorAll(".nav-link");
  const navProgress = document.querySelector(".nav-progress");
  const navToggle = document.querySelector(".nav-toggle");

  if (sections.length) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            const id = entry.target.getAttribute("id");
            if (id) {
              navLinks.forEach(function (link) {
                const href = link.getAttribute("href");
                link.classList.toggle("active", href === `#${id}`);
              });
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // Scroll progress indicator
  if (navProgress) {
    window.addEventListener("scroll", function () {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      navProgress.style.width = `${progress}%`;
    });
  }

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      const icon = navToggle.querySelector(".bi");
      if (icon) {
        icon.classList.toggle("bi-list", !isOpen);
        icon.classList.toggle("bi-x", isOpen);
      }
    });
  }

  // Close menu on link click (mobile)
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
        if (navToggle) {
          navToggle.setAttribute("aria-expanded", "false");
          const icon = navToggle.querySelector(".bi");
          if (icon) {
            icon.classList.add("bi-list");
            icon.classList.remove("bi-x");
          }
        }
      }
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && document.body.classList.contains("nav-open")) {
      document.body.classList.remove("nav-open");
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
        const icon = navToggle.querySelector(".bi");
        if (icon) {
          icon.classList.add("bi-list");
          icon.classList.remove("bi-x");
        }
      }
    }
  });
});
