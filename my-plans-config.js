/* my-plans-config.js - Fully Integrated Plan Manager inside My Goal */
(function () {
  const style = document.createElement("style");
  style.textContent = `
    .myplans-integration-container {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 24px;
      align-items: start;
      margin-top: 30px;
    }
    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .plan-card {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
      transition: all 0.2s ease;
    }
    .plan-card.active-card {
      border: 2px solid var(--green);
      box-shadow: 0 8px 24px rgba(10, 42, 122, 0.12);
    }
    .plan-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .plan-card-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid var(--line);
    }
    .plan-card-actions button {
      flex: 1;
      min-height: 38px;
      font-size: 0.85rem;
      padding: 4px 8px;
    }
    .template-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }
    @media (max-width: 1100px) {
      .myplans-integration-container {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);

  if (!localStorage.getItem("hm_saved_plans")) {
    const defaultPlans = [
      { id: "zaa", name: "zaa", sip: 17000, goal: 1000000, mix: [5, 15, 70, 10], step: false, active: true, tag: "Active Plan", returnRate: "10.4% avg return" },
      { id: "p2", name: "Balanced Student Plan", sip: 2000, goal: 1000000, mix: [15, 25, 50, 10], step: false, active: false, tag: "Recommended", returnRate: "9.0% p.a. · Fixed monthly amount" },
      { id: "p3", name: "Emergency & Safe Fund First", sip: 1500, goal: 1000000, mix: [45, 35, 10, 10], step: false, active: false, tag: "Safe Focus", returnRate: "5.8% p.a. · Fixed monthly amount" },
      { id: "p4", name: "High-Growth Millionaire Sprint", sip: 3000, goal: 10000000, mix: [5, 15, 70, 10], step: true, active: false, tag: "High Growth", returnRate: "10.4% p.a. · 10% yearly step-up ON" },
      { id: "p5", name: "All-Weather Cushion", sip: 2500, goal: 1000000, mix: [25, 30, 30, 15], step: false, active: false, tag: "Conservative", returnRate: "7.7% p.a. · Fixed monthly amount" }
    ];
    localStorage.setItem("hm_saved_plans", JSON.stringify(defaultPlans));
  }

  function getSavedPlans() {
    try {
      return JSON.parse(localStorage.getItem("hm_saved_plans")) || [];
    } catch (e) {
      return [];
    }
  }

  function savePlans(plans) {
    localStorage.setItem("hm_saved_plans", JSON.stringify(plans));
  }

  function injectIntoMyGoalView() {
    const planView = document.getElementById("v-plan");
    if (!planView) return;

    // Remove any standalone My Plans tab from the sidebar navigation
    const myPlansNavLink = document.querySelector('[data-v="myplans"]');
    if (myPlansNavLink) {
      const parentLi = myPlansNavLink.closest("li") || myPlansNavLink;
      parentLi.remove();
    }

    // Remove old injected section if present to avoid duplication
    const existing = document.getElementById("integratedMyPlansContainer");
    if (existing) existing.remove();

    const plans = getSavedPlans();
    const activePlan = plans.find(p => p.active) || plans[0];

    const container = document.createElement("div");
    container.id = "integratedMyPlansContainer";

    container.innerHTML = `
      <div style="margin-top: 40px; border-top: 1px solid var(--line); padding-top: 30px;">
        <div class="heading">
          <h2>Configure & Save Your Plan Configurations</h2>
          <p class="muted">Create, save, and switch between investment configurations with varied mixes.</p>
        </div>

        <div class="myplans-integration-container">
          <!-- Left Column: Configure & Save a Plan -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <section class="panel">
              <div class="between" style="margin-bottom: 16px;">
                <h2>Configuration Settings</h2>
                <span class="dlt" id="activePlanBadgeLabel">Active: ${activePlan ? activePlan.name : 'None'}</span>
              </div>

              <div style="display:grid; gap:16px;">
                <div>
                  <label><strong>1. Name this configuration</strong></label>
                  <div class="row" style="margin-top:6px;">
                    <input type="text" id="planNameInput" value="${activePlan ? activePlan.name : 'My Custom Plan'}" style="flex:1; min-height:46px; padding:0 14px; border:1.5px solid #b6c8ee; border-radius:999px; background:var(--surface); color:var(--ink);">
                    <button class="button primary" id="saveNewPlanBtn">Save as New Plan</button>
                    <button class="button" id="updateActivePlanBtn">Update Active</button>
                  </div>
                </div>

                <div>
                  <label><strong>2. Quick Templates (Emergency / Safe / Growth)</strong></label>
                  <div class="template-chips">
                    <button class="chip" onclick="loadTemplate([50,20,20,10], 1500, 'Emergency Fund Heavy')">Emergency Fund Heavy (50% Safety)</button>
                    <button class="chip" onclick="loadTemplate([40,40,10,10], 2000, 'Safe Fund Focus')">Safe Fund Focus (40% Safe / 40% Emergency)</button>
                    <button class="chip" onclick="loadTemplate([15,25,50,10], 2000, 'Balanced Mix')">Balanced (50% Growth)</button>
                    <button class="chip" onclick="loadTemplate([5,15,70,10], 3000, 'Aggressive Growth')">Aggressive Growth (70% Index)</button>
                  </div>
                </div>

                <div>
                  <label><strong>3. Target Goal</strong></label>
                  <div class="row" style="margin-top:6px;" id="planTargetChips">
                    <button class="chip" data-goal="1000000" ${activePlan && activePlan.goal === 1000000 ? 'aria-pressed="true"' : ''}>₹10 lakh</button>
                    <button class="chip" data-goal="10000000" ${activePlan && activePlan.goal === 10000000 ? 'aria-pressed="true"' : ''}>₹1 crore</button>
                  </div>
                </div>

                <div>
                  <label><strong>4. Monthly Investment: ₹<span id="planSipVal">${activePlan ? activePlan.sip : 2000}</span></strong></label>
                  <input type="range" id="planSipRange" min="500" max="25000" step="500" value="${activePlan ? activePlan.sip : 2000}" style="margin-top:6px;">
                  <p class="muted">You keep ₹<span id="sipKeepVal">${8000 - (activePlan ? activePlan.sip : 2000)}</span> of your ₹8,000.</p>
                </div>

                <div>
                  <label><strong>5. Fund Allocation Mix (Auto-balances to 100%)</strong></label>
                  <div style="display:grid; gap:12px; margin-top:10px;">
                    <div>
                      <div class="between"><label>Safety net (Emergency Fund)</label><strong id="mix0Val">${activePlan ? activePlan.mix[0] : 15}% · ₹<span id="mix0Amt">${Math.round((activePlan ? activePlan.sip : 2000)*(activePlan ? activePlan.mix[0] : 15)/100)}</span>/mo</strong></div>
                      <input type="range" class="mix-slider" data-index="0" min="0" max="100" value="${activePlan ? activePlan.mix[0] : 15}">
                    </div>
                    <div>
                      <div class="between"><label>Steady (Safe Fund: FD/PPF)</label><strong id="mix1Val">${activePlan ? activePlan.mix[1] : 25}% · ₹<span id="mix1Amt">${Math.round((activePlan ? activePlan.sip : 2000)*(activePlan ? activePlan.mix[1] : 25)/100)}</span>/mo</strong></div>
                      <input type="range" class="mix-slider" data-index="1" min="0" max="100" value="${activePlan ? activePlan.mix[1] : 25}">
                    </div>
                    <div>
                      <div class="between"><label>Growth (Nifty 50 Index)</label><strong id="mix2Val">${activePlan ? activePlan.mix[2] : 50}% · ₹<span id="mix2Amt">${Math.round((activePlan ? activePlan.sip : 2000)*(activePlan ? activePlan.mix[2] : 50)/100)}</span>/mo</strong></div>
                      <input type="range" class="mix-slider" data-index="2" min="0" max="100" value="${activePlan ? activePlan.mix[2] : 50}">
                    </div>
                    <div>
                      <div class="between"><label>Gold (Crisis Hedge)</label><strong id="mix3Val">${activePlan ? activePlan.mix[3] : 10}% · ₹<span id="mix3Amt">${Math.round((activePlan ? activePlan.sip : 2000)*(activePlan ? activePlan.mix[3] : 10)/100)}</span>/mo</strong></div>
                      <input type="range" class="mix-slider" data-index="3" min="0" max="100" value="${activePlan ? activePlan.mix[3] : 10}">
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column: Live Outcome Preview -->
          <div>
            <section class="panel" style="position:sticky; top:24px;">
              <div class="between">
                <h2>Live Outcome Preview</h2>
                <span class="dlt" style="background:#eaf1ff; color:#0f2a7a;" id="previewReturnLabel">${activePlan ? activePlan.returnRate : '10.4% avg return'}</span>
              </div>
              <div style="margin:16px 0;">
                <span style="font-family:'Playfair Display',serif; font-size:2.4rem; font-weight:700; color:var(--green);" id="previewYrs">4 yrs</span>
                <p class="muted" id="previewRange" style="font-size:14px; margin-top:4px;">Likely range: 3 yrs 10 mo to 4 yrs 5 mo.<br>You'd be about 23.</p>
              </div>
              <div id="previewChartMini" style="margin:16px 0;"></div>
              <div style="display:grid; gap:10px; margin-top:16px;" id="previewMixSummary"></div>
            </section>
          </div>
        </div>

        <!-- Saved Plan Configurations Section -->
        <section class="panel" style="margin-top: 24px;">
          <div class="between">
            <div>
              <h2>Saved Plan Configurations</h2>
              <p class="muted">Click "Load Plan" on any saved configuration to activate it across the app.</p>
            </div>
            <div class="row">
              <span class="chip" style="pointer-events:none;">${plans.length} Plans</span>
              <button class="button" onclick="restoreDefaultPlans()">Restore Default Plans</button>
            </div>
          </div>

          <div class="plans-grid">
            ${plans.map(p => {
              const calculatedMonths = simulatePlanMonths(p.sip, p.goal, p.mix);
              const yrsText = formatMonths(calculatedMonths);
              return `
                <div class="plan-card ${p.active ? 'active-card' : ''}">
                  <div class="plan-card-header">
                    <strong>${p.name}</strong>${p.active ? '<span class="dlt" style="background:#22a06b; color:#fff;">✓ Active Plan</span>' : `<span class="muted" style="font-size:12px;">${p.tag || ''}</span>`}
                  </div>
                  <div style="display:flex; justify-content:space-between; font-size:14px; margin:8px 0;">
                    <span>Monthly SIP: <b>₹${p.sip.toLocaleString('en-IN')}</b></span>
                    <span>Target Goal: <b>₹${p.goal === 10000000 ? '1 crore' : '10 lakh'}</b></span>
                  </div>
                  <div style="font-size:14px; margin-bottom:8px;">
                    Est. Time: <strong style="color:var(--green);">${yrsText}</strong>
                  </div>
                  <div style="display:flex; height:8px; border-radius:4px; overflow:hidden; gap:2px; margin:8px 0;">
                    <div style="flex:${p.mix[0]}; background:#22a06b;"></div>
                    <div style="flex:${p.mix[1]}; background:#a56bf0;"></div>
                    <div style="flex:${p.mix[2]}; background:#2f4bff;"></div>
                    <div style="flex:${p.mix[3]}; background:#f3bf4e;"></div>
                  </div>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font-size:12px; color:var(--muted);">
                    <span>Safety net: ${p.mix[0]}\% (₹${Math.round(p.sip*p.mix[0]/100)})</span>
                    <span>Steady: ${p.mix[1]}\% (₹${Math.round(p.sip*p.mix[1]/100)})</span>
                    <span>Growth: ${p.mix[2]}\% (₹${Math.round(p.sip*p.mix[2]/100)})</span>
                    <span>Gold: ${p.mix[3]}\% (₹${Math.round(p.sip*p.mix[3]/100)})</span>
                  </div>
                  <p class="muted" style="font-size:12px; margin-top:6px;">${p.returnRate || 'Fixed monthly amount'}</p>
                  
                  <div class="plan-card-actions">
                    ${p.active ? '<button class="button primary" disabled style="opacity:0.7;">Loaded</button>' : `<button class="button primary" onclick="loadSavedPlan('${p.id}')">Load Plan</button>`}
                    <button class="button" onclick="duplicatePlan('${p.id}')">Duplicate</button>
                    <button class="button" onclick="deletePlan('${p.id}')" style="color:var(--fall); border-color:var(--fall);">Delete</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>
      </div>
    `;

    planView.appendChild(container);
    bindMyPlansEvents(activePlan);
    updateLivePreview(activePlan);
  }

  function simulatePlanMonths(sip, goal, mix) {
    const returns = [0.03, 0.07, 0.12, 0.085];
    const avgRate = mix.reduce((acc, weight, i) => acc + (weight * returns[i] / 100), 0);
    const monthlyRate = Math.pow(1 + avgRate, 1/12) - 1;
    let balance = 0, months = 0;
    while (balance < goal && months < 480) {
      balance = (balance + sip) * (1 + monthlyRate);
      months++;
    }
    return months;
  }

  function formatMonths(m) {
    if (m >= 480) return "40+ years";
    const yrs = Math.floor(m / 12);
    const mos = m % 12;
    return mos ? `${yrs} yrs ${mos} mo` : `${yrs} yrs`;
  }

  function updateLivePreview(activePlan) {
    const months = simulatePlanMonths(activePlan.sip, activePlan.goal, activePlan.mix);
    const H = Math.min(30, Math.max(6, Math.ceil(months / 12) + 1));
    const G = activePlan.goal;
    const X = i => 10 + (i / H) * 280;
    const Y = b => 110 - Math.min(b, G) / G * 90;
    
    const pts = [];
    let b = 0;
    const returns = [0.03, 0.07, 0.12, 0.085];
    const avgRate = activePlan.mix.reduce((acc, weight, i) => acc + (weight * returns[i] / 100), 0);
    const monthlyRate = Math.pow(1 + avgRate, 1/12) - 1;

    for (let i = 0; i <= H; i++) {
      pts.push(`${X(i)},${Y(b)}`);
      for (let m = 0; m < 12; m++) b = (b + activePlan.sip) * (1 + monthlyRate);
    }

    const chartEl = document.getElementById("previewChartMini");
    if (chartEl) {
      chartEl.innerHTML = `
        <svg viewBox="0 0 300 120">
          <line x1="10" x2="290" y1="${Y(G)}" y2="${Y(G)}" stroke="#0a1d58" stroke-dasharray="4 4"/>
          <polyline points="${pts.join(' ')}" fill="none" stroke="#0f2a7a" stroke-width="2.5" stroke-linecap="round"/>
          <text x="12" y="116" font-size="10" fill="#50648c">Today</text>
          <text x="288" y="116" font-size="10" text-anchor="end" fill="#50648c">Age ${19 + Math.ceil(months/12)}</text>
        </svg>
      `;
    }

    const summaryEl = document.getElementById("previewMixSummary");
    if (summaryEl) {
      const names = ["Safety net (Emergency Fund)", "Steady (Safe Fund: FD/PPF)", "Growth (Nifty 50 Index)", "Gold (Crisis Hedge)"];
      const dots = ["#22a06b", "#a56bf0", "#2f4bff", "#f3bf4e"];
      summaryEl.innerHTML = activePlan.mix.map((pct, i) => `
        <div class="drow" style="padding:6px 0; border-top:1px solid var(--line); display:grid; grid-template-columns:12px 1fr auto; gap:10px; align-items:center;">
          <span class="dot" style="background:${dots[i]}"></span>
          <span><b>${names[i]}</b></span>
          <strong>${pct}% · ₹${Math.round(activePlan.sip * pct / 100)}/mo</strong>
        </div>
      `).join('');
    }

    const yrsElem = document.getElementById("previewYrs");
    if (yrsElem) yrsElem.textContent = formatMonths(months);

    const retLbl = document.getElementById("previewReturnLabel");
    if (retLbl) retLbl.textContent = `${(avgRate * 100).toFixed(1)}% avg return`;
  }

  window.loadTemplate = function(mixArr, sipVal, name) {
    const plans = getSavedPlans();
    const active = plans.find(p => p.active) || plans[0];
    active.mix = [...mixArr];
    active.sip = sipVal;
    active.name = name;
    savePlans(plans);
    injectIntoMyGoalView();
  };

  window.loadSavedPlan = function(id) {
    const plans = getSavedPlans();
    plans.forEach(p => p.active = (p.id === id));
    savePlans(plans);
    const active = plans.find(p => p.active);
    if (active && window.S) {
      window.S.P = active.sip;
      window.S.goal = active.goal;
      window.S.w = [...active.mix];
      if (typeof window.render === 'function') window.render(true);
    }
    injectIntoMyGoalView();
  };

  window.duplicatePlan = function(id) {
    const plans = getSavedPlans();
    const target = plans.find(p => p.id === id);
    if (target) {
      const newPlan = { ...target, id: 'p_' + Date.now(), name: target.name + ' (Copy)', active: false };
      plans.push(newPlan);
      savePlans(plans);
      injectIntoMyGoalView();
    }
  };

  window.deletePlan = function(id) {
    let plans = getSavedPlans();
    if (plans.length <= 1) {
      alert("You must keep at least one plan configuration.");
      return;
    }
    plans = plans.filter(p => p.id !== id);
    if (!plans.some(p => p.active)) plans[0].active = true;
    savePlans(plans);
    injectIntoMyGoalView();
  };

  window.restoreDefaultPlans = function() {
    localStorage.removeItem("hm_saved_plans");
    location.reload();
  };

  function bindMyPlansEvents(activePlan) {
    const nameInput = document.getElementById("planNameInput");
    if (nameInput) {
      nameInput.oninput = (e) => {
        activePlan.name = e.target.value;
        const badge = document.getElementById("activePlanBadgeLabel");
        if (badge) badge.textContent = `Active: ${activePlan.name}`;
      };
      nameInput.onchange = () => {
        const plans = getSavedPlans();
        const active = plans.find(p => p.active);
        if (active) {
          active.name = activePlan.name;
          savePlans(plans);
        }
      };
    }

    const saveBtn = document.getElementById("saveNewPlanBtn");
    if (saveBtn) {
      saveBtn.onclick = () => {
        const plans = getSavedPlans();
        plans.forEach(p => p.active = false);
        const newPlan = {
          id: 'p_' + Date.now(),
          name: nameInput ? nameInput.value : 'Custom Plan',
          sip: activePlan.sip,
          goal: activePlan.goal,
          mix: [...activePlan.mix],
          step: activePlan.step,
          active: true,
          tag: 'User Saved',
          returnRate: 'Custom mix return'
        };
        plans.push(newPlan);
        savePlans(plans);
        injectIntoMyGoalView();
      };
    }

    const updateBtn = document.getElementById("updateActivePlanBtn");
    if (updateBtn) {
      updateBtn.onclick = () => {
        const plans = getSavedPlans();
        const active = plans.find(p => p.active);
        if (active) {
          active.name = nameInput ? nameInput.value : active.name;
          active.sip = activePlan.sip;
          active.goal = activePlan.goal;
          active.mix = [...activePlan.mix];
          savePlans(plans);
          alert("Active plan updated successfully!");
          injectIntoMyGoalView();
        }
      };
    }

    const targetChips = document.getElementById("planTargetChips");
    if (targetChips) {
      targetChips.onclick = (e) => {
        const btn = e.target.closest("[data-goal]");
        if (btn) {
          const plans = getSavedPlans();
          const active = plans.find(p => p.active);
          if (active) {
            active.goal = +btn.dataset.goal;
            savePlans(plans);
            injectIntoMyGoalView();
          }
        }
      };
    }

    const sipRange = document.getElementById("planSipRange");
    if (sipRange) {
      sipRange.oninput = (e) => {
        activePlan.sip = +e.target.value;
        document.getElementById("planSipVal").textContent = activePlan.sip;
        document.getElementById("sipKeepVal").textContent = Math.max(0, 8000 - activePlan.sip);
        activePlan.mix.forEach((pct, i) => {
          const amtElem = document.getElementById(`mix${i}Amt`);
          if (amtElem) amtElem.textContent = Math.round(activePlan.sip * pct / 100);
        });
      };
      sipRange.onchange = () => {
        const plans = getSavedPlans();
        const active = plans.find(p => p.active);
        if (active) {
          active.sip = activePlan.sip;
          savePlans(plans);
          updateLivePreview(activePlan);
        }
      };
    }

    document.querySelectorAll(".mix-slider").forEach(slider => {
      slider.oninput = (e) => {
        const idx = +e.target.dataset.index;
        const val = +e.target.value;
        activePlan.mix[idx] = val;

        const rest = 100 - val;
        const otherIndices = [0, 1, 2, 3].filter(i => i !== idx);
        const otherSum = otherIndices.reduce((acc, i) => acc + activePlan.mix[i], 0);

        if (otherSum > 0) {
          otherIndices.forEach(i => {
            activePlan.mix[i] = Math.round(activePlan.mix[i] * rest / otherSum);
          });
        } else {
          otherIndices.forEach(i => activePlan.mix[i] = Math.round(rest / 3));
        }

        const total = activePlan.mix.reduce((a, b) => a + b, 0);
        if (total !== 100) {
          activePlan.mix[otherIndices[0]] += (100 - total);
        }

        activePlan.mix.forEach((pct, i) => {
          const valEl = document.getElementById(`mix${i}Val`);
          const amtEl = document.getElementById(`mix${i}Amt`);
          const rangeEl = document.querySelector(`.mix-slider[data-index="${i}"]`);
          if (rangeEl && rangeEl !== e.target) rangeEl.value = pct;
          const monthlyAmt = Math.round(activePlan.sip * pct / 100);
          if (valEl) valEl.textContent = `${pct}% · ₹${monthlyAmt}/mo`;
          if (amtEl) amtEl.textContent = monthlyAmt;
        });

        updateLivePreview(activePlan);
      };

      slider.onchange = () => {
        const plans = getSavedPlans();
        const active = plans.find(p => p.active);
        if (active) {
          active.mix = [...activePlan.mix];
          savePlans(plans);
        }
      };
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectIntoMyGoalView);
  } else {
    setTimeout(injectIntoMyGoalView, 100);
  }
})();