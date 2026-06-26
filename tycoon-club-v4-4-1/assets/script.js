// Tycoon Club — shared client-side behavior

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const toggle = document.querySelector(".mobile-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("is-open"));
  }

  // Mark active nav link
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });
  // Keep the "Professional Player Program" menu highlighted across its sub-pages
  const programPages = ["professional-players.html", "become-a-professional-player.html", "find-a-professional-player.html"];
  if (programPages.includes(path)) {
    const toggle = document.querySelector(".nav-dd-toggle");
    if (toggle) toggle.classList.add("active");
  }

  // Nav dropdown: open on hover/focus with a small close delay so moving the
  // pointer across the gap to the menu doesn't drop it (more reliable than CSS :hover).
  document.querySelectorAll(".nav-dd").forEach((dd) => {
    let closeTimer;
    const open = () => { clearTimeout(closeTimer); dd.classList.add("open"); };
    const close = () => { closeTimer = setTimeout(() => dd.classList.remove("open"), 180); };
    dd.addEventListener("mouseenter", open);
    dd.addEventListener("mouseleave", close);
    dd.addEventListener("focusin", open);
    dd.addEventListener("focusout", close);
  });

  // Access form — reveal info packet only after all acknowledgments pass
  const form = document.getElementById("access-form");
  if (form) {
    const checks = form.querySelectorAll('input[type="checkbox"][data-required]');
    const submit = form.querySelector('button[type="submit"]');
    const updateState = () => {
      const allChecked = Array.from(checks).every((c) => c.checked);
      submit.disabled = !allChecked;
      submit.style.opacity = allChecked ? "1" : "0.55";
      submit.style.cursor = allChecked ? "pointer" : "not-allowed";
    };
    checks.forEach((c) => c.addEventListener("change", updateState));
    updateState();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const required = ["fullName", "email", "jurisdiction"];
      for (const r of required) {
        if (!data.get(r)) {
          alert("Please complete all required fields.");
          return;
        }
      }
      // Restricted-jurisdiction block (illustrative — adjust per legal advice)
      const restricted = ["US", "CN", "KP", "IR", "SY", "CU"];
      if (restricted.includes(data.get("jurisdiction"))) {
        document.getElementById("form-blocked").classList.remove("hidden");
        document.getElementById("form-fields").classList.add("hidden");
        return;
      }
      // Local-only handoff: in production this would POST to a backend / KYC vendor.
      try {
        localStorage.setItem("tc_access_request", JSON.stringify({
          fullName: data.get("fullName"),
          email: data.get("email"),
          jurisdiction: data.get("jurisdiction"),
          referredBy: data.get("referredBy") || null,
          ts: new Date().toISOString(),
        }));
      } catch (_) { /* no-op */ }
      document.getElementById("form-fields").classList.add("hidden");
      document.getElementById("form-success").classList.remove("hidden");
      document.getElementById("form-success").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
});

// ---- Parallax scroll (shared across all pages) ----
document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canTranslate = window.CSS && CSS.supports && CSS.supports("translate", "0px");
  if (reduce || !canTranslate) return;

  // Site-wide drifting background depth layer
  const bg = document.createElement("div");
  bg.className = "parallax-bg";
  bg.setAttribute("aria-hidden", "true");
  bg.innerHTML =
    '<span class="pbg-blob a"></span><span class="pbg-blob b"></span><span class="pbg-blob c"></span>';
  document.body.appendChild(bg);

  const drift = [
    { el: bg.querySelector(".pbg-blob.a"), speed: 0.14 },
    { el: bg.querySelector(".pbg-blob.b"), speed: -0.09 },
    { el: bg.querySelector(".pbg-blob.c"), speed: 0.06 },
  ];

  // Decorative + opt-in targets, moved relative to viewport center.
  // Driven via the independent `translate` property so it composes with any
  // existing `transform` animation (hex-orb float, hub-halo centering) instead
  // of clobbering it.
  const centered = [];
  const add = (sel, speed) =>
    document.querySelectorAll(sel).forEach((el) => centered.push({ el, speed }));
  add(".hex-orb.left", 0.18);
  add(".hex-orb.right", -0.14);
  add(".hex-orb.small", 0.24);
  add(".hub-halo", 0.1);
  document.querySelectorAll("[data-parallax]").forEach((el) =>
    centered.push({ el, speed: parseFloat(el.getAttribute("data-parallax")) || 0.12 })
  );

  let ticking = false;
  const update = () => {
    const y = window.pageYOffset || document.documentElement.scrollTop || 0;
    const vh = window.innerHeight;
    for (const d of drift) d.el.style.translate = "0 " + (y * d.speed).toFixed(1) + "px";
    for (const c of centered) {
      const r = c.el.getBoundingClientRect();
      const fromCenter = r.top + r.height / 2 - vh / 2;
      c.el.style.translate = "0 " + (-fromCenter * c.speed).toFixed(1) + "px";
    }
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
});
