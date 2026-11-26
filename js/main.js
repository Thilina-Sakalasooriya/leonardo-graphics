(() => {
  const root = document.documentElement;
  const body = document.body;
  root.classList.add("js");

  const CONTACT_EMAIL = "leonardo.graphics.and.artworks@gmail.com";
  const EMAIL_ENDPOINT = "";

  const sections = [...document.querySelectorAll("section[data-theme]")];
  const navLinks = [...document.querySelectorAll("[data-link]")];
  const nav = document.getElementById("nav");
  const progress = document.querySelector(".page-progress span");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const backTop = document.createElement("button");
  backTop.className = "back-to-top";
  backTop.type = "button";
  backTop.setAttribute("aria-label", "Back to top");
  backTop.innerHTML = '<svg class="back-top-ring" viewBox="0 0 44 44" aria-hidden="true"><circle class="back-top-track" cx="22" cy="22" r="19"/><circle class="back-top-progress" cx="22" cy="22" r="19"/></svg><span class="back-top-arrow">↑</span>';
  const backTopRing = backTop.querySelector(".back-top-progress");
  const backTopCircumference = 2 * Math.PI * 19;
  backTopRing.style.strokeDasharray = String(backTopCircumference);
  backTopRing.style.strokeDashoffset = String(backTopCircumference);
  body.appendChild(backTop);
  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });

  function setTheme(theme) {
    if (!theme || root.dataset.theme === theme) return;
    root.dataset.theme = theme;
    const bg = getComputedStyle(root).getPropertyValue("--bg").trim();
    if (themeColor && bg) themeColor.setAttribute("content", bg);
  }

  function setActiveNav(name) {
    navLinks.forEach(link => link.classList.toggle("is-active", link.dataset.link === name));
  }

  const ratios = new Map();
  if ("IntersectionObserver" in window) {
    const themeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) ratios.set(entry.target, entry.intersectionRatio);
        else ratios.delete(entry.target);
      });
      if (!ratios.size) return;
      const active = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0][0];
      setTheme(active.dataset.theme);
      setActiveNav(active.dataset.nav);
    }, { rootMargin: "-38% 0px -42% 0px", threshold: [0, 0.15, 0.35, 0.6, 0.9] });
    sections.forEach(section => themeObserver.observe(section));
  } else {
    const updateByScroll = () => {
      const point = window.scrollY + window.innerHeight / 2;
      const active = sections.find(section => point >= section.offsetTop && point < section.offsetTop + section.offsetHeight);
      if (!active) return;
      setTheme(active.dataset.theme);
      setActiveNav(active.dataset.nav);
    };
    window.addEventListener("scroll", updateByScroll, { passive: true });
    updateByScroll();
  }

  const revealItems = [...document.querySelectorAll(".reveal")];
  let revealObserver = null;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(item => item.classList.add("is-visible"));
  } else {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  }

  window.MagazineReveal = {
    observe(scope) {
      (scope || document).querySelectorAll(".reveal").forEach(item => {
        if (item.classList.contains("is-visible")) return;
        if (revealObserver) revealObserver.observe(item);
        else item.classList.add("is-visible");
      });
    }
  };

  const cardHand = document.querySelector(".packages-grid");
  if (cardHand) {
    if (reducedMotion || !("IntersectionObserver" in window)) {
      cardHand.classList.add("is-dealt");
    } else {
      const handObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-dealt");
          handObserver.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -15% 0px", threshold: 0.25 });
      handObserver.observe(cardHand);
    }
  }

  let ticking = false;
  function updateScrollUI() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.width = `${(ratio * 100).toFixed(2)}%`;
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 20);
    backTopRing.style.strokeDashoffset = String(backTopCircumference * (1 - ratio));
    backTop.classList.toggle("is-visible", window.scrollY > 180);
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScrollUI);
  }, { passive: true });
  updateScrollUI();

  const menuToggle = document.getElementById("menu-toggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const open = body.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    document.querySelectorAll("#nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        body.classList.remove("nav-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        body.classList.remove("nav-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (!reducedMotion && finePointer) {
    document.querySelectorAll(".work-card").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translate(-5px, -7px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  const emailLink = document.getElementById("contactEmail");
  if (emailLink) {
    emailLink.href = `mailto:${CONTACT_EMAIL}`;
    emailLink.textContent = CONTACT_EMAIL;
  }

  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  async function sendToEndpoint(payload) {
    if (!EMAIL_ENDPOINT) return false;
    try {
      const response = await fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  if (form && status) {
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const project = String(data.get("project") || "").trim();
      const budget = String(data.get("budget") || "").trim();
      const message = String(data.get("message") || "").trim();
      const subject = `New project inquiry — ${project}`;
      const body = `Name: ${name}\nEmail: ${email}\nProject: ${project}\nBudget: ${budget}\n\nBrief:\n${message}`;

      status.textContent = "SENDING THE SIGNAL...";
      const delivered = await sendToEndpoint({ name, email, project, budget, message, subject });

      if (delivered) {
        status.textContent = "MESSAGE SENT. I'LL GET BACK TO YOU SOON.";
        form.reset();
        return;
      }

      status.textContent = "OPENING YOUR EMAIL APP. IF NOTHING OPENS, COPY THE EMAIL ABOVE.";
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  const subscribeForm = document.getElementById("subscribe-form");
  const subscribeNote = document.getElementById("form-note");
  if (subscribeForm && subscribeNote) {
    subscribeForm.addEventListener("submit", event => {
      event.preventDefault();
      const input = subscribeForm.querySelector('input[type="email"]');
      const value = input ? input.value.trim() : "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        subscribeNote.textContent = "PLEASE ENTER A VALID EMAIL ADDRESS.";
        return;
      }
      subscribeNote.textContent = "THANK YOU — THIS IS A DEMO FORM, SO NO EMAIL WAS SENT.";
      input.value = "";
    });
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const field = document.createElement("textarea");
    field.value = text;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
    return Promise.resolve();
  }

  document.querySelectorAll("[data-copy]").forEach(button => {
    button.addEventListener("click", async () => {
      const target = document.getElementById(button.dataset.copy);
      if (!target) return;
      try {
        await copyText(target.textContent.trim());
        button.innerHTML = 'COPIED <span>✓</span>';
        setTimeout(() => { button.innerHTML = 'COPY EMAIL <span>⧉</span>'; }, 1800);
      } catch (error) {
        button.textContent = "SELECT AND COPY";
      }
    });
  });

  const contextTape = document.createElement("div");
  contextTape.className = "context-tape";
  contextTape.setAttribute("role", "status");
  contextTape.setAttribute("aria-live", "polite");
  const contextTapeLabel = document.createElement("span");
  contextTapeLabel.textContent = "RIGHT CLICK BLOCKED — DO NOT CROSS";
  contextTape.appendChild(contextTapeLabel);
  body.appendChild(contextTape);

  let contextTapeTimer = 0;
  document.addEventListener("contextmenu", event => {
    event.preventDefault();
    contextTape.classList.remove("is-visible");
    void contextTape.offsetWidth;
    contextTapeLabel.textContent = "";
    window.requestAnimationFrame(() => { contextTapeLabel.textContent = "RIGHT CLICK BLOCKED — DO NOT CROSS"; });
    contextTape.classList.add("is-visible");
    window.clearTimeout(contextTapeTimer);
    contextTapeTimer = window.setTimeout(() => contextTape.classList.remove("is-visible"), 1500);
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
