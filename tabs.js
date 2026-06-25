// =============================================================================
// PharmaTrack v2 — tabs.js
// Tab switching for Transit and QC sections.
// Must be loaded AFTER script.js (uses renderWithinPlantTransit, etc.).
// Loaded with `defer`.
// =============================================================================

document.addEventListener("DOMContentLoaded", function () {

  // ── Generic tab switcher factory ────────────────────────────────────────
  // tabBtnSelector  — CSS selector for tab buttons
  // tabPanelPrefix  — id prefix of the panel divs (e.g. "transit-tab-")
  // onSwitch        — optional callback(tab) for lazy renders
  function makeTabs(tabBtnSelector, tabPanelPrefix, onSwitch) {
    document.addEventListener("click", function (e) {
      const btn = e.target.closest(tabBtnSelector);
      if (!btn) return;
      const tab = btn.dataset.tab;

      // Update button styles
      document.querySelectorAll(tabBtnSelector).forEach(b => {
        const active = b.dataset.tab === tab;
        b.style.color        = active ? "var(--blue)"        : "var(--muted)";
        b.style.fontWeight   = active ? "700"                : "500";
        b.style.borderBottom = active ? "2px solid var(--blue)" : "2px solid transparent";
        b.setAttribute("aria-selected", active ? "true" : "false");
      });

      // Show/hide panels
      document.querySelectorAll(".transit-tab-panel, .qc-tab-panel").forEach(p => {
        if (p.id === tabPanelPrefix + tab) {
          p.style.display = "block";
          p.removeAttribute("hidden");
        } else if (p.id.startsWith(tabPanelPrefix)) {
          p.style.display = "none";
          p.setAttribute("hidden", "");
        }
      });

      // Trigger lazy renders
      if (typeof onSwitch === "function") onSwitch(tab);
    });
  }

  // ── Transit tabs ─────────────────────────────────────────────────────────
  makeTabs(".transit-tab-btn", "transit-tab-", function (tab) {
    if (tab === "withinplant" && typeof renderWithinPlantTransit === "function") {
      renderWithinPlantTransit();
    }
    if (tab === "detail" && typeof renderStockTransitSection === "function") {
      renderStockTransitSection();
    }
  });

  // ── QC tabs ───────────────────────────────────────────────────────────────
  makeTabs(".qc-tab-btn", "qc-tab-", null);

});
