// =============================================================================
// PharmaTrack v2 — ui.js
// UI interactions: theme toggle and mobile sidebar.
// No data dependencies — runs before any file is uploaded.
// Loaded with `defer` so DOM is ready when this executes.
// =============================================================================

// ── THEME TOGGLE ─────────────────────────────────────────────────────────────
(function () {
  const ROOT  = document.documentElement;
  const btn   = document.getElementById("theme-toggle");
  const icon  = document.getElementById("theme-icon");
  const label = document.getElementById("theme-label");

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // Apply saved theme immediately (before paint — the inline style in <head>
  // prevents FOUC for the very first frame; this block syncs icons/labels).
  const saved = safeGet("epss-theme");
  if (saved === "light") {
    ROOT.setAttribute("data-theme", "light");
    icon.textContent  = "☀️";
    label.textContent = "Light";
  }

  btn.addEventListener("click", () => {
    const isLight = ROOT.getAttribute("data-theme") === "light";
    if (isLight) {
      ROOT.removeAttribute("data-theme");
      icon.textContent  = "🌙";
      label.textContent = "Dark";
      safeSet("epss-theme", "dark");
    } else {
      ROOT.setAttribute("data-theme", "light");
      icon.textContent  = "☀️";
      label.textContent = "Light";
      safeSet("epss-theme", "light");
    }
  });
})();

// ── MOBILE SIDEBAR TOGGLE ────────────────────────────────────────────────────
(function () {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const menuBtn = document.getElementById("mobile-menu-btn");

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.textContent = "✕";
    // Trap focus inside sidebar when open on mobile
    sidebar.focus();
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  }

  menuBtn.addEventListener("click", () => {
    sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener("click", closeSidebar);

  // Close sidebar on nav button click (mobile UX) — also works with keyboard
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  // Close sidebar on Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && sidebar.classList.contains("open")) closeSidebar();
  });

  // Swipe-to-close: track touch start X
  let touchStartX = 0;
  sidebar.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  sidebar.addEventListener("touchend", e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (dx > 60) closeSidebar(); // swipe left ≥ 60px closes sidebar
  }, { passive: true });
})();
