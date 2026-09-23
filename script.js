document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // 2. Global Navigation Bar is permanently fixed at bottom-center
  // 3. Compact Navigation Controller
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const headerNav = document.querySelector(".hero-quick-nav");
  let openMobileMenu, closeMobileMenu;

  if (menuToggle && mobileNav) {
    openMobileMenu = function () {
      mobileNav.classList.add("open");
      menuToggle.classList.add("open");
      headerNav.classList.add("nav-menu-open");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close navigation");
    };

    closeMobileMenu = function () {
      mobileNav.classList.remove("open");
      menuToggle.classList.remove("open");
      headerNav.classList.remove("nav-menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    };

    function toggleMobileMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (mobileNav.classList.contains("open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }

    menuToggle.addEventListener("click", toggleMobileMenu);

    // Hover support for devices with hover capability on small screens
    if (headerNav && window.matchMedia("(hover: hover)").matches) {
      let hoverCloseTimer = null;
      headerNav.addEventListener("mouseenter", () => {
        if (window.innerWidth <= 600) {
          if (hoverCloseTimer) clearTimeout(hoverCloseTimer);
          openMobileMenu();
        }
      });

      headerNav.addEventListener("mouseleave", () => {
        if (window.innerWidth <= 600) {
          hoverCloseTimer = setTimeout(() => {
            closeMobileMenu();
          }, 350);
        }
      });
    }

    // Smooth scroll and auto-collapse when mobile navigation item is clicked
    const mobileLinks = mobileNav.querySelectorAll(".nav-item-mobile");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          const targetId = href.substring(1);
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: "smooth" });
            // Update active link immediately
            mobileLinks.forEach((l) => l.classList.toggle("active", l === link));
            const desktopLinks = document.querySelectorAll(".nav-item");
            desktopLinks.forEach((dl) => dl.classList.toggle("active", dl.getAttribute("href") === href));
          }
        }
        closeMobileMenu();
      });
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
      if (mobileNav.classList.contains("open")) {
        if (!headerNav.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileNav.classList.contains("open")) {
        closeMobileMenu();
        menuToggle.focus();
      }
    });
  }

  // 3.5. Hero Greeting Text-Only Micro-Interaction Controller
  const heroGreeting = document.querySelector(".hero-greeting");
  const extraOWrapper = document.querySelector(".hero-greeting .extra-o-wrapper");

  if (heroGreeting && extraOWrapper) {
    // Elongates from "👋 Hello!" to "👋 Hellooooo!" (exactly 4 extra 'o's)
    const MAX_EXTRA_O = 4;
    const extraOElements = [];

    // Clear and pre-create exactly 4 extra "o" elements inside wrapper
    extraOWrapper.innerHTML = "";
    for (let i = 0; i < MAX_EXTRA_O; i++) {
      const span = document.createElement("span");
      span.className = "extra-o";
      span.textContent = "o";
      span.setAttribute("aria-hidden", "true");
      extraOWrapper.appendChild(span);
      extraOElements.push(span);
    }

    let isHovered = false;
    let stepTimer = null;
    let cleanupTimer = null;
    let waveTimer = null;
    let touchTimeout = null;
    let currentIndex = 0; // Current count of visible extra 'o's (0 to MAX_EXTRA_O)

    // Responsive limit & reduced motion check
    function getMaxExtraO() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return 0;
      }
      return MAX_EXTRA_O;
    }

    // Fast, responsive timings matching specifications:
    // Hover detection: ~60ms
    // Each 'o' added: ~75ms (total elongation ~360ms)
    // Leave detection / start collapse: ~45ms
    // Each 'o' removed: ~65ms (total reverse ~305ms)
    const HOVER_DELAY = 60;
    const STEP_INTERVAL_EXPAND = 75;
    const LEAVE_START_DELAY = 45;
    const STEP_INTERVAL_COLLAPSE = 65;
    const HAND_WAVE_DELAY = 100;

    function startHandWave() {
      heroGreeting.classList.add("is-waving");
    }

    function stopHandWave() {
      heroGreeting.classList.remove("is-waving");
    }

    // Cancel all running or queued animation and cleanup timers
    function clearAllTimers() {
      if (stepTimer !== null) {
        clearTimeout(stepTimer);
        stepTimer = null;
      }
      if (cleanupTimer !== null) {
        clearTimeout(cleanupTimer);
        cleanupTimer = null;
      }
      if (waveTimer !== null) {
        clearTimeout(waveTimer);
        waveTimer = null;
      }
    }

    function step() {
      stepTimer = null;
      const targetCount = isHovered ? getMaxExtraO() : 0;

      if (isHovered) {
        if (currentIndex < targetCount) {
          const el = extraOElements[currentIndex];
          el.classList.remove("is-leaving");
          el.classList.add("is-visible");
          currentIndex++;

          if (currentIndex < targetCount) {
            stepTimer = setTimeout(step, STEP_INTERVAL_EXPAND);
          } else {
            stopHandWave();
          }
        } else {
          stopHandWave();
        }
      } else {
        // Reverse one 'o' at a time from current state
        if (currentIndex > 0) {
          currentIndex--;
          const el = extraOElements[currentIndex];
          el.classList.remove("is-visible");
          el.classList.add("is-leaving");

          if (currentIndex > 0) {
            stepTimer = setTimeout(step, STEP_INTERVAL_COLLAPSE);
          } else {
            // Fully returned to 👋 Hello!
            stopHandWave();
            cleanupTimer = setTimeout(() => {
              cleanupTimer = null;
              if (!isHovered && currentIndex === 0) {
                extraOElements.forEach((e) => {
                  e.classList.remove("is-visible", "is-leaving");
                });
              }
            }, 160);
          }
        } else {
          stopHandWave();
        }
      }
    }

    function handleEnter() {
      if (isHovered) return;
      isHovered = true;
      heroGreeting.classList.add("is-hovered");

      // Cancel previous direction and cleanup immediately
      clearAllTimers();

      waveTimer = setTimeout(startHandWave, HAND_WAVE_DELAY);

      const targetCount = getMaxExtraO();
      if (currentIndex >= targetCount) return;

      // Start expansion from current state after hover delay
      stepTimer = setTimeout(step, HOVER_DELAY);
    }

    function handleLeave() {
      if (!isHovered) return;
      isHovered = false;
      heroGreeting.classList.remove("is-hovered");

      // Cancel previous direction immediately
      clearAllTimers();

      if (currentIndex <= 0) {
        stopHandWave();
        extraOElements.forEach((e) => {
          e.classList.remove("is-visible", "is-leaving");
        });
        return;
      }

      // Immediately start smooth reverse from current state
      stepTimer = setTimeout(step, LEAVE_START_DELAY);
    }

    // Interactive event listeners
    heroGreeting.addEventListener("mouseenter", handleEnter);
    heroGreeting.addEventListener("mouseleave", handleLeave);
    heroGreeting.addEventListener("focus", handleEnter);
    heroGreeting.addEventListener("blur", handleLeave);

    // Touch device support
    heroGreeting.addEventListener("touchstart", () => {
      handleEnter();
      if (touchTimeout) clearTimeout(touchTimeout);
      touchTimeout = setTimeout(() => {
        handleLeave();
      }, 3500);
    }, { passive: true });

    // Collapse if user scrolls or touches outside on mobile
    window.addEventListener("scroll", () => {
      if (isHovered && touchTimeout) {
        clearTimeout(touchTimeout);
        handleLeave();
      }
    }, { passive: true });

    document.addEventListener("touchstart", (e) => {
      if (isHovered && !heroGreeting.contains(e.target)) {
        if (touchTimeout) clearTimeout(touchTimeout);
        handleLeave();
      }
    }, { passive: true });
  }

  // 3.6. Hero Three-Word Depth Typography Controller ("Siva Rama Krishna")
  (function initThreeWordDepthTypography() {
    const heroTitle = document.getElementById("hero-name-title");
    if (!heroTitle) return;

    const wordEls = Array.from(heroTitle.querySelectorAll(".name-word"));
    if (!wordEls.length) return;

    // Capabilities
    const reducedMotionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerMQ = window.matchMedia("(hover: hover) and (pointer: fine)");

    const canAnimate = () => {
      if (reducedMotionMQ.matches) return false;
      return finePointerMQ.matches;
    };

    // Neutral subtle depth shadows per word (uniform near-black theme)
    const shadowColors = [
      "rgba(17, 17, 17, 0.16)",
      "rgba(17, 17, 17, 0.16)",
      "rgba(17, 17, 17, 0.16)",
    ];

    // State per whole word unit (0 = Siva, 1 = Rama, 2 = Krishna)
    const wordStates = wordEls.map((el, index) => ({
      el,
      index,
      currX: 0,
      currY: 0,
      currZ: 0,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      currScale: 1,
      targetScale: 1,
      currOpacity: 1,
      targetOpacity: 1,
      currShadow: 0,
      targetShadow: 0,
      targetZIndex: 1,
      cx: 0,
      cy: 0,
      shadowColor: shadowColors[index] || "rgba(0, 0, 0, 0.15)",
    }));

    let pointerX = -9999;
    let pointerY = -9999;
    let isPointerActive = false;
    let isResetting = false;
    let resetTimer = null;
    let animFrameId = null;

    const RADIUS = 180; // Comfortable influence radius in px
    const LERP_FACTOR = 0.15; // Smooth physical spring damping

    // Cache center coordinates of each solid word
    function updateWordPositions() {
      wordStates.forEach((state) => {
        const r = state.el.getBoundingClientRect();
        state.cx = r.left + r.width / 2;
        state.cy = r.top + r.height / 2;
      });
    }

    // Main 60fps spring interpolation loop
    function updatePhysics() {
      wordStates.forEach((state) => {
        // Damped interpolation
        state.currX += (state.targetX - state.currX) * LERP_FACTOR;
        state.currY += (state.targetY - state.currY) * LERP_FACTOR;
        state.currZ += (state.targetZ - state.currZ) * LERP_FACTOR;
        state.currScale += (state.targetScale - state.currScale) * LERP_FACTOR;
        state.currOpacity += (state.targetOpacity - state.currOpacity) * LERP_FACTOR;
        state.currShadow += (state.targetShadow - state.currShadow) * LERP_FACTOR;

        const dx = Math.abs(state.currX - state.targetX);
        const dy = Math.abs(state.currY - state.targetY);
        const dz = Math.abs(state.currZ - state.targetZ);
        const ds = Math.abs(state.currScale - state.targetScale);
        const doP = Math.abs(state.currOpacity - state.targetOpacity);
        const dSh = Math.abs(state.currShadow - state.targetShadow);

        // Snap to rest when settled
        if (dx < 0.01 && dy < 0.01 && dz < 0.01 && ds < 0.001 && doP < 0.002 && dSh < 0.01 &&
            state.targetX === 0 && state.targetY === 0 && state.targetZ === 0 &&
            state.targetScale === 1 && state.targetOpacity === 1 && state.targetShadow === 0) {
          state.currX = 0;
          state.currY = 0;
          state.currZ = 0;
          state.currScale = 1;
          state.currOpacity = 1;
          state.currShadow = 0;
        }

        // Apply 3D transform to the entire solid word object
        if (state.currX !== 0 || state.currY !== 0 || state.currZ !== 0 || state.currScale !== 1) {
          state.el.style.transform = `translate3d(${state.currX.toFixed(2)}px, ${state.currY.toFixed(2)}px, ${state.currZ.toFixed(2)}px) scale(${state.currScale.toFixed(3)})`;
        } else {
          state.el.style.transform = "";
        }

        // Opacity & Layering
        if (Math.abs(state.currOpacity - 1) > 0.005) {
          state.el.style.opacity = state.currOpacity.toFixed(3);
        } else {
          state.el.style.opacity = "";
        }

        state.el.style.zIndex = state.targetZIndex;

        // Subtle depth drop shadow
        if (state.currShadow > 0.03) {
          const blur = (state.currShadow * 16).toFixed(1);
          const yOff = (state.currShadow * 8).toFixed(1);
          state.el.style.filter = `drop-shadow(0 ${yOff}px ${blur}px ${state.shadowColor})`;
        } else {
          state.el.style.filter = "";
        }
      });

      animFrameId = requestAnimationFrame(updatePhysics);
    }

    // Calculate word-level depth focus
    function calculateWordDepth() {
      if (isResetting || !canAnimate() || !isPointerActive) {
        wordStates.forEach((state) => {
          state.targetX = 0;
          state.targetY = 0;
          state.targetZ = 0;
          state.targetScale = 1;
          state.targetOpacity = 1;
          state.targetShadow = 0;
          state.targetZIndex = 1;
        });
        return;
      }

      // Find closest word to pointer
      let closestIdx = 0;
      let minDist = Infinity;

      wordStates.forEach((state, i) => {
        const dx = pointerX - state.cx;
        const dy = pointerY - state.cy;
        const dist = Math.hypot(dx, dy);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = i;
        }
      });

      if (minDist < RADIUS) {
        const norm = minDist / RADIUS;
        const falloff = Math.pow(1 - norm, 2); // Eased quadratic curve

        wordStates.forEach((state, i) => {
          if (i === closestIdx) {
            // Focused word moves forward as a single solid unit
            const dx = pointerX - state.cx;
            const dy = pointerY - state.cy;
            const dist = Math.hypot(dx, dy) || 1;
            const dirX = dx / dist;
            const dirY = dy / dist;

            state.targetX = dirX * Math.min(10, 8 * falloff);
            state.targetY = dirY * Math.min(6, 5 * falloff);
            state.targetZ = 22 * falloff; // Visual depth forward
            state.targetScale = 1 + 0.08 * falloff; // Scale 1.05 - 1.08
            state.targetOpacity = 1;
            state.targetShadow = falloff;
            state.targetZIndex = 10;
          } else {
            // Other words subtly move backward / recede
            const relOffset = (i < closestIdx) ? -1 : 1;
            state.targetX = relOffset * 6 * falloff;
            state.targetY = 3 * falloff;
            state.targetZ = -14 * falloff; // Visual depth backward
            state.targetScale = 1 - 0.03 * falloff; // Scale 0.97 - 0.985
            state.targetOpacity = 1 - 0.20 * falloff; // Opacity 0.80 - 0.90
            state.targetShadow = 0;
            state.targetZIndex = 1;
          }
        });
      } else {
        wordStates.forEach((state) => {
          state.targetX = 0;
          state.targetY = 0;
          state.targetZ = 0;
          state.targetScale = 1;
          state.targetOpacity = 1;
          state.targetShadow = 0;
          state.targetZIndex = 1;
        });
      }
    }

    // Click reset interaction
    function triggerClickReset(e) {
      if (e) e.preventDefault();
      isResetting = true;
      if (resetTimer) clearTimeout(resetTimer);

      wordStates.forEach((state) => {
        state.targetX = 0;
        state.targetY = 0;
        state.targetZ = 0;
        state.targetScale = 1;
        state.targetOpacity = 1;
        state.targetShadow = 0;
        state.targetZIndex = 1;
      });

      // Smooth reset settling time (~420ms)
      resetTimer = setTimeout(() => {
        isResetting = false;
        updateWordPositions();
        if (isPointerActive) {
          calculateWordDepth();
        }
      }, 420);
    }

    // Centralized Pointer Listeners
    const heroSection = document.getElementById("hero") || heroTitle.closest("section");

    if (heroSection) {
      heroSection.addEventListener("pointermove", (e) => {
        if (!canAnimate()) return;
        pointerX = e.clientX;
        pointerY = e.clientY;
        isPointerActive = true;
        calculateWordDepth();
      }, { passive: true });

      heroSection.addEventListener("pointerleave", () => {
        isPointerActive = false;
        calculateWordDepth();
      });
    }

    heroTitle.addEventListener("click", triggerClickReset);

    window.addEventListener("resize", () => updateWordPositions(), { passive: true });
    window.addEventListener("scroll", () => updateWordPositions(), { passive: true });

    // Initial positioning setup
    setTimeout(() => updateWordPositions(), 200);
    updateWordPositions();
    animFrameId = requestAnimationFrame(updatePhysics);
  })();

  // 4. Typewriter Animation (Hero Section)
  const roles = [
    "AI/ML Engineer",
    "Data Analyst",
    "Python Developer",
    "Automation Enthusiast",
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterSpan = document.getElementById("typewriter");

  if (typewriterSpan) {
    function type() {
      const currentRole = roles[roleIndex % roles.length];
      if (isDeleting) {
        typewriterSpan.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterSpan.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let typingSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 1500; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex++;
        typingSpeed = 250; // Pause before typing next word
      }

      setTimeout(type, typingSpeed);
    }
    type();
  }

  // 4.5. Live Clock (Hero Section Upper-Right)
  const clockTimeSpan = document.getElementById("hero-clock-time");
  const clockDateSpan = document.getElementById("hero-clock-date");

  if (clockTimeSpan && clockDateSpan) {
    function updateHeroClock() {
      const now = new Date();
      clockTimeSpan.textContent = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      clockDateSpan.textContent = now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
    updateHeroClock();
    setInterval(updateHeroClock, 1000);
  }

  // 5. Cursor Glow & Magnetic Interaction Effects
  if (!window.matchMedia("(pointer: coarse)").matches) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    document.addEventListener("mousemove", (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    });

    // Magnetic CTA Button Pull
    const magneticItems = document.querySelectorAll(".magnetic-item");
    magneticItems.forEach(item => {
      item.addEventListener("mousemove", (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        item.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px) scale(1.02)`;
        item.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08)";
      });
      
      item.addEventListener("mouseleave", () => {
        item.style.transform = "translate(0px, 0px) scale(1)";
        item.style.boxShadow = "";
      });
    });
  }

  // 5.1. Global Organic Firecracker / Spark Particle Click Feedback Effect
  function createClickBurst(x, y) {
    // Clamp coordinates so particles never push beyond screen edges
    const clampedX = Math.max(25, Math.min(window.innerWidth - 25, x));
    const clampedY = Math.max(25, Math.min(window.innerHeight - 25, y));
    const burst = document.createElement("div");
    burst.className = "click-burst-effect";
    burst.style.left = `${clampedX}px`;
    burst.style.top = `${clampedY}px`;

    // Generate 8 to 12 particles dynamically with randomized trajectory, speed, distance and length
    const particleCount = Math.floor(Math.random() * 5) + 8; // 8-12 particles
    let maxTotalTime = 0;

    let svgContent = `<svg width="90" height="90" viewBox="-45 -45 90 90" xmlns="http://www.w3.org/2000/svg">`;

    for (let i = 0; i < particleCount; i++) {
      // Randomized angle around 360 degrees for an organic firecracker burst
      const angle = Math.floor(Math.random() * 360);
      const len = (10 + Math.random() * 8).toFixed(1); // 10px - 18px length
      const dist = Math.floor(16 + Math.random() * 19); // 16px - 35px distance travel
      const rot = Math.floor((Math.random() - 0.5) * 50); // -25deg to +25deg spin
      const dur = Math.floor(650 + Math.random() * 150); // 650ms - 800ms duration
      const delay = Math.floor(Math.random() * 35); // 0ms - 35ms stagger

      const totalTime = dur + delay;
      if (totalTime > maxTotalTime) maxTotalTime = totalTime;

      svgContent += `<line class="spark-line" x1="0" y1="0" x2="0" y2="-${len}" style="--angle:${angle}deg; --dist:${dist}px; --rot:${rot}deg; --dur:${dur}ms; --delay:${delay}ms;" />`;
    }
    svgContent += `</svg>`;

    burst.innerHTML = svgContent;
    document.body.appendChild(burst);

    // Self-cleaning DOM removal after animation completes
    setTimeout(() => {
      burst.remove();
    }, maxTotalTime + 50);
  }

  window.addEventListener("pointerdown", (e) => {
    if (e.button !== undefined && e.button !== 0) return;

    // Detect whether the click originated from an interactive element or its container
    const isInteractive = e.target.closest(
      'a, button, input, textarea, select, label, option, ' +
      '[role="button"], [role="link"], [role="checkbox"], [role="tab"], [tabindex]:not([tabindex="-1"]), ' +
      '.btn, .social-icon-btn, .nav-item, .nav-item-mobile, .nav-box, .hero-quick-nav, ' +
      '.menu-toggle, .mobile-nav, .filter-btn, .back-to-top, .hero-greeting, ' +
      '.project-card-wrapper, .project-card, .skill-card, .cert-card, .experience-card, ' +
      '.contact-card, .contact-info-item, .toast-item, .clickable'
    );

    if (isInteractive) return;

    createClickBurst(e.clientX, e.clientY);
  }, { passive: true });


  // 6. Viewport Scroll Reveal Observer
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    reveals.forEach((el) => revealObserver.observe(el));
  }

  // 9. Project Filtering Logic
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card-wrapper");

  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const category = btn.getAttribute("data-filter");
        projectCards.forEach((card) => {
          const cardCategory = card.getAttribute("data-category");
          const categories = cardCategory ? cardCategory.split(" ") : [];
          if (category === "All" || categories.includes(category)) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // 10. Custom Premium Toast Notification Builder
  function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "glass-strong toast-item";
    
    // Style settings for premium look (border left based on success/error type)
    const colorType = type === "success" ? "oklch(0.62 0.18 150)" : "oklch(0.65 0.22 25)";
    toast.style.cssText = `
      padding: 0.75rem 1.25rem;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--foreground);
      box-shadow: var(--shadow-card);
      pointer-events: auto;
      transform: translateY(20px);
      opacity: 0;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
      border-left: 4px solid ${colorType};
    `;
    toast.textContent = message;
    container.appendChild(toast);

    // Force reflow to run animations
    toast.offsetHeight;

    // Slide in
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";

    // Auto dismiss
    setTimeout(() => {
      toast.style.transform = "translateY(-20px)";
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // 11. EmailJS Contact Form Submit Handling
  const contactForm = document.getElementById("contact-form");
  if (contactForm && typeof emailjs !== "undefined") {
    const EMAILJS_SERVICE_ID = "service_2cm6cum";
    const EMAILJS_TEMPLATE_ID = "template_5omrl2m";
    const EMAILJS_PUBLIC_KEY = "0cKbCGbbjL8RAH65g";

    // Initialize EmailJS with public key
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });

    let isSubmitting = false;

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Prevent duplicate submissions if already sending
      if (isSubmitting) return;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      const nameInput = contactForm.querySelector('[name="name"]') || contactForm.querySelector('[name="from_name"]');
      const emailInput = contactForm.querySelector('[name="email"]') || contactForm.querySelector('[name="from_email"]');
      const subjectInput = contactForm.querySelector('[name="subject"]');
      const messageInput = contactForm.querySelector('[name="message"]');

      const name = (nameInput?.value || "").trim();
      const email = (emailInput?.value || "").trim();
      const subject = (subjectInput?.value || "").trim();
      const message = (messageInput?.value || "").trim();
      const to_name = "Siva Rama Krishna";

      // Client-side fields validation: Name, Email, Subject, Message
      if (!name) {
        showToast("Please enter your name.", "error");
        nameInput?.focus();
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Please enter a valid email address.", "error");
        emailInput?.focus();
        return;
      }
      if (!subject) {
        showToast("Please enter a subject.", "error");
        subjectInput?.focus();
        return;
      }
      if (!message) {
        showToast("Please enter your message.", "error");
        messageInput?.focus();
        return;
      }

      // Synchronize compatibility alias parameters for EmailJS template
      const setHiddenParam = (paramName, val) => {
        let field = contactForm.querySelector(`input[name="${paramName}"]`);
        if (!field) {
          field = document.createElement("input");
          field.type = "hidden";
          field.name = paramName;
          contactForm.appendChild(field);
        }
        field.value = val;
      };

      setHiddenParam("from_name", name);
      setHiddenParam("from_email", email);
      setHiddenParam("to_name", to_name);

      isSubmitting = true;
      const originalBtnContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
      submitBtn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span><span>Sending...</span>';

      try {
        await emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          contactForm,
          { publicKey: EMAILJS_PUBLIC_KEY }
        );

        showToast("Message sent successfully!", "success");
        submitBtn.classList.remove("is-loading");
        submitBtn.classList.add("is-success");
        submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="btn-icon-status"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Message Sent ✓</span>';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.classList.remove("is-success");
          submitBtn.innerHTML = originalBtnContent;
          submitBtn.disabled = false;
          isSubmitting = false;
          if (window.lucide) lucide.createIcons();
        }, 3500);
      } catch (error) {
        console.error("EmailJS submission error:", error);
        showToast("Failed to send message. Please try again later.", "error");
        submitBtn.classList.remove("is-loading");
        submitBtn.classList.add("is-error");
        submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="btn-icon-status"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg><span>Failed to Send</span>';

        setTimeout(() => {
          submitBtn.classList.remove("is-error");
          submitBtn.innerHTML = originalBtnContent;
          submitBtn.disabled = false;
          isSubmitting = false;
          if (window.lucide) lucide.createIcons();
        }, 3500);
      }
    });
  }

  // 12. Active Section ScrollSpy & Navigation State Controller
  const spySections = document.querySelectorAll("section[id]");
  const desktopLinks = document.querySelectorAll(".nav-item");
  const mobileLinks = document.querySelectorAll(".nav-item-mobile");
  const contactSection = document.getElementById("contact");
  let currentActiveSectionId = "hero";

  function setActiveSection(id) {
    if (!id) return;
    currentActiveSectionId = id;

    desktopLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
    mobileLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });

    // Contact Navigation State: Completely hidden when Contact is active
    if (headerNav) {
      if (id === "contact") {
        headerNav.classList.add("nav-contact-hidden");
        headerNav.classList.remove("nav-contact-compact");
        headerNav.setAttribute("aria-hidden", "true");
        if (closeMobileMenu) {
          closeMobileMenu();
        }
      } else {
        headerNav.classList.remove("nav-contact-hidden");
        headerNav.classList.remove("nav-contact-compact");
        headerNav.removeAttribute("aria-hidden");
      }
    }
  }

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          setActiveSection(id);
        }
      });
    },
    {
      rootMargin: "-22% 0px -52% 0px",
      threshold: 0,
    }
  );

  spySections.forEach((section) => spyObserver.observe(section));

  // Reliable scroll boundary check for Contact entry and upward return to Certifications
  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const windowH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;

      if (contactSection) {
        const cRect = contactSection.getBoundingClientRect();
        // Bottom of page guarantee or contact section actively in reading zone
        if (windowH + scrollY >= docH - 45 || (cRect.top <= windowH * 0.48 && cRect.bottom > windowH * 0.2)) {
          if (currentActiveSectionId !== "contact") {
            setActiveSection("contact");
          }
        } else if (currentActiveSectionId === "contact") {
          // If scrolling upward and contact top moves below reading line, restore certifications
          if (cRect.top > windowH * 0.55) {
            setActiveSection("certifications");
          }
        }
      }
    },
    { passive: true }
  );

  // Initial check on page load if starting at Contact
  if (contactSection) {
    const initRect = contactSection.getBoundingClientRect();
    if (window.location.hash === "#contact" || (initRect.top <= window.innerHeight * 0.48 && initRect.bottom > 0)) {
      setActiveSection("contact");
    }
  }

  // 13. Back to Top Button Visibility
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      backToTopBtn.classList.toggle("active", window.scrollY > 300);
    }, { passive: true });
  }

  // 14. Section Heading Hover Animation Trigger
  if (window.matchMedia("(hover: hover)").matches) {
    const hoverHeadings = document.querySelectorAll(
      "#skills .section-title, #experience .section-title, #projects .section-title, #certifications .section-title"
    );
    
    hoverHeadings.forEach((heading) => {
      heading.classList.add("heading-animated");
      
      heading.addEventListener("mouseenter", () => {
        heading.classList.remove("anim-exit");
        void heading.offsetWidth; // Force reflow
        heading.classList.add("anim-enter");
      });
      
      heading.addEventListener("mouseleave", () => {
        heading.classList.remove("anim-enter");
        void heading.offsetWidth; // Force reflow
        heading.classList.add("anim-exit");
      });
    });
  }

  // 15. Interactive Hero Constellation / Particle Node Network (Elastic Spring Physics)
  (function initConstellation() {
    const canvas = document.getElementById("constellation-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const heroSection = document.getElementById("hero") || canvas.parentElement;

    const CONFIG = {
      areaPerParticle: 12000,
      minParticles: 35,
      maxParticles: 90,
      minRadius: 1.5,
      maxRadius: 3.0,
      nodeColor: "15, 23, 42",     // Dark Slate RGB
      accentColor: "79, 70, 229",  // Indigo Accent RGB
      nodeOpacity: 0.15,
      maxDistance: 130,
      lineOpacity: 0.10,
      lineWidth: 0.8,
      mouseRadius: 160,
      mouseLineOpacity: 0.18,
      mouseAttraction: 0.025,

      // Elastic Spring Physics Parameters
      springStiffness: 0.028,      // Restoring spring force k (smooth cubic-bezier style)
      springDamping: 0.855,        // Damping coefficient c for 1.2s fluid settling
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let animId = null;

    const mouse = { x: null, y: null };

    class Particle {
      constructor(w, h) {
        this.reset(w, h);
      }

      reset(w, h) {
        this.baseX = Math.random() * w;
        this.baseY = Math.random() * h;
        this.x = this.baseX;
        this.y = this.baseY;

        // Slow ambient floating velocity for base position
        this.ambientVx = (Math.random() - 0.5) * 0.4;
        this.ambientVy = (Math.random() - 0.5) * 0.4;

        // Current velocity (includes ambient + elastic displacement velocity)
        this.vx = 0;
        this.vy = 0;

        this.radius = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
        this.isAccent = Math.random() < 0.15;
      }

      update(w, h) {
        // 1. Advance ambient base position
        this.baseX += this.ambientVx;
        this.baseY += this.ambientVy;

        // Wrap base position around screen bounds
        if (this.baseX < -20) this.baseX = w + 20;
        if (this.baseX > w + 20) this.baseX = -20;
        if (this.baseY < -20) this.baseY = h + 20;
        if (this.baseY > h + 20) this.baseY = -20;

        // 2. Mouse attraction force towards current cursor position
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distSq = dx * dx + dy * dy;
          const mouseRadSq = CONFIG.mouseRadius * CONFIG.mouseRadius;

          if (distSq < mouseRadSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseAttraction;
            this.vx += (dx / dist) * force;
            this.vy += (dy / dist) * force;
          }
        }

        // 3. Elastic Spring restoring force pulling particle back to ambient base position
        const dispX = this.x - this.baseX;
        const dispY = this.y - this.baseY;
        const springFx = -CONFIG.springStiffness * dispX;
        const springFy = -CONFIG.springStiffness * dispY;

        // Update velocity with spring restoring force and damping
        this.vx = (this.vx + springFx) * CONFIG.springDamping;
        this.vy = (this.vy + springFy) * CONFIG.springDamping;

        // Update particle position
        this.x += this.vx + this.ambientVx;
        this.y += this.vy + this.ambientVy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const color = this.isAccent ? CONFIG.accentColor : CONFIG.nodeColor;
        const opacity = this.isAccent ? CONFIG.nodeOpacity * 1.5 : CONFIG.nodeOpacity;
        ctx.fillStyle = `rgba(${color}, ${opacity})`;
        ctx.fill();
      }
    }

    function resize() {
      dpr = window.devicePixelRatio || 1;
      const rect = heroSection.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const isMobile = width <= 600;
      const minP = isMobile ? 18 : CONFIG.minParticles;
      const maxP = isMobile ? 35 : CONFIG.maxParticles;

      const targetCount = Math.min(
        maxP,
        Math.max(minP, Math.floor((width * height) / CONFIG.areaPerParticle))
      );

      if (particles.length < targetCount) {
        for (let i = particles.length; i < targetCount; i++) {
          particles.push(new Particle(width, height));
        }
      } else if (particles.length > targetCount) {
        particles.length = targetCount;
      }
    }

    let isVisible = true;
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(animate);
        }
      });
    }, { threshold: 0 });
    heroObserver.observe(heroSection);

    function animate() {
      if (!isVisible) {
        animId = null;
        return;
      }
      ctx.clearRect(0, 0, width, height);

      // 1. Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(width, height);
        particles[i].draw();
      }

      // 2. Draw connecting lines between nodes
      const isMobile = width <= 600;
      const effectiveMaxDist = isMobile ? 95 : CONFIG.maxDistance;
      const maxDistSq = effectiveMaxDist * effectiveMaxDist;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = CONFIG.lineOpacity * (1 - dist / effectiveMaxDist);

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${CONFIG.nodeColor}, ${alpha})`;
            ctx.lineWidth = CONFIG.lineWidth;
            ctx.stroke();
          }
        }

        // 4. Draw lines to cursor when hovering
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = particles[i].x - mouse.x;
          const mdy = particles[i].y - mouse.y;
          const mdistSq = mdx * mdx + mdy * mdy;
          const mMaxDistSq = CONFIG.mouseRadius * CONFIG.mouseRadius;

          if (mdistSq < mMaxDistSq) {
            const mdist = Math.sqrt(mdistSq);
            const mAlpha = CONFIG.mouseLineOpacity * (1 - mdist / CONFIG.mouseRadius);

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${CONFIG.accentColor}, ${mAlpha})`;
            ctx.lineWidth = CONFIG.lineWidth * 1.1;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    }

    // Mouse Movement Tracking
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    heroSection.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    heroSection.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    }, { passive: true });

    heroSection.addEventListener("touchend", () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener("resize", resize);

    resize();
    animId = requestAnimationFrame(animate);
  })();

  // 16. About Me Section: Independent Scroll Boards & True Click-and-Drag macOS Terminal Window
  (function initAboutInteractiveComposition() {
    const section = document.getElementById("about");
    if (!section) return;

    // 16A. Scroll-Responsive Floating Boards (Independent from Terminal)
    function initAboutScrollBoards() {
      const badges = section.querySelectorAll(".about-sticker-badge");
      if (badges.length === 0) return;

      const boardConfigs = [
        { selector: ".badge-automation", maxDistX: 0, maxDistY: -35, baseRot: -5, rotDelta: -2 },
        { selector: ".badge-powerbi", maxDistX: 0, maxDistY: 28, baseRot: 4, rotDelta: 2 },
        { selector: ".badge-aiml", maxDistX: -14, maxDistY: -22, baseRot: -3, rotDelta: -1.5 },
        { selector: ".badge-py-sql", maxDistX: 18, maxDistY: 0, baseRot: 6, rotDelta: 1.2 },
        { selector: ".badge-snowflake", maxDistX: 12, maxDistY: 15, baseRot: -4, rotDelta: -1 },
      ];

      const boardItems = [];
      boardConfigs.forEach((cfg) => {
        const el = section.querySelector(cfg.selector);
        if (el) {
          boardItems.push({ el, ...cfg });
        }
      });

      let ticking = false;

      function updateBoards() {
        ticking = false;
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) {
          boardItems.forEach((item) => {
            item.el.style.removeProperty("--board-tx");
            item.el.style.removeProperty("--board-ty");
            item.el.style.removeProperty("--board-rot");
          });
          return;
        }

        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;

        // Exit early if section is outside viewport
        if (rect.bottom < -100 || rect.top > vh + 100) return;

        // Normalized progress: 0 when entering bottom, 0.5 when centered, 1 when leaving top
        const totalTravel = vh + rect.height;
        const currentTravel = vh - rect.top;
        const progress = Math.max(0, Math.min(1, currentTravel / totalTravel));
        const centeredProgress = (progress - 0.5) * 2;

        const winWidth = window.innerWidth;
        let responsiveScale = 1.0;
        if (winWidth <= 480) {
          responsiveScale = 0.35;
        } else if (winWidth <= 1024) {
          responsiveScale = 0.65;
        }

        boardItems.forEach((item) => {
          const tx = (item.maxDistX * centeredProgress * responsiveScale).toFixed(2);
          const ty = (item.maxDistY * centeredProgress * responsiveScale).toFixed(2);
          const rot = (item.baseRot + item.rotDelta * centeredProgress).toFixed(2);

          item.el.style.setProperty("--board-tx", `${tx}px`);
          item.el.style.setProperty("--board-ty", `${ty}px`);
          item.el.style.setProperty("--board-rot", `${rot}deg`);
        });
      }

      window.addEventListener("scroll", () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateBoards);
        }
      }, { passive: true });

      window.addEventListener("resize", () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateBoards);
        }
      }, { passive: true });

      updateBoards();
    }

    // 16B. macOS Terminal: True Click-and-Drag Floating Window
    function initAboutTerminal() {
      const terminalEl = document.getElementById("about-interactive-terminal");
      const stageEl = section.querySelector(".about-terminal-stage");
      const loginTimeEl = document.getElementById("term-login-time");
      const quoteTextEl = document.getElementById("term-quote-text");
      const themeToggleBtn = document.getElementById("term-theme-toggle-btn");
      const themeIconEl = document.getElementById("term-theme-icon");
      if (!terminalEl || !stageEl) return;

      // 1. Dynamic Terminal Login Timestamp
      if (loginTimeEl) {
        const now = new Date();
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = days[now.getDay()];
        const month = months[now.getMonth()];
        const date = now.getDate();
        const timeStr = now.toTimeString().split(" ")[0];
        loginTimeEl.textContent = `${day} ${month} ${date} ${timeStr}`;
      }

      // 2. Interactive Terminal Dark/Light Mode Theme Toggle (Exempt from drag)
      if (themeToggleBtn && themeIconEl) {
        themeToggleBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const isCurrentlyDark = terminalEl.classList.contains("theme-dark");
          if (isCurrentlyDark) {
            terminalEl.classList.remove("theme-dark");
            terminalEl.classList.add("theme-light");
            themeIconEl.textContent = "🌙";
            themeToggleBtn.setAttribute("aria-label", "Switch terminal to dark mode");
          } else {
            terminalEl.classList.remove("theme-light");
            terminalEl.classList.add("theme-dark");
            themeIconEl.textContent = "☀️";
            themeToggleBtn.setAttribute("aria-label", "Switch terminal to light mode");
          }
        });
      }

      // 3. Dynamic Quotes Cycling for Terminal
      const TERMINAL_QUOTES = [
        "Precision may not be attainable, but if we chase perfection, we can catch excellence.",
        "Transforming complex raw data into actionable decisions and automated systems.",
        "Data Science & AI: Turning signals in noise into predictive solutions.",
      ];
      let quoteIndex = 0;
      let isTyping = false;

      function cycleQuote() {
        if (!quoteTextEl || isTyping) return;
        isTyping = true;
        quoteIndex = (quoteIndex + 1) % TERMINAL_QUOTES.length;
        const targetQuote = TERMINAL_QUOTES[quoteIndex];
        let charIdx = 0;
        quoteTextEl.textContent = "";

        const typeInterval = setInterval(() => {
          if (charIdx < targetQuote.length) {
            quoteTextEl.textContent += targetQuote.charAt(charIdx);
            charIdx++;
          } else {
            clearInterval(typeInterval);
            isTyping = false;
          }
        }, 35);
      }

      setInterval(() => {
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          cycleQuote();
        }
      }, 18000);

      // 4. True Click-and-Drag Window System (ONLY Title Bar is the Drag Handle)
      // Position State stored in memory: persists across interactions with NO auto-return
      const titlebarEl = terminalEl.querySelector(".terminal-header, .about-terminal-titlebar");
      if (!titlebarEl) return;

      const pos = { x: 0, y: 0 };
      const dragStart = { pointerX: 0, pointerY: 0, termX: 0, termY: 0 };
      let isDragging = false;
      let isPointerDown = false;
      let activePointerId = null;
      const DRAG_THRESHOLD = 3; // px movement threshold to differentiate click vs drag

      function getStageBounds() {
        const stageRect = stageEl.getBoundingClientRect();
        const termRect = terminalEl.getBoundingClientRect();

        // Calculate untransformed resting bounds inside stage
        const restingLeft = termRect.left - pos.x;
        const restingRight = termRect.right - pos.x;
        const restingTop = termRect.top - pos.y;
        const restingBottom = termRect.bottom - pos.y;

        // Allowed translation bounds relative to resting position (0, 0)
        const minX = stageRect.left - restingLeft;
        const maxX = stageRect.right - restingRight;
        const minY = stageRect.top - restingTop;
        const maxY = stageRect.bottom - restingBottom;

        return { minX, maxX, minY, maxY };
      }

      function onPointerDown(e) {
        // Only primary mouse button (left-click) or touch
        if (e.button !== undefined && e.button !== 0) return;

        // Exclude interactive controls (buttons, links, inputs, theme toggle)
        if (e.target.closest("#term-theme-toggle-btn, button, a, input, textarea, select, [role='button']")) {
          return;
        }

        // On mobile touch devices with very narrow screens (<=600px), keep terminal static so page scrolling is seamless
        if (window.innerWidth <= 600 && window.matchMedia("(pointer: coarse)").matches) {
          return;
        }

        isPointerDown = true;
        activePointerId = e.pointerId;
        dragStart.pointerX = e.clientX;
        dragStart.pointerY = e.clientY;
        dragStart.termX = pos.x;
        dragStart.termY = pos.y;
      }

      function onPointerMove(e) {
        if (!isPointerDown) return;

        // Check if movement exceeds threshold to start dragging
        if (!isDragging) {
          const dist = Math.hypot(e.clientX - dragStart.pointerX, e.clientY - dragStart.pointerY);
          if (dist >= DRAG_THRESHOLD) {
            isDragging = true;
            terminalEl.classList.add("is-dragging");
            document.body.classList.add("terminal-dragging-active");
            if (titlebarEl.setPointerCapture && activePointerId !== null) {
              try {
                titlebarEl.setPointerCapture(activePointerId);
              } catch (err) {}
            }
          }
        }

        if (isDragging) {
          const deltaX = e.clientX - dragStart.pointerX;
          const deltaY = e.clientY - dragStart.pointerY;
          const targetX = dragStart.termX + deltaX;
          const targetY = dragStart.termY + deltaY;

          const bounds = getStageBounds();
          pos.x = Math.max(bounds.minX, Math.min(bounds.maxX, targetX));
          pos.y = Math.max(bounds.minY, Math.min(bounds.maxY, targetY));

          terminalEl.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
        }
      }

      function onPointerUp(e) {
        if (isDragging) {
          isDragging = false;
          terminalEl.classList.remove("is-dragging");
          document.body.classList.remove("terminal-dragging-active");
          if (titlebarEl.releasePointerCapture && activePointerId !== null) {
            try {
              titlebarEl.releasePointerCapture(activePointerId);
            } catch (err) {}
          }
          // The terminal remains at pos.x, pos.y! NO auto-return, NO snap back.
        }
        isPointerDown = false;
        activePointerId = null;
      }

      // Attach pointer listener ONLY to the title bar handle
      titlebarEl.addEventListener("pointerdown", onPointerDown, { passive: false });
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { passive: true });
      window.addEventListener("pointercancel", onPointerUp, { passive: true });

      // Window resize re-clamping to prevent escaping stage on viewport changes
      window.addEventListener("resize", () => {
        if (pos.x !== 0 || pos.y !== 0) {
          const bounds = getStageBounds();
          pos.x = Math.max(bounds.minX, Math.min(bounds.maxX, pos.x));
          pos.y = Math.max(bounds.minY, Math.min(bounds.maxY, pos.y));
          terminalEl.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
        }
      }, { passive: true });
    }

    initAboutScrollBoards();
    initAboutTerminal();
  })();

  // 16B. About Me Section: Full-Width Continuous Racing Square-Box Field (Isolated to #about)
  (function initAboutRacingBackground() {
    const section = document.getElementById("about");
    const canvas = document.getElementById("about-racing-canvas");
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = null;
    let isRunning = false;
    let isVisible = false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Grid configuration
    let numRows = 17;
    let baseColWidth = 88;
    let gapX = 9;
    let scaleMin = 0.52; // Scale at top of section
    let scaleMax = 1.08; // Scale at bottom of section
    let speed = 0.22;    // Cycles per second (forward racing speed)
    let offsetPhase = 0; // Normalized phase in [0, 1)
    let lastTime = performance.now();

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function resizeCanvas() {
      const rect = section.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Responsive tuning for different viewports
      if (width <= 480) {
        numRows = 13;
        baseColWidth = 68;
        gapX = 7;
        scaleMin = 0.58;
        scaleMax = 1.0;
        speed = 0.18;
      } else if (width <= 768) {
        numRows = 15;
        baseColWidth = 78;
        gapX = 8;
        scaleMin = 0.55;
        scaleMax = 1.04;
        speed = 0.20;
      } else {
        numRows = 17;
        baseColWidth = 88;
        gapX = 9;
        scaleMin = 0.52;
        scaleMax = 1.08;
        speed = 0.22;
      }

      if (motionQuery.matches) {
        renderFrame();
      }
    }

    // Maps normalized row progress t in [0, 1] to screen Y coordinate with natural perspective acceleration
    function getY(t) {
      // Starts slightly above the top (-45px) and ends slightly below the bottom (height + 70px)
      const yStart = -45;
      const yEnd = height + 70;
      return yStart + (yEnd - yStart) * Math.pow(t, 1.35);
    }

    // Perspective scale at progress t in [0, 1]
    function getScale(t) {
      return scaleMin + (scaleMax - scaleMin) * t;
    }

    function renderFrame() {
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const gapRowFraction = 0.12; // Gap between successive rows

      // Calculate the world half-width needed to cover the screen plus 20% margin
      const maxNeededWorldX = (centerX / scaleMin) + baseColWidth * 2;
      const maxColIndex = Math.ceil(maxNeededWorldX / baseColWidth);

      // Draw rows from furthest (t near 0, top of screen) to closest (t near 1, bottom of screen)
      for (let r = 0; r <= numRows; r++) {
        // Continuous normalized progress for this row
        const tBack = (r + offsetPhase) / numRows;
        const tFront = (r + 1 + offsetPhase - gapRowFraction) / numRows;

        // Skip rows completely outside the vertical drawing window
        if (tFront <= -0.05 || tBack >= 1.08) continue;

        const clampedTBack = Math.max(0, Math.min(1, tBack));
        const clampedTFront = Math.max(0, Math.min(1, tFront));

        const yBack = getY(clampedTBack);
        const yFront = getY(clampedTFront);

        // Screen vertical bounds check
        if (yFront < -50 || yBack > height + 80) continue;

        const sBack = getScale(clampedTBack);
        const sFront = getScale(clampedTFront);

        // Opacity and stroke weight: soft, light, and dim at top/bottom edges, full clarity in center
        const midT = (clampedTBack + clampedTFront) * 0.5;
        let alpha = 0.08 + 0.04 * midT;
        if (midT < 0.25) {
          // Gradual smooth fade-in from 0% to 25% section height
          alpha *= Math.pow(midT / 0.25, 1.4);
        } else if (midT > 0.75) {
          // Gradual smooth fade-out from 75% to 100% section height
          alpha *= Math.pow(Math.max(0, (1 - midT) / 0.25), 1.4);
        }
        if (alpha <= 0.002) continue;

        const lineWidth = 0.65 + 0.35 * midT;
        ctx.lineWidth = lineWidth;

        // 3D Front drop height for physical block perspective relief
        const dropHeight = Math.max(1.2, Math.min(6, 5 * sFront));

        for (let c = -maxColIndex; c < maxColIndex; c++) {
          const worldLeft = c * baseColWidth + gapX * 0.5;
          const worldRight = (c + 1) * baseColWidth - gapX * 0.5;

          // 4 corners of the top-face perspective trapezoid
          const x1 = centerX + worldLeft * sBack;   // top-left
          const x2 = centerX + worldRight * sBack;  // top-right
          const x3 = centerX + worldRight * sFront; // bottom-right
          const x4 = centerX + worldLeft * sFront;  // bottom-left

          // Strict horizontal culling: only skip if completely outside visible bounds with margin
          if (x2 < -30 && x3 < -30) continue;
          if (x1 > width + 30 && x4 > width + 30) continue;

          // Outlined top face of the square box
          ctx.beginPath();
          ctx.moveTo(x1, yBack);
          ctx.lineTo(x2, yBack);
          ctx.lineTo(x3, yFront);
          ctx.lineTo(x4, yFront);
          ctx.closePath();

          // Subtle translucent white fill to provide physical presence over the white background
          ctx.fillStyle = `rgba(255, 255, 255, ${0.40 * (0.5 + 0.5 * midT)})`;
          ctx.fill();

          // Subtle slate/gray outline
          ctx.strokeStyle = `rgba(30, 41, 59, ${alpha})`;
          ctx.stroke();

          // 3D Front drop face for block perspective depth
          if (dropHeight >= 1.2 && yFront < height + 20) {
            ctx.beginPath();
            ctx.moveTo(x4, yFront);
            ctx.lineTo(x3, yFront);
            ctx.lineTo(x3, yFront + dropHeight);
            ctx.lineTo(x4, yFront + dropHeight);
            ctx.closePath();

            ctx.fillStyle = `rgba(241, 245, 249, ${0.30 * midT})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(30, 41, 59, ${alpha * 0.75})`;
            ctx.stroke();
          }
        }
      }
    }

    function animate(now) {
      if (!isRunning) return;

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      offsetPhase = (offsetPhase + speed * dt) % 1;

      renderFrame();
      animId = requestAnimationFrame(animate);
    }

    function startLoop() {
      if (isRunning || motionQuery.matches) return;
      isRunning = true;
      lastTime = performance.now();
      animId = requestAnimationFrame(animate);
    }

    function stopLoop() {
      isRunning = false;
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }

    // IntersectionObserver to pause rendering when section is out of view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!motionQuery.matches) {
            startLoop();
          } else {
            renderFrame();
          }
        } else {
          stopLoop();
        }
      });
    }, { threshold: 0.02 });

    observer.observe(section);

    // Window resize handler
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        if (!isRunning && isVisible) {
          renderFrame();
        }
      }, 100);
    }, { passive: true });

    // Handle prefers-reduced-motion dynamically
    motionQuery.addEventListener("change", (e) => {
      if (e.matches) {
        stopLoop();
        renderFrame();
      } else if (isVisible) {
        startLoop();
      }
    });

    // Initial setup
    resizeCanvas();
    if (motionQuery.matches) {
      renderFrame();
    }
  })();

  // 17. Tech / Skills Section: "Living AI Data Network & Central Computational Core" (Isolated to #skills)
  (function initSkillsAIDataNetwork() {
    const section = document.getElementById("skills");
    const canvas = document.getElementById("skills-network-canvas");
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = null;
    let isVisible = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastTime = 0;
    let globalTime = 0;

    const CONFIG = {
      areaPerNode: 13000,
      minNodes: 28,
      maxNodes: 65,
      connectDistance: 145,
      mobileConnectDistance: 105,
      nodeColor: "100, 116, 139",     // Subtle slate
      accentIndigo: "79, 70, 229",    // Tech Indigo
      accentCyan: "6, 182, 212",      // Cyan computational highlight
      accentViolet: "124, 58, 237",   // Neural Violet
      coreRings: 3,                   // Concentric central AI core rings
      packetSpeed: 0.42,              // Neural propagation speed
      maxPackets: 24,
      mobileMaxPackets: 12,
    };

    // Layer 1: Central Computational AI Core
    class CentralAICore {
      constructor() {
        this.angle1 = 0;
        this.angle2 = Math.PI * 0.5;
        this.angle3 = Math.PI * 0.25;
        this.pulse = 0;
        this.shockwaves = [];
      }

      triggerShockwave(x, y) {
        this.shockwaves.push({
          x: x !== undefined ? x : width * 0.5,
          y: y !== undefined ? y : height * 0.22,
          radius: 10,
          maxRadius: Math.max(width, height) * 0.65,
          alpha: 0.65,
          speed: 380,
        });
      }

      update(dt) {
        this.angle1 += dt * 0.25;
        this.angle2 -= dt * 0.18;
        this.angle3 += dt * 0.35;
        this.pulse += dt * 2.2;

        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
          const sw = this.shockwaves[i];
          sw.radius += sw.speed * dt;
          sw.alpha *= Math.pow(0.92, dt * 60);
          if (sw.radius >= sw.maxRadius || sw.alpha <= 0.01) {
            this.shockwaves.splice(i, 1);
          }
        }
      }

      draw(coreX, coreY) {
        const isMobile = width < 600;
        const baseRadius = isMobile ? 55 : 95;
        const pulseScale = 1.0 + 0.06 * Math.sin(this.pulse);

        // Core background ambient radial energy
        const coreGrad = ctx.createRadialGradient(
          coreX, coreY, 0,
          coreX, coreY, baseRadius * 1.8
        );
        coreGrad.addColorStop(0, `rgba(${CONFIG.accentIndigo}, 0.16)`);
        coreGrad.addColorStop(0.4, `rgba(${CONFIG.accentViolet}, 0.07)`);
        coreGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, baseRadius * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // 1. Concentric Ring 1 (Inner Segmented Orbit)
        ctx.save();
        ctx.translate(coreX, coreY);
        ctx.rotate(this.angle1);
        ctx.strokeStyle = `rgba(${CONFIG.accentIndigo}, 0.22)`;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([12, 16]);
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 0.55 * pulseScale, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting inner satellite node
        const sx1 = Math.cos(this.angle1 * 2) * (baseRadius * 0.55 * pulseScale);
        const sy1 = Math.sin(this.angle1 * 2) * (baseRadius * 0.55 * pulseScale);
        ctx.setLineDash([]);
        ctx.fillStyle = `rgba(${CONFIG.accentCyan}, 0.75)`;
        ctx.beginPath();
        ctx.arc(sx1, sy1, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. Concentric Ring 2 (Middle Arc Track)
        ctx.save();
        ctx.translate(coreX, coreY);
        ctx.rotate(this.angle2);
        ctx.strokeStyle = `rgba(${CONFIG.accentViolet}, 0.18)`;
        ctx.lineWidth = 1.0;
        ctx.setLineDash([28, 20, 8, 20]);
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 0.85 * pulseScale, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting node on middle track
        const sx2 = Math.cos(-this.angle2 * 1.5) * (baseRadius * 0.85 * pulseScale);
        const sy2 = Math.sin(-this.angle2 * 1.5) * (baseRadius * 0.85 * pulseScale);
        ctx.setLineDash([]);
        ctx.fillStyle = `rgba(${CONFIG.accentIndigo}, 0.65)`;
        ctx.beginPath();
        ctx.arc(sx2, sy2, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3. Concentric Ring 3 (Outer Geometric Crosshairs & Marks)
        ctx.save();
        ctx.translate(coreX, coreY);
        ctx.rotate(this.angle3);
        ctx.strokeStyle = `rgba(${CONFIG.nodeColor}, 0.12)`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 18]);
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 1.25, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Core Center Glowing Nucleus
        ctx.beginPath();
        ctx.arc(coreX, coreY, 5 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CONFIG.accentIndigo}, 0.75)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(coreX, coreY, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        // Draw active interactive shockwaves
        for (let i = 0; i < this.shockwaves.length; i++) {
          const sw = this.shockwaves[i];
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${CONFIG.accentIndigo}, ${sw.alpha * 0.5})`;
          ctx.lineWidth = 2.0;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(sw.x, sw.y, Math.max(0, sw.radius - 12), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${CONFIG.accentCyan}, ${sw.alpha * 0.35})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }
    }

    // Layer 2: Dynamic Neural Graph Nodes
    class NeuralNode {
      constructor(w, h) {
        this.reset(w, h);
      }

      reset(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.32;
        this.vy = (Math.random() - 0.5) * 0.32;
        this.radius = 1.8 + Math.random() * 2.2;
        this.isHub = Math.random() < 0.24; // Hub / AI computation cluster node
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.025 + Math.random() * 0.035;
        this.activity = 0; // Triggered when packet arrives or on hover
        this.color = this.isHub ? CONFIG.accentIndigo : CONFIG.nodeColor;
      }

      boostActivity(amount = 1.0) {
        this.activity = Math.min(2.0, this.activity + amount);
      }

      update(w, h, dt, mouseX, mouseY) {
        this.x += this.vx * (dt / 0.016);
        this.y += this.vy * (dt / 0.016);

        if (this.x < -20) this.x = w + 20;
        if (this.x > w + 20) this.x = -20;
        if (this.y < -20) this.y = h + 20;
        if (this.y > h + 20) this.y = -20;

        this.pulse += this.pulseSpeed;

        if (this.activity > 0) {
          this.activity = Math.max(0, this.activity - dt * 2.2);
        }

        // Smooth interactive mouse repulsion/attraction
        if (mouseX !== null && mouseY !== null) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const distSq = dx * dx + dy * dy;
          const range = 150;
          if (distSq < range * range && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / range) * 0.75;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
            this.boostActivity(0.08);
          }
        }
      }

      draw(parallaxX, parallaxY) {
        const px = this.x + parallaxX * 18;
        const py = this.y + parallaxY * 18;
        const pulseFactor = 0.85 + 0.15 * Math.sin(this.pulse);
        const currentRadius = (this.radius + this.activity * 2.0) * pulseFactor;
        const alpha = (this.isHub ? 0.28 : 0.16) + this.activity * 0.45;

        ctx.beginPath();
        ctx.arc(px, py, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.activity > 0.4
          ? `rgba(${CONFIG.accentCyan}, ${Math.min(0.95, alpha * 1.5)})`
          : `rgba(${this.color}, ${alpha})`;
        ctx.fill();

        if (this.isHub || this.activity > 0.2) {
          const ringR = currentRadius + 3.5 + this.activity * 4.5;
          const ringAlpha = (this.activity > 0 ? this.activity * 0.35 : 0.08);
          ctx.beginPath();
          ctx.arc(px, py, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${CONFIG.accentViolet}, ${ringAlpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }

    // Layer 3: Neural Data Packets
    class NeuralPacket {
      constructor(fromNode, toNode, color = CONFIG.accentIndigo) {
        this.from = fromNode;
        this.to = toNode;
        this.progress = 0;
        this.speed = CONFIG.packetSpeed * (0.85 + Math.random() * 0.5);
        this.size = 2.0 + Math.random() * 1.5;
        this.color = color;
        this.dead = false;
      }

      update(dt) {
        this.progress += this.speed * dt;
        if (this.progress >= 1.0) {
          this.progress = 1.0;
          this.dead = true;
          this.to.boostActivity(1.0);
        }
      }

      draw(parallaxX, parallaxY) {
        const fx = this.from.x + parallaxX * 18;
        const fy = this.from.y + parallaxY * 18;
        const tx = this.to.x + parallaxX * 18;
        const ty = this.to.y + parallaxY * 18;

        const px = fx + (tx - fx) * this.progress;
        const py = fy + (ty - fy) * this.progress;
        const alpha = Math.sin(this.progress * Math.PI) * 0.85;

        // Packet Core
        ctx.beginPath();
        ctx.arc(px, py, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${alpha})`;
        ctx.fill();

        // Glowing trail
        const trailP = Math.max(0, this.progress - 0.16);
        const trailX = fx + (tx - fx) * trailP;
        const trailY = fy + (ty - fy) * trailP;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(trailX, trailY);
        ctx.strokeStyle = `rgba(${this.color}, ${alpha * 0.55})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
    }

    // Layer 4: Abstract Floating Code & Data Tokens
    const CODE_TOKENS = [
      "{ }", "< >", "01", "=>", "[ ]", "λ", "tensor", "fit()",
      "import", "def", "SELECT", "model", "f(x)", "np.dot",
    ];

    class CodeToken {
      constructor(w, h) {
        this.reset(w, h);
      }

      reset(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.token = CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)];
        this.vx = (Math.random() - 0.5) * 0.18;
        this.vy = -0.06 - Math.random() * 0.12; // Slow upward float
        this.depth = 0.3 + Math.random() * 0.7;
        this.alpha = 0.08 + Math.random() * 0.14;
        this.size = Math.floor(9 + this.depth * 5);
        this.color = Math.random() > 0.4 ? CONFIG.accentIndigo : CONFIG.nodeColor;
      }

      update(w, h, dt) {
        this.x += this.vx * (dt / 0.016);
        this.y += this.vy * (dt / 0.016);

        if (this.y < -30) this.y = h + 30;
        if (this.x < -30) this.x = w + 30;
        if (this.x > w + 30) this.x = -30;
      }

      draw(parallaxX, parallaxY) {
        const px = this.x + parallaxX * (this.depth * 32);
        const py = this.y + parallaxY * (this.depth * 32);

        ctx.font = `600 ${this.size}px monospace, var(--font-sans)`;
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fillText(this.token, px, py);
      }
    }

    let core = new CentralAICore();
    let nodes = [];
    let packets = [];
    let codeTokens = [];

    // Mouse Parallax Lerping
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;
    const mouse = { x: null, y: null };

    function spawnPacket(fromNode, overrideColor) {
      const isMobile = width < 600;
      const maxPackets = isMobile ? CONFIG.mobileMaxPackets : CONFIG.maxPackets;
      if (packets.length >= maxPackets || nodes.length < 2) return;

      const source = fromNode || nodes[Math.floor(Math.random() * nodes.length)];
      const maxDist = isMobile ? CONFIG.mobileConnectDistance : CONFIG.connectDistance;
      const maxDistSq = maxDist * maxDist;

      const neighbors = [];
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n === source) continue;
        const dx = source.x - n.x;
        const dy = source.y - n.y;
        if (dx * dx + dy * dy < maxDistSq) {
          neighbors.push(n);
        }
      }

      if (neighbors.length > 0) {
        const dest = neighbors[Math.floor(Math.random() * neighbors.length)];
        const color = overrideColor || (source.isHub ? CONFIG.accentCyan : CONFIG.accentIndigo);
        packets.push(new NeuralPacket(source, dest, color));
      }
    }

    function initElements() {
      nodes = [];
      packets = [];
      codeTokens = [];

      const isMobile = width < 600;
      const minN = isMobile ? 18 : CONFIG.minNodes;
      const maxN = isMobile ? 32 : CONFIG.maxNodes;
      const targetCount = Math.min(
        maxN,
        Math.max(minN, Math.floor((width * height) / CONFIG.areaPerNode))
      );

      for (let i = 0; i < targetCount; i++) {
        nodes.push(new NeuralNode(width, height));
      }

      const tokenCount = isMobile ? 8 : 16;
      for (let i = 0; i < tokenCount; i++) {
        codeTokens.push(new CodeToken(width, height));
      }
    }

    function resize() {
      const rect = section.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initElements();
    }

    function render(timestamp) {
      if (!isVisible) return;

      if (!lastTime) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
      lastTime = timestamp;
      globalTime += dt;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!prefersReducedMotion) {
        core.update(dt);
        nodes.forEach((n) => n.update(width, height, dt, mouse.x, mouse.y));
        codeTokens.forEach((ct) => ct.update(width, height, dt));

        // Periodic ambient packet spawning
        if (Math.random() < 0.12) {
          spawnPacket();
        }

        // Update active neural packets
        for (let p = packets.length - 1; p >= 0; p--) {
          packets[p].update(dt);
          if (packets[p].dead) {
            // Branch propagation
            if (Math.random() < 0.35) {
              spawnPacket(packets[p].to);
            }
            packets.splice(p, 1);
          }
        }
      }

      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.06;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.06;

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      // ==========================================
      // LAYER 1 — CENTRAL AI COMPUTATIONAL CORE
      // ==========================================
      const coreX = (width * 0.5) + currentParallaxX * 14;
      const coreY = Math.min(240, height * 0.22) + currentParallaxY * 10;
      core.draw(coreX, coreY);

      // ==========================================
      // LAYER 2 — ABSTRACT FLOATING CODE & DATA TOKENS
      // ==========================================
      codeTokens.forEach((token) => {
        token.draw(currentParallaxX, currentParallaxY);
      });

      // ==========================================
      // LAYER 3 — SYNAPTIC CONNECTIONS BETWEEN NODES
      // ==========================================
      const isMobile = width < 600;
      const maxDist = isMobile ? CONFIG.mobileConnectDistance : CONFIG.connectDistance;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const factor = 1 - dist / maxDist;
            const activityBoost = Math.max(nodes[i].activity, nodes[j].activity);
            const alpha = (0.065 + activityBoost * 0.25) * factor * factor;
            const isSpecial = nodes[i].isHub || nodes[j].isHub || activityBoost > 0.4;

            const x1 = nodes[i].x + currentParallaxX * 18;
            const y1 = nodes[i].y + currentParallaxY * 18;
            const x2 = nodes[j].x + currentParallaxX * 18;
            const y2 = nodes[j].y + currentParallaxY * 18;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = isSpecial
              ? `rgba(${CONFIG.accentIndigo}, ${Math.min(0.6, alpha * 1.5)})`
              : `rgba(${CONFIG.nodeColor}, ${alpha})`;
            ctx.lineWidth = isSpecial ? 1.0 : 0.7;
            ctx.stroke();
          }
        }
      }

      // ==========================================
      // LAYER 4 — ACTIVE NEURAL DATA PACKETS
      // ==========================================
      if (!prefersReducedMotion) {
        packets.forEach((packet) => {
          packet.draw(currentParallaxX, currentParallaxY);
        });
      }

      // ==========================================
      // LAYER 5 — NEURAL GRAPH NODES
      // ==========================================
      nodes.forEach((node) => {
        node.draw(currentParallaxX, currentParallaxY);
      });

      ctx.restore();

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    }

    // ==========================================
    // LAYER 6 — SKILL-CARD HOVER INTERACTIVITY
    // ==========================================
    function setupSkillCardInteractivity() {
      const skillCards = section.querySelectorAll(".skill-card");
      skillCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          const sectionRect = section.getBoundingClientRect();
          const cardRect = card.getBoundingClientRect();
          const cx = (cardRect.left + cardRect.width * 0.5) - sectionRect.left;
          const cy = (cardRect.top + cardRect.height * 0.5) - sectionRect.top;

          // Trigger energy shockwave from card center
          core.triggerShockwave(cx, cy);

          // Find nearby nodes and energize them with rapid packets
          const maxRadiusSq = 220 * 220;
          nodes.forEach((n) => {
            const dx = n.x - cx;
            const dy = n.y - cy;
            if (dx * dx + dy * dy < maxRadiusSq) {
              n.boostActivity(1.5);
              spawnPacket(n, CONFIG.accentCyan);
            }
          });
        });
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
            lastTime = 0;
            if (!animId) {
              animId = requestAnimationFrame(render);
            }
          } else {
            isVisible = false;
            if (animId) {
              cancelAnimationFrame(animId);
              animId = null;
            }
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(section);

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(() => {
        resize();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          render(0);
        }
      });
      resizeObserver.observe(section);
    } else {
      window.addEventListener("resize", resize, { passive: true });
    }

    section.addEventListener("mousemove", (e) => {
      const rect = section.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      targetParallaxX = (mouse.x / rect.width - 0.5);
      targetParallaxY = (mouse.y / rect.height - 0.5);
    }, { passive: true });

    section.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
      targetParallaxX = 0;
      targetParallaxY = 0;
    });

    resize();
    setupSkillCardInteractivity();
  })();

  // Experience Section Scrolling Rocket Journey (Scroll-Progress Controlled)
  (function initExperienceRocket() {
    const experienceSection = document.getElementById("experience");
    if (!experienceSection) return;

    const pathEl = document.getElementById("experience-rocket-path");
    const trailEl = document.getElementById("experience-rocket-trail");
    const maskPathEl = document.getElementById("experience-rocket-mask-path");
    const rocketWrapper = document.getElementById("experience-rocket-wrapper");
    const rocketEl = document.getElementById("experience-rocket");
    if (!pathEl || !rocketWrapper || !rocketEl) return;

    // Cached layout & geometry measurements
    let totalLength = 0;
    let secTopAbs = 0;
    let secHeight = 0;
    let windowHeight = window.innerHeight;
    let isVisible = false;
    let isInitialized = false;

    // Continuous Animation & Physical State
    let targetProgress = 0;
    let currentProgress = 0;
    let lastScrollProgress = 0;
    let scrollDirection = 1; // 1 = forward (scroll down), -1 = reverse (scroll up)
    let currentAngle = 0;
    let targetAngle = 0;

    // Single unified rAF loop controls
    let rafId = null;
    let isRunning = false;
    let lastFrameTime = 0;

    // Recalculates canonical S-curve path based on current container and card geometry
    function recalculatePath() {
      const secRect = experienceSection.getBoundingClientRect();
      if (!secRect.width || !secRect.height) return;

      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      secTopAbs = secRect.top + currentScrollY;
      secHeight = secRect.height;
      windowHeight = window.innerHeight || document.documentElement.clientHeight;

      const secW = secRect.width;
      const secH = secRect.height;

      const cards = Array.from(experienceSection.querySelectorAll(".experience-card"));
      if (cards.length === 0) return;

      const cardRects = cards.map((c) => {
        const r = c.getBoundingClientRect();
        return {
          left: r.left - secRect.left,
          right: r.right - secRect.left,
          top: r.top - secRect.top,
          bottom: r.bottom - secRect.top,
          width: r.width,
          height: r.height,
          centerX: r.left - secRect.left + r.width / 2,
          centerY: r.top - secRect.top + r.height / 2,
        };
      });

      const isMobile = window.innerWidth <= 768;
      const c0 = cardRects[0];
      const c1 = cardRects.length > 1 ? cardRects[1] : null;

      let startX, startY, midX, midY, endX, endY;
      let cp1X, cp1Y, cp2X, cp2Y, cp3X, cp3Y, cp4X, cp4Y;

      if (!isMobile) {
        // Desktop / Tablet 2-column alternating layout
        // True, elegant S-curve Bézier trajectory:
        // 1. Starts at Upper-Left area (above and left of Card 0)
        // 2. Sweeps through Upper Bend (~25%) in open sky above Card 0/1 toward the right
        // 3. Reverses direction through Center Transition (~50%) in gap between Card 0 and Card 1
        // 4. Sweeps through Lower Bend (~75%) in open space below Card 0 / left of Card 1
        // 5. Finishes at Lower-Right (~100%) below Card 1
        startX = Math.max(36, c0.left - 54);
        startY = Math.max(42, c0.top - 48);

        endX = Math.min(secW - 42, c1 ? c1.right + 58 : secW * 0.88);
        endY = Math.min(secH - 45, c1 ? c1.bottom + 58 : secH * 0.92);

        midX = secW * 0.50;
        midY = c1 ? (c0.bottom + c1.top) / 2 : secH * 0.50;

        // Upper bend sweeps in open sky above Card 0 & 1 toward the right:
        const rightExtent = Math.min(secW - 45, c1 ? c1.right + 55 : secW * 0.85);
        cp1X = c0.centerX + 30;
        cp1Y = startY - 10;
        cp2X = rightExtent;
        cp2Y = c0.top + (c0.bottom - c0.top) * 0.25;

        // Lower bend sweeps through center gap and lower-left whitespace:
        const leftExtent = Math.max(36, c0.left - 20);
        cp3X = leftExtent;
        cp3Y = midY + (c1 ? (c1.bottom - midY) * 0.45 : 70);
        cp4X = endX - 110;
        cp4Y = endY + 12;
      } else {
        // Mobile single-column stacked layout
        // Narrower but clearly S-shaped trajectory, strictly within horizontal bounds
        startX = Math.max(26, secW * 0.08);
        startY = Math.max(30, c0.top - 36);

        midX = secW * 0.50;
        midY = c1 ? (c0.bottom + c1.top) / 2 : secH * 0.50;

        endX = Math.min(secW - 26, secW * 0.92);
        endY = Math.min(secH - 30, c1 ? c1.bottom + 42 : secH * 0.92);

        cp1X = secW - 26;
        cp1Y = c0.top - 10;
        cp2X = secW - 22;
        cp2Y = midY - 25;

        cp3X = 26;
        cp3Y = midY + 25;
        cp4X = secW * 0.40;
        cp4Y = endY - 10;
      }

      // Single canonical S-curve path definition (used for both directions)
      const pathD =
        `M ${startX.toFixed(2)} ${startY.toFixed(2)} ` +
        `C ${cp1X.toFixed(2)} ${cp1Y.toFixed(2)}, ${cp2X.toFixed(2)} ${cp2Y.toFixed(2)}, ${midX.toFixed(2)} ${midY.toFixed(2)} ` +
        `C ${cp3X.toFixed(2)} ${cp3Y.toFixed(2)}, ${cp4X.toFixed(2)} ${cp4Y.toFixed(2)}, ${endX.toFixed(2)} ${endY.toFixed(2)}`;

      pathEl.setAttribute("d", pathD);
      if (trailEl) {
        trailEl.setAttribute("d", pathD);
      }
      if (maskPathEl) {
        maskPathEl.setAttribute("d", pathD);
      }

      totalLength = pathEl.getTotalLength();
      if (maskPathEl && totalLength > 0) {
        maskPathEl.style.strokeDasharray = `${totalLength} ${totalLength}`;
      }
    }

    // Normalized Experience-section progress: 0 -> 1
    function getScrollProgress() {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      // Rocket starts at 0% as the Experience section enters reading focus
      const startScroll = secTopAbs - windowHeight * 0.25;
      // Rocket completes at 100% as the Experience section concludes
      const endScroll = secTopAbs + secHeight - windowHeight * 0.65;

      const span = endScroll - startScroll;
      if (span <= 0) return 0;

      const raw = (currentScrollY - startScroll) / span;
      return Math.max(0, Math.min(1, raw));
    }

    // Calculates path tangent orientation with reverse heading support
    function getTangentAngleAt(progress, direction) {
      if (totalLength <= 0) return 0;
      const distance = Math.max(0, Math.min(totalLength, progress * totalLength));
      const delta = 2.5;
      const d1 = Math.max(0, distance - delta);
      const d2 = Math.min(totalLength, distance + delta);
      const p1 = pathEl.getPointAtLength(d1);
      const p2 = pathEl.getPointAtLength(d2);
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;

      if (dx === 0 && dy === 0) return currentAngle;

      // Forward tangent angle (SVG rocket points North / UP at 0deg)
      const forwardAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      const heading = direction === -1 ? forwardAngle + 180 : forwardAngle;
      return ((heading % 360) + 360) % 360;
    }

    // Renders the rocket GPU transforms and SVG trail mask in lockstep
    function renderRocket(progress, angle) {
      if (totalLength <= 0) return;
      const distance = Math.max(0, Math.min(totalLength, progress * totalLength));
      const pt = pathEl.getPointAtLength(distance);

      // Wrapper handles GPU translation to exact path point
      rocketWrapper.style.transform = `translate3d(${pt.x.toFixed(2)}px, ${pt.y.toFixed(2)}px, 0px)`;

      // Rocket element maintains centering on path while rotating around its center
      rocketEl.style.transform = `translate(-50%, -50%) rotate(${angle.toFixed(2)}deg)`;

      // Trail mask updates in direct sync with rocket progress
      const trailOffset = (totalLength - distance).toFixed(2);
      if (maskPathEl) {
        maskPathEl.style.strokeDashoffset = trailOffset;
      } else if (trailEl) {
        trailEl.style.strokeDashoffset = trailOffset;
      }
    }

    // Single unified frame-rate independent interpolation loop
    function tick(now) {
      if (!isRunning) return;

      if (!lastFrameTime) lastFrameTime = now;
      const dt = Math.min(32, Math.max(1, now - lastFrameTime));
      lastFrameTime = now;

      const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isReducedMotion) {
        currentProgress = targetProgress;
        targetAngle = getTangentAngleAt(currentProgress, scrollDirection);
        currentAngle = targetAngle;
        renderRocket(currentProgress, currentAngle);
        isRunning = false;
        rafId = null;
        lastFrameTime = 0;
        return;
      }

      // Delta-time based exponential decay smoothing for position
      const progressDiff = targetProgress - currentProgress;
      const absProgressDiff = Math.abs(progressDiff);

      // Adaptive speed: stays buttery smooth (~80ms settle) for normal scrolling,
      // accelerates dynamically if scroll position jumps significantly (e.g. scrollbar drag)
      const baseSpeed = 15;
      const adaptiveSpeed =
        absProgressDiff > 0.15 ? baseSpeed * (1 + (absProgressDiff - 0.15) * 4) : baseSpeed;

      const progressDecay = 1 - Math.exp(-adaptiveSpeed * (dt / 1000));
      currentProgress += progressDiff * progressDecay;

      // Calculate path tangent angle for the current rendered progress
      targetAngle = getTangentAngleAt(currentProgress, scrollDirection);

      // Shortest-arc angular difference handling the +/- 180° boundary
      const angleDiff = ((((targetAngle - currentAngle) % 360) + 540) % 360) - 180;
      const angleSpeed = 18;
      const angleDecay = 1 - Math.exp(-angleSpeed * (dt / 1000));
      currentAngle += angleDiff * angleDecay;
      currentAngle = ((currentAngle % 360) + 360) % 360;

      // Settling criteria: snap to exact target when sub-pixel difference is reached
      const progressSettled = Math.abs(targetProgress - currentProgress) < 0.00015;
      const angleSettled = Math.abs(angleDiff) < 0.08;

      if (progressSettled && angleSettled) {
        currentProgress = targetProgress;
        currentAngle = targetAngle;
        renderRocket(currentProgress, currentAngle);
        isRunning = false;
        rafId = null;
        lastFrameTime = 0;
        return;
      }

      renderRocket(currentProgress, currentAngle);
      rafId = requestAnimationFrame(tick);
    }

    // Initiates the rAF loop only when necessary
    function startAnimationLoop() {
      if (!isRunning && isVisible) {
        isRunning = true;
        lastFrameTime = 0;
        rafId = requestAnimationFrame(tick);
      }
    }

    // Scroll listener: calculates target progress & direction, starts loop
    function onScroll() {
      if (!isVisible) return;

      const nextProgress = getScrollProgress();
      const deltaP = nextProgress - lastScrollProgress;

      // Only update direction when delta exceeds noise threshold to prevent micro-jitter
      if (Math.abs(deltaP) > 0.0004) {
        scrollDirection = deltaP > 0 ? 1 : -1;
        lastScrollProgress = nextProgress;
      }

      targetProgress = nextProgress;
      startAnimationLoop();
    }

    // IntersectionObserver: sleep engine when Experience is offscreen, wake when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            recalculatePath();
            const initialProgress = getScrollProgress();
            targetProgress = initialProgress;
            lastScrollProgress = initialProgress;

            if (!isInitialized) {
              currentProgress = initialProgress;
              currentAngle = getTangentAngleAt(currentProgress, scrollDirection);
              targetAngle = currentAngle;
              renderRocket(currentProgress, currentAngle);
              isInitialized = true;
            } else {
              startAnimationLoop();
            }
          } else {
            if (rafId) {
              cancelAnimationFrame(rafId);
              rafId = null;
            }
            isRunning = false;
            lastFrameTime = 0;
          }
        });
      },
      { rootMargin: "250px 0px 250px 0px", threshold: 0.01 }
    );
    observer.observe(experienceSection);

    // Debounced resize handler to preserve scroll progress across viewport changes
    let resizeTimer = null;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        recalculatePath();
        const newProgress = getScrollProgress();
        targetProgress = newProgress;
        currentProgress = newProgress;
        lastScrollProgress = newProgress;
        currentAngle = getTangentAngleAt(currentProgress, scrollDirection);
        targetAngle = currentAngle;
        renderRocket(currentProgress, currentAngle);
      }, 60);
    }

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => handleResize());
      ro.observe(experienceSection);
    }
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // Initial setup: position rocket immediately without flying in from 0
    recalculatePath();
    const initialProgress = getScrollProgress();
    targetProgress = initialProgress;
    currentProgress = initialProgress;
    lastScrollProgress = initialProgress;
    currentAngle = getTangentAngleAt(currentProgress, scrollDirection);
    targetAngle = currentAngle;
    renderRocket(currentProgress, currentAngle);
    isInitialized = true;

    // Refresh once web fonts settle
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        recalculatePath();
        renderRocket(currentProgress, currentAngle);
      });
    }
  })();
});
