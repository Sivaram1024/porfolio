document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // 2. Global Navigation Bar is permanently fixed at bottom-center


  // 3. Hamburger Menu Drawer Toggle
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
    });

    const mobileLinks = mobileNav.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
      });
    });
  }

  // 3.5. Hero Greeting Text-Only Micro-Interaction Controller
  const heroGreeting = document.querySelector(".hero-greeting");
  const extraOWrapper = document.querySelector(".hero-greeting .extra-o-wrapper");

  if (heroGreeting && extraOWrapper) {
    const totalExtraO = 7; // 1 main + 7 extra = 8 'o' characters total
    const extraOElements = [];

    // Clear and pre-create extra "o" elements inside wrapper
    extraOWrapper.innerHTML = "";
    for (let i = 0; i < totalExtraO; i++) {
      const span = document.createElement("span");
      span.className = "extra-o";
      span.textContent = "o";
      span.setAttribute("aria-hidden", "true");
      extraOWrapper.appendChild(span);
      extraOElements.push(span);
    }

    let isHovered = false;
    let isAnimating = false;
    let mainTimer = null;
    let waveTimer = null;
    let currentIndex = 0; // 0 to 7

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Timing Constants
    const HOVER_DELAY = prefersReducedMotion ? 0 : 120;       // 120ms initial hover delay
    const HAND_WAVE_DELAY = prefersReducedMotion ? 0 : 150;   // Hand wave starts after 150ms
    const STEP_INTERVAL = prefersReducedMotion ? 0 : 250;     // 250ms per 'o' character

    function startHandWave() {
      heroGreeting.classList.add("is-waving");
    }

    function stopHandWave() {
      heroGreeting.classList.remove("is-waving");
    }

    function step() {
      if (isHovered) {
        if (currentIndex < totalExtraO) {
          const el = extraOElements[currentIndex];
          el.classList.add("is-visible");
          currentIndex++;

          if (currentIndex === totalExtraO) {
            // Reached maximum 'o' characters: stop waving, keep visible, do not restart
            stopHandWave();
            isAnimating = false;
            return;
          }

          mainTimer = setTimeout(step, STEP_INTERVAL);
        } else {
          isAnimating = false;
          stopHandWave();
        }
      } else {
        // Unhovered: remove one 'o' at a time every 250ms
        if (currentIndex > 0) {
          currentIndex--;
          const el = extraOElements[currentIndex];
          el.classList.remove("is-visible");

          if (currentIndex === 0) {
            stopHandWave();
            isAnimating = false;
            return;
          }

          mainTimer = setTimeout(step, STEP_INTERVAL);
        } else {
          stopHandWave();
          isAnimating = false;
        }
      }
    }

    function handleEnter() {
      if (isHovered) return;
      isHovered = true;
      heroGreeting.classList.add("is-hovered");

      if (mainTimer) clearTimeout(mainTimer);
      if (waveTimer) clearTimeout(waveTimer);

      if (isAnimating) return; // Allow active step to finish gracefully

      isAnimating = true;

      // Start gentle hand wave after 150ms
      waveTimer = setTimeout(startHandWave, HAND_WAVE_DELAY);

      // Start text expansion after 120ms hover delay
      mainTimer = setTimeout(step, HOVER_DELAY);
    }

    function handleLeave() {
      if (!isHovered) return;
      isHovered = false;
      heroGreeting.classList.remove("is-hovered");

      if (waveTimer) clearTimeout(waveTimer);

      if (isAnimating) return; // Allow active character step to finish before reversing

      isAnimating = true;
      mainTimer = setTimeout(step, 80);
    }

    // Interactive event listeners
    heroGreeting.addEventListener("mouseenter", handleEnter);
    heroGreeting.addEventListener("mouseleave", handleLeave);
    heroGreeting.addEventListener("focus", handleEnter);
    heroGreeting.addEventListener("blur", handleLeave);

    // Touch device support
    let touchState = false;
    heroGreeting.addEventListener("touchstart", () => {
      touchState = !touchState;
      if (touchState) {
        handleEnter();
      } else {
        handleLeave();
      }
    }, { passive: true });
  }

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
    const burst = document.createElement("div");
    burst.className = "click-burst-effect";
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;

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

  // 5.5. Statistics Number Count-Up Animation
  const statNumbers = document.querySelectorAll(".hero-stat-number");
  if (statNumbers.length > 0) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute("data-target"));
          const duration = 1800; // ms
          const startTime = performance.now();
          
          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = progress * (2 - progress); // Ease out quad
            const value = Math.floor(easeProgress * target);
            
            entry.target.textContent = value + "+";
            
            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              entry.target.textContent = target + "+";
            }
          }
          
          requestAnimationFrame(updateCount);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    statNumbers.forEach(num => countObserver.observe(num));
  }

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
    // Initialize EmailJS
    emailjs.init({
      publicKey: "0cKbCGbbjL8RAH65g",
    });

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      const formData = new FormData(contactForm);
      const from_name = formData.get("from_name")?.trim();
      const from_email = formData.get("from_email")?.trim();
      const subject = formData.get("subject")?.trim();
      const from_message = formData.get("from_message")?.trim();

      // Client-side fields validation
      if (!from_name) {
        showToast("Please enter your name.", "error");
        return;
      }
      if (!from_email || !/\S+@\S+\.\S+/.test(from_email)) {
        showToast("Please enter a valid email address.", "error");
        return;
      }
      if (!from_message) {
        showToast("Please enter your message.", "error");
        return;
      }

      const originalBtnContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
      submitBtn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span><span>Sending...</span>';

      try {
        await emailjs.send(
          "service_2cm6cum",
          "template_5omrl2m",
          {
            from_name,
            from_email,
            reply_to: from_email,
            subject: subject || "No Subject",
            from_message,
            to_name: "Sivaram Krishna",
            
            // Compatibility mappings for potential space-separated braces:
            "{ {from_name} }": from_name,
            "{ {from_email} }": from_email,
            "{ {from_message} }": from_message,
            "{ {to_name} }": "Sivaram Krishna",
            
            // Alternative standard naming variants
            name: from_name,
            email: from_email,
            message: from_message,
          }
        );

        showToast("Message sent successfully!", "success");
        submitBtn.classList.remove("is-loading");
        submitBtn.classList.add("is-success");
        submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="btn-icon-status"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Message Sent</span>';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.classList.remove("is-success");
          submitBtn.innerHTML = originalBtnContent;
          submitBtn.disabled = false;
        }, 3000);
      } catch (error) {
        console.error("EmailJS Error:", error);
        showToast("Failed to send message. Please try again later.", "error");
        submitBtn.classList.remove("is-loading");
        submitBtn.classList.add("is-error");
        submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="btn-icon-status"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg><span>Failed to Send</span>';

        setTimeout(() => {
          submitBtn.classList.remove("is-error");
          submitBtn.innerHTML = originalBtnContent;
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  }

  // 12. Active Section ScrollSpy
  const spySections = document.querySelectorAll("section[id]");
  const desktopLinks = document.querySelectorAll(".nav-item");
  const mobileLinks = document.querySelectorAll(".nav-item-mobile");

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          
          desktopLinks.forEach((link) => {
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });

          mobileLinks.forEach((link) => {
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }
      });
    },
    {
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    }
  );

  spySections.forEach((section) => spyObserver.observe(section));

  // 13. Back to Top Button Visibility
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("active");
      } else {
        backToTopBtn.classList.remove("active");
      }
    });
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

      const targetCount = Math.min(
        CONFIG.maxParticles,
        Math.max(CONFIG.minParticles, Math.floor((width * height) / CONFIG.areaPerParticle))
      );

      if (particles.length < targetCount) {
        for (let i = particles.length; i < targetCount; i++) {
          particles.push(new Particle(width, height));
        }
      } else if (particles.length > targetCount) {
        particles.length = targetCount;
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // 1. Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(width, height);
        particles[i].draw();
      }

      // 2. Draw connecting lines between nodes
      const effectiveMaxDist = CONFIG.maxDistance;
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
    });

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
    animate();
  })();
});
