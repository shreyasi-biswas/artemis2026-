/* goal-popups.js - Blur & Center Detailed Popups for My Goal Tab */
(function () {
  // Inject CSS styles for the My Goal modal overlay and blur effect
  const style = document.createElement("style");
  style.textContent = `
    .goal-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(7, 14, 23, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .goal-modal-backdrop.active {
      display: flex;
    }
    .goal-modal-content {
      background: #0d1b2a;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 32px;
      border-radius: 20px;
      width: 90%;
      max-width: 520px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      position: relative;
      color: #f8fafc;
      animation: goalPopUp 0.25s ease-out;
    }
    @keyframes goalPopUp {
      from { transform: scale(0.92); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .goal-modal-close {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.05);
      border: none;
      color: #94a3b8;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .goal-modal-close:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #f8fafc;
    }
    .goal-modal-details {
      margin-top: 16px;
      font-size: 0.95rem;
      line-height: 1.6;
      color: #94a3b8;
    }
    .goal-modal-highlight {
      margin-top: 16px;
      font-weight: 500;
      color: #93c5fd;
      background: rgba(59, 130, 246, 0.12);
      padding: 14px;
      border-radius: 12px;
      border-left: 4px solid #3b82f6;
      font-size: 0.92rem;
    }
    /* Give user visual feedback that panels are clickable */
    #v-plan .panel {
      cursor: pointer;
      transition: border-color 0.2s ease;
    }
    #v-plan .panel:hover {
      border-color: #3b82f6;
    }
  `;
  document.head.appendChild(style);

  // Create and append the modal DOM element
  const modalHTML = `
    <div id="goalModalBackdrop" class="goal-modal-backdrop">
      <div class="goal-modal-content" onclick="event.stopPropagation()">
        <button id="goalModalClose" class="goal-modal-close">✕</button>
        <h3 id="goalModalTitle" style="font-size: 1.4rem; font-family: 'Playfair Display', serif; margin-bottom: 8px;"></h3>
        <p id="goalModalDesc" class="goal-modal-details"></p>
        <div id="goalModalHighlight" class="goal-modal-highlight"></div>
      </div>
    </div>
  `;
  const div = document.createElement("div");
  div.innerHTML = modalHTML;
  document.body.appendChild(div);

  const backdrop = document.getElementById("goalModalBackdrop");
  const closeBtn = document.getElementById("goalModalClose");
  const titleEl = document.getElementById("goalModalTitle");
  const descEl = document.getElementById("goalModalDesc");
  const highlightEl = document.getElementById("goalModalHighlight");

  function openModal(title, desc, highlight) {
    titleEl.textContent = title;
    descEl.textContent = desc;
    highlightEl.textContent = highlight;
    backdrop.classList.add("active");
  }

  function closeModal() {
    backdrop.classList.remove("active");
  }

  closeBtn.onclick = closeModal;
  backdrop.onclick = closeModal;

  // Detailed content dictionary for My Goal panels
  const goalCardDetails = [
    {
      title: "Target Goal & Growth Timeline",
      desc: "This section tracks your overall journey toward your target (₹10 Lakhs vs ₹1 Crore). It visualizes your projected compounding path over time, showing you exactly how months turn into years.",
      highlight: "Aarav's Take: Seeing the graph curve upward makes a long-term goal feel real and achievable instead of abstract."
    },
    {
      title: "Monthly Contribution & Presets",
      desc: "Here you control how much money leaves your pocket each month. Adjusting the slider or picking Careful, Balanced, or Bold presets instantly recalculates your timeline.",
      highlight: "Aarav's Take: You stay in full control—tweak the slider to find a sweet spot that doesn't pinch your student budget."
    }
  ];

  function initGoalInteractions() {
    const planView = document.getElementById("v-plan");
    if (!planView) return;

    // Attach click events directly to the rectangular panels inside My Goal
    const panels = planView.querySelectorAll(".panel");
    panels.forEach((panel, index) => {
      panel.addEventListener("click", (e) => {
        // Prevent triggering if clicking an inner button or input directly
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
        
        const info = goalCardDetails[index] || goalCardDetails[0];
        openModal(info.title, info.desc, info.highlight);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGoalInteractions);
  } else {
    setTimeout(initGoalInteractions, 100); // Ensures elements are loaded
  }
})();