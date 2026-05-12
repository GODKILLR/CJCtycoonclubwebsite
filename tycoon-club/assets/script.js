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
