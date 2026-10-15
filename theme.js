/* theme.js - Light & Dark Mode Toggle for The Honest Million */
(function () {
  // Inject CSS variables and dark mode overrides
  const style = document.createElement("style");
  style.textContent = `
    /* Dark Theme Variable Overrides */
    body.dark-mode {
      --page: #070e17;
      --surface: #111c2d;
      --ink: #f8fafc;
      --muted: #94a3b8;
      --line: rgba(255, 255, 255, 0.12);
      --green-light: #1c2d42;
    }

    body.dark-mode .panel {
      background: #111c2d !important;
      border-color: rgba(255, 255, 255, 0.12) !important;
      color: #f8fafc;
    }

    body.dark-mode .panel.soft,
    body.dark-mode .verdict,
    body.dark-mode .more {
      background: #192841 !important;
      border-color: rgba(255, 255, 255, 0.18) !important;
      color: #e2e8f0 !important;
    }

    body.dark-mode .bignum,
    body.dark-mode h1,
    body.dark-mode h2,
    body.dark-mode h3 {
      color: #ffffff !important;
    }

    body.dark-mode .chip,
    body.dark-mode textarea {
      background: #111c2d;
      color: #f8fafc;
      border-color: rgba(255, 255, 255, 0.2);
    }

    body.dark-mode .chip[aria-pressed="true"] {
      background: #3b82f6;
      color: #ffffff;
    }

    body.dark-mode .drow:hover,
    body.dark-mode .alloc:hover,
    body.dark-mode .g:hover,
    body.dark-mode .opt:hover {
      background: #1a273e !important;
    }

    body.dark-mode .goal-card {
      background: #111c2d;
    }

    body.dark-mode .goal-chart {
      background: linear-gradient(140deg, #122238, #0d1726);
    }

    /* Floating Theme Toggle Button */
    .theme-toggle-btn {
      min-height: 44px;
      padding: 8px 16px;
      border: 1.5px solid #b6c8ee;
      border-radius: 999px;
      background: var(--surface);
      color: var(--ink);
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-left: 10px;
    }

    body.dark-mode .theme-toggle-btn {
      border-color: rgba(255, 255, 255, 0.2);
    }
  `;
  document.head.appendChild(style);

  // Function to set theme state
  function setTheme(isDark) {
    if (isDark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("hm_theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("hm_theme", "light");
    }
    updateBtnLabel();
  }

  function updateBtnLabel() {
    const btn = document.getElementById("themeBtn");
    if (btn) {
      const isDark = document.body.classList.contains("dark-mode");
      btn.innerHTML = isDark ? "🌙 Dark" : "☀️ Light";
    }
  }

  // Initialize theme button into the top bar when DOM is ready
  function init() {
    const savedTheme = localStorage.getItem("hm_theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }

    const langbar = document.querySelector(".langbar");
    if (langbar && !document.getElementById("themeBtn")) {
      const btn = document.createElement("button");
      btn.id = "themeBtn";
      btn.className = "theme-toggle-btn";
      btn.onclick = () => {
        const isDark = document.body.classList.contains("dark-mode");
        setTheme(!isDark);
      };
      langbar.appendChild(btn);
      updateBtnLabel();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();