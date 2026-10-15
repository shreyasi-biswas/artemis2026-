/* chatbot.js - guided AI assistant for The Honest Million.
   No training: the bot offers 4 options at every step (or the user can type a
   keyword), and answers use live numbers from the app. Edit the tree T to add Q&As. */
(function () {
  const root = document.getElementById("v-bot");
  if (!root) return;
  const safe = (f, d) => { try { return f(); } catch (e) { return d; } };
  const go = v => safe(() => show(v));
  const sync = () => safe(() => { render(true); commit(); });
  const last = () => safe(() => series().pop(), null);
  const hr = new Date().getHours(), hi = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
  const PG = { home: ["home", "Open Home"], goal: ["plan", "Open My Goal"], inv: ["invest", "Open Investments"], sim: ["rehearse", "Open the Simulator"], opt: ["options", "Open Explore Options"] };
  const mix = (i, name) => ["Apply the " + name + " mix", () => { S.w = PRE[i].slice(); sync(); go("plan"); }];

  /* ---------- the conversation: edit or add questions here ---------- */
  const T = {
    main: { q: hi + ", Aarav! I'm your guide. I can't give investment advice, but I can show you exactly where everything is. What do you need?",
      o: [["💰 My money", "money"], ["🧭 Take me to a page", "pages"], ["📉 Market falls and risk", "risk"], ["📘 Learn the basics", "learn"]] },
    money: { q: "What do you want to know about your money?", o: [["What's my balance?", "bal"], ["How much profit have I made?", "pro"], ["Which companies made me profit?", "co"], ["More about my money ›", "money2"]] },
    money2: { q: "More about your money:", o: [["How much should I invest monthly?", "amt"], ["How far am I from my goal?", "prog"], ["Best and worst month?", "bw"], ["Help me pick a mix", "quiz"]] },
    pages: { q: "Where do you want to go?", o: [["Home (dashboard)", "hm"], ["My Goal", "g1"], ["Investments", "g2"], ["More pages ›", "pages2"]] },
    pages2: { q: "More pages:", o: [["Bad-Year Simulator", "g3"], ["Explore Options", "g4"], ["Show me every page", "tour"], ["Change the language", "lang"]] },
    risk: { q: "What's on your mind?", o: [["What if the market crashes?", "r1"], ["Should I sell when it falls?", "r2"], ["How risky is each option?", "r3"], ["How long to reach my goal?", "r4"]] },
    learn: { q: "What should I explain?", o: [["What is an index fund?", "l1"], ["What is a SIP?", "l2"], ["What is inflation?", "l3"], ["More basics ›", "learn2"]] },
    learn2: { q: "More basics:", o: [["What is a bear market?", "l5"], ["What is diversification?", "l6"], ["What does lock-in mean?", "l7"], ["What is an emergency fund?", "l8"]] },
    quiz: { q: "If your ₹10,000 turned into ₹7,000 in one bad month, what would you do?", o: [["Sell everything", "qa"], ["Worry, but wait", "qb"], ["Buy more", "qc"], ["Check it every day", "qa"]] },

    bal: { a: () => { const l = last(); return `Your portfolio is worth <b>${l ? inr(l.v) : "..."}</b> right now. The Investments page shows it with your profit and a month-by-month graph.`; }, go: PG.inv },
    pro: { a: () => { const l = last(); return l ? `So far you have made <b>${l.p < 0 ? "-" : ""}${inr(Math.abs(l.p))}</b> (${(l.p / l.inv * 100).toFixed(1)}% on what you put in). The Investments graph shows which months were profit and which were loss.` : "Your profit is on the Investments page."; }, go: PG.inv },
    co: { a: () => { const l = last(), c = safe(() => CO[0]); return l && c ? `Your biggest earner is <b>${c[0]}</b>, about ${inr(Math.max(l.p, 0) * c[3])}. The Investments page lists every top gainer and shows a pie chart of profit by company.` : "See the top gainers on the Investments page."; }, go: PG.inv },
    amt: { a: () => `You set aside <b>${inr(S.P)}</b> a month and keep ${inr(8000 - S.P)} of your ₹8,000. At this pace your goal takes about <b>${safe(() => ym(calc().m), "...")}</b>. Try changing it:`, go: PG.goal,
      acts: [["− ₹500", () => { S.P = Math.max(500, S.P - 500); sync(); }, 1], ["+ ₹500", () => { S.P = Math.min(4000, S.P + 500); sync(); }, 1]] },
    prog: { a: () => { const l = last(); return l ? `Your portfolio is <b>${inr(l.v)}</b>, which is ${(l.v / S.goal * 100).toFixed(1)}% of your ${gName()} goal. Home shows the whole journey line.` : "Home shows your progress."; }, go: PG.home },
    bw: { a: () => { const a = series();let b = 1, w = 1;for (let i = 1; i < a.length; i++) { const d = a[i].p - a[i - 1].p; if (d > a[b].p - a[b - 1].p) b = i; if (d < a[w].p - a[w - 1].p) w = i; }
      return `Your best month was <b>${a[b].d}</b> (+${inr(a[b].p - a[b - 1].p)}). Your worst was <b>${a[w].d}</b> (${inr(a[w].p - a[w - 1].p).replace("₹", "-₹")}). Hover the graph on Investments to see every month.`; }, go: PG.inv },
    qa: { a: () => "You'd probably sleep better with a <b>Careful</b> mix: mostly Safety net and Steady, a little Growth. Smaller drops, slower growth.", go: PG.sim, acts: [mix(0, "Careful")] },
    qb: { a: () => "A <b>Balanced</b> mix fits that feeling. Growth does the heavy lifting, and the rest cushions the falls.", go: PG.sim, acts: [mix(1, "Balanced")] },
    qc: { a: () => "A <b>Bold</b> mix matches that. Be honest with yourself: it can fall 40% or more in a bad year, so try the simulator first.", go: PG.sim, acts: [mix(2, "Bold")] },

    hm: { a: () => "Home is your dashboard: your goal, how many years it will take, your plan and your milestones.", go: PG.home },
    g1: { a: () => "My Goal is where you pick ₹10 lakh or ₹1 crore, set your monthly amount and mix your money.", go: PG.goal },
    g2: { a: () => "Investments shows your portfolio, profit, top gainers, a profit-by-company pie chart and how your money is split.", go: PG.inv },
    g3: { a: () => "The Bad-Year Simulator shows what you would lose if you sell in a crash compared with waiting.", go: PG.sim },
    g4: { a: () => "Explore Options explains five choices in plain words, with the worst year, lock-in and cost of each.", go: PG.opt },
    tour: { a: () => "Here is every page. Tap one to jump straight there.", gos: [PG.home, PG.goal, PG.inv, PG.sim, PG.opt] },
    lang: { a: () => "Tap the 🌐 button at the top left of any page to switch between English and Hindi, or do it right now:", acts: [["Switch language now", () => safe(() => document.getElementById("langBtn").click())]] },

    r1: { a: () => "Falls are a normal part of investing. In a typical 20 years, about 1 in 4 is a down year. The simulator lets you feel one before it happens.", go: PG.sim,
      acts: [["Crash me by 30% now", () => { S.crash = .3; S.rec = 24; safe(() => { simRender(); save(); }); go("rehearse"); }]] },
    r2: { a: () => "Selling in a fall turns a paper loss into a real one. Waiting can bring it back, but recovery is never guaranteed and takes a different time each fall. I can't tell you what to do, but the simulator shows both paths with numbers.", go: PG.sim },
    r3: { a: () => "Safety net never loses. Steady has tiny dips. Gold can fall about 15%. Growth (index funds) can fall 30% or more in a bad year. Every option has a card with its worst year.", go: PG.opt },
    r4: { a: () => { const c = safe(calc); return c ? `With your plan it takes about <b>${ym(c.m)}</b>, likely between ${ym(c.mHi)} and ${ym(c.mLo)}. Try a different monthly amount:` : "Your time to goal is on My Goal."; }, go: PG.goal,
      acts: [["Try ₹1,000", () => { S.P = 1000; sync(); }, 1], ["Try ₹3,000", () => { S.P = 3000; sync(); }, 1]] },

    l1: { a: () => "An index fund owns a small slice of many big companies at once, such as India's top 50. You are not betting on one company, but it can still fall in a bad year.", go: PG.opt },
    l2: { a: () => "A SIP means investing a fixed amount every month, whatever the market does. When prices fall, the same rupees buy more units.", go: PG.goal },
    l3: { a: () => "Inflation means prices rise over time, so ₹10 lakh later buys less than today. On Home, tap \"Count it in today's money\" to see the honest version.", go: PG.home },
    l5: { a: () => "A bear market is when prices fall 20% or more from a recent high and stay down for a while. The simulator shows how that hits your money.", go: PG.sim },
    l6: { a: () => "Diversification means spreading money across different things so one bad one doesn't sink you. Your plan mixes Safety net, Steady, Growth and Gold for this reason.", go: PG.goal },
    l7: { a: () => "Lock-in is a period when you can't take your money out, or you pay a penalty. PPF, for example, locks for 15 years. Each option's lock-in is on Explore Options.", go: PG.opt },
    l8: { a: () => "An emergency fund is a small cash cushion, ideally one to two months of spending, so you never have to sell investments in a panic. That's your Safety net.", go: PG.goal }
  };

  /* typed questions are matched by keyword (first match wins) */
  const KW = [[/language|hindi|translate/, "lang"], [/balance|worth|portfolio|how much do i have/, "bal"], [/compan|stock|gainer/, "co"], [/best month|worst month/, "bw"], [/profit|earn|gain/, "pro"],
    [/inflation/, "l3"], [/index fund/, "l1"], [/\bsip\b/, "l2"], [/diversif/, "l6"], [/lock/, "l7"], [/emergency/, "l8"], [/bear market/, "l5"], [/sell/, "r2"], [/crash|fall|simulat/, "r1"], [/risk/, "r3"],
    [/how long|years|time to/, "r4"], [/progress|how far/, "prog"], [/monthly|per month|each month|amount/, "amt"], [/mix|quiz|suggest/, "quiz"], [/home|dashboard/, "hm"], [/my goal|plan/, "g1"],
    [/option|compare/, "g4"], [/invest/, "g2"], [/page|tour|where|navigate|menu|help/, "tour"], [/^(hi|hello|hey)\b/, "main"]];

  /* ---------- chat engine ---------- */
  const msgs = []; let cur = "main", parent = "main", busy = false;
  const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
  root.innerHTML = `<div class="heading"><h1 data-i>AI Assistant</h1><p>Tap an option or type a question. I'll take you to the right page.</p></div>
  <div class="botgrid"><section class="panel chat"><div class="msgs" id="botMsgs" aria-live="polite"></div><div class="opts" id="botOpts"></div>
  <form class="ask" id="botForm"><input id="botIn" type="text" autocomplete="off" aria-label="Type a question" placeholder="Or type a question, like: show my profit"><button class="button primary" type="submit">Send</button></form></section>
  <aside class="panel side"><h2>Jump to a page</h2><div class="jumps" id="jumps"></div><h2>Popular questions</h2><div class="jumps" id="pops"></div></aside></div>`;
  const box = root.querySelector("#botMsgs"), opts = root.querySelector("#botOpts"), inp = root.querySelector("#botIn");
  const css = document.createElement("style");
  css.textContent = `#v-bot:not([hidden]){display:flex;flex-direction:column;height:calc(100vh - 150px);min-height:540px}#v-bot .heading{margin-bottom:14px}
  .botgrid{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:20px;margin-bottom:0!important}
  .chat{display:flex;flex-direction:column;gap:14px;min-height:0}.msgs{flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:4px}
  .b{max-width:82%;padding:12px 16px;border-radius:16px;font-size:17px;line-height:1.5;animation:bin .25s ease;transition:transform .2s ease,box-shadow .2s ease}
  .b.bot{background:#eaf1ff;color:#0a1633;border-bottom-left-radius:4px;align-self:flex-start}.b.you{background:#0f2a7a;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}
  .dots i{display:inline-block;width:8px;height:8px;margin:0 3px;border-radius:50%;background:#0f2a7a;animation:bounce 1s infinite}.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}
  @keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}@keyframes bin{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}
  .opts{display:flex;flex-wrap:wrap;gap:10px}.opts .chip{text-align:left}
  .ask{display:flex;gap:10px}.ask input{flex:1;min-height:48px;padding:0 16px;border:1.5px solid #b6c8ee;border-radius:999px;background:#fff;color:#0a1633;font:inherit}
  .side{display:flex;flex-direction:column;gap:12px;overflow-y:auto;min-height:0}.side h2{font-size:18px}.jumps{display:grid;gap:10px}.jumps .chip{text-align:left;width:100%}
  @media (hover:hover){.b:hover{transform:translateY(-2px);box-shadow:0 8px 18px rgba(10,29,88,.18)}}
  @media (max-width:1020px){#v-bot:not([hidden]){height:auto}.botgrid{grid-template-columns:1fr}.chat{height:72vh}}
  @media (max-width:700px){.b{max-width:94%}}@media (prefers-reduced-motion:reduce){.b,.dots i{animation:none}}`;
  document.head.appendChild(css);

  function draw(btns) {
    box.innerHTML = msgs.map(m => `<div class="b ${m.who}">${m.html}</div>`).join("");
    box.scrollTop = box.scrollHeight; requestAnimationFrame(() => { box.scrollTop = box.scrollHeight; }); opts.innerHTML = "";
    btns.forEach(b => { const e = document.createElement("button"); e.className = b.primary ? "button primary" : "chip"; e.textContent = b.t; e.onclick = () => { if (!busy) b.f(); }; opts.appendChild(e); });
  }
  function reply(fn) {
    busy = true; msgs.push({ who: "bot", html: '<span class="dots"><i></i><i></i><i></i></span>' }); draw([]);
    setTimeout(() => { msgs.pop(); busy = false; fn(); }, calm ? 0 : 500);
  }
  const home = () => ({ t: "🏠 Main menu", f: () => { msgs.push({ who: "you", html: "Main menu" }); menu("main"); } });
  function menu(k, q) {
    cur = k; const n = T[k];
    reply(() => { msgs.push({ who: "bot", html: q || n.q }); draw(n.o.map(o => ({ t: o[0], f: () => pick(o) })).concat(k === "main" ? [] : [home()])); });
  }
  function leaf(k) {
    const n = T[k]; parent = cur;
    reply(() => {
      msgs.push({ who: "bot", html: n.a() });
      const b = [];
      (n.gos || [n.go]).filter(Boolean).forEach(g => b.push({ t: g[1] + " →", primary: true, f: () => go(g[0]) }));
      (n.acts || []).forEach(a => b.push({ t: a[0], f: () => { a[1](); if (a[2]) { msgs[msgs.length - 1].html = n.a(); draw(b); } } }));
      b.push({ t: "⬅ Back", f: () => { msgs.push({ who: "you", html: "Back" }); menu(parent); } }, home());
      draw(b);
    });
  }
  function pick(o) { msgs.push({ who: "you", html: o[0] }); T[o[1]].o ? menu(o[1]) : leaf(o[1]); }
  function ask(t) {
    t = t.trim(); if (!t || busy) return;
    msgs.push({ who: "you", html: t.replace(/</g, "&lt;") });
    const m = KW.find(x => x[0].test(t.toLowerCase()));
    if (!m) return menu("main", "I didn't catch that one, but here's what I can help with:");
    T[m[1]].o ? menu(m[1]) : leaf(m[1]);
  }
  root.querySelector("#botForm").onsubmit = e => { e.preventDefault(); const v = inp.value; inp.value = ""; ask(v); };
  [["⌂ Home", "home"], ["◎ My Goal", "plan"], ["₹ Investments", "invest"], ["☂ Bad-Year Simulator", "rehearse"], ["◉ Explore Options", "options"]].forEach(p => {
    const e = document.createElement("button"); e.className = "chip"; e.textContent = p[0]; e.onclick = () => go(p[1]); root.querySelector("#jumps").appendChild(e); });
  [["What's my balance?", "bal"], ["Which companies made me profit?", "co"], ["Crash me by 30%", "r1"], ["Help me pick a mix", "quiz"]].forEach(p => {
    const e = document.createElement("button"); e.className = "chip"; e.textContent = p[0]; e.onclick = () => { if (!busy) pick(p); }; root.querySelector("#pops").appendChild(e); });

  safe(() => { HI["AI Assistant"] = "एआई सहायक"; if (typeof applyLang === "function") applyLang(); });
  menu("main");
})();