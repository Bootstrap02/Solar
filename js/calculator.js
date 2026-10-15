/* Solar calculator: pure engine (SG.calcEngine) + wizard UI (SG.calcUI). Estimates only, not engineering design. */
(function () {
  const SG = window.SG = window.SG || {};
  const USAGE = [
    ['lighting', 'Essential lighting and entertainment'], ['essential', 'Essential home appliances'], ['full', 'Full residential backup'],
    ['office', 'Small office'], ['shop', 'Shop or commercial premises'], ['custom', 'Custom use']];

  /* ---------- engine ---------- */
  function pick(products, pred) { return products.find(pred) || null; }
  SG.calcEngine = {
    USAGE,
    compute(state, products) {
      const c = SG.config.calc;
      const items = state.items.filter(i => i.qty > 0);
      if (!items.length) return { error: 'Select at least one appliance to get an estimate.' };
      for (const i of items) {
        if (!(i.watts > 0) || !(i.qty > 0) || i.hours < 0 || i.hours > 24 || isNaN(i.hours)) return { error: `Check the wattage and daily hours for "${i.name}".` };
      }
      const backupHours = Number(state.backupHours);
      if (!(backupHours > 0) || backupHours > 48) return { error: 'Choose a backup duration between 1 and 48 hours.' };
      const sim = c.simultaneity[state.usage] ?? c.simultaneity.custom;
      const connectedW = items.reduce((s, i) => s + i.watts * i.qty, 0);
      const largestUnit = Math.max(...items.map(i => i.watts));
      const simW = Math.max(connectedW * sim, largestUnit);
      const dailyKwh = items.reduce((s, i) => s + i.watts * i.qty * i.hours / 1000, 0);
      const backupKwh = items.reduce((s, i) => s + i.watts * i.qty * Math.min(i.hours, backupHours) / 1000, 0);
      const batteryNeededKwh = backupKwh / (c.inverterEfficiency * c.batteryUsableFraction * c.batteryDischargeEff);
      const units = Math.max(1, Math.ceil(batteryNeededKwh / 5));
      const batteryKwh = units * 5;
      const arrayNeededKwp = (dailyKwh / c.inverterEfficiency) / (c.peakSunHours * c.performanceRatio);
      const panels = Math.max(1, Math.ceil(arrayNeededKwp * 1000 / c.panelWatts));
      const arrayKwp = panels * c.panelWatts / 1000;
      const kvaNeeded = simW * c.inverterMargin / c.powerFactor / 1000;
      const kva = c.inverterSizesKva.find(k => k >= kvaNeeded) || null;
      const res = {
        items, usage: state.usage, backupHours, sim, connectedW, simW, largestUnit, dailyKwh, backupKwh, batteryNeededKwh, units, batteryKwh,
        arrayNeededKwp, arrayKwp, panels, panelW: c.panelWatts, kvaNeeded, kva,
        inverterLabel: kva ? kva + 'kVA' : 'a three-phase or multi-inverter system',
        hasMotor: items.some(i => i.motor), lines: [], total: 0, priced: false
      };
      // sample equipment package priced from the current catalogue
      const panel = pick(products, p => p.category === 'panels' && p.rating === c.panelWatts);
      const inv = kva && pick(products, p => p.category === 'inverters' && p.rating === kva);
      const bat = pick(products, p => p.category === 'lithium' && p.rating === 5);
      const mount = pick(products, p => p.id === 'p-mount-4');
      const dc = pick(products, p => p.id === 'p-prot-dc'), ac = pick(products, p => p.id === 'p-prot-ac');
      const add = (p, qty) => { if (p) res.lines.push({ id: p.id, name: p.name, qty, unit: p.price, quote: p.pricingMode === 'quote-only' || !p.price }); };
      add(panel, panels); add(inv, 1); add(bat, units); add(mount, Math.ceil(panels / 4)); add(dc, 1); add(ac, 1);
      res.priced = !!(panel && inv && bat) && res.lines.every(l => !l.quote);
      res.total = res.lines.reduce((s, l) => s + (l.quote ? 0 : l.unit * l.qty), 0);
      return res;
    }
  };

  /* ---------- UI ---------- */
  let root, state, result = null;
  const PRESETS = {
    flat: { name: 'Small flat', q: { led: 6, fan: 2, tv: 1, laptop: 1, fridge: 1 } },
    home: { name: '3-bedroom home', q: { led: 10, ceil: 3, fan: 2, tv: 2, laptop: 2, fridge: 1, freezer: 1, pump: 1, wash: 1 } },
    shop: { name: 'Small shop', q: { led: 8, fan: 2, freezer: 2, laptop: 1, desktop: 1, tv: 1 } }
  };
  function fresh() {
    return { step: 1, backupHours: 5, customBackup: '', usage: 'essential',
      items: SG.seed.appliances.map(a => ({ ...a, qty: 0, custom: false })) };
  }
  function load() {
    const s = fresh(), saved = SG.store.getObj('calc', null);
    if (!saved || !Array.isArray(saved.items)) return s;
    saved.items.forEach(x => {
      const base = s.items.find(i => i.id === x.id);
      if (base) { base.qty = clampN(x.qty, 0, 50); base.watts = clampN(x.watts, 1, 20000) || base.watts; base.hours = clampN(x.hours, 0, 24); }
      else if (x.custom && typeof x.name === 'string') s.items.push({ id: String(x.id), name: x.name.slice(0, 40), icon: '🔌', watts: clampN(x.watts, 1, 20000) || 100, hours: clampN(x.hours, 0, 24), qty: clampN(x.qty, 0, 50) || 1, custom: true });
    });
    s.backupHours = Number(saved.backupHours) > 0 ? Number(saved.backupHours) : 5; s.customBackup = saved.customBackup || '';
    s.usage = USAGE.some(u => u[0] === saved.usage) ? saved.usage : 'essential'; s.step = 1;
    return s;
  }
  function clampN(v, lo, hi) { v = Number(v); if (isNaN(v)) return lo; return Math.min(hi, Math.max(lo, v)); }
  function persist() { SG.store.setObj('calc', { items: state.items.map(i => ({ id: i.id, name: i.name, qty: i.qty, watts: i.watts, hours: i.hours, custom: i.custom })), backupHours: state.backupHours, customBackup: state.customBackup, usage: state.usage }); }

  function totals() {
    const sel = state.items.filter(i => i.qty > 0);
    return { n: sel.length, w: sel.reduce((s, i) => s + i.watts * i.qty, 0), kwh: sel.reduce((s, i) => s + i.watts * i.qty * i.hours / 1000, 0) };
  }
  function updateSummary() {
    const t = totals(), el = root.querySelector('.calc-live'); if (!el) return;
    el.innerHTML = `<div><b>${t.n}</b><span>appliance types</span></div><div><b>${SG.num(t.w / 1000, 2)} kW</b><span>connected load</span></div><div><b>${SG.num(t.kwh, 1)} kWh</b><span>energy per day</span></div>`;
  }
  const stepper = ['Appliances', 'Backup and use', 'Your estimate'];
  function head() {
    return `<ol class="steps" aria-label="Calculator steps">${stepper.map((s, i) => `<li class="${state.step === i + 1 ? 'on' : state.step > i + 1 ? 'done' : ''}">${i + 1}. ${s}</li>`).join('')}</ol>`;
  }
  function renderStep1() {
    return `${head()}
    <div class="calc-top"><p class="muted">Tap + on the appliances you own. Wattages are typical assumptions: check your appliance label for the real figure and edit it.</p>
    <div class="chips" role="group" aria-label="Quick start"><span class="muted small">Quick start:</span>${Object.entries(PRESETS).map(([k, p]) => `<button type="button" class="chip" data-act="preset" data-k="${k}">${SG.esc(p.name)}</button>`).join('')}<button type="button" class="chip" data-act="clear">Clear all</button></div></div>
    <div class="appl-grid">${state.items.map(card).join('')}</div>
    <form class="custom-add" data-act="custom-form" novalidate><h3>Add another appliance</h3>
      <div class="grid-4"><label>Name<input name="name" maxlength="40" required placeholder="e.g. Blender"></label><label>Watts<input name="watts" type="number" min="1" max="20000" required placeholder="300"></label><label>Quantity<input name="qty" type="number" min="1" max="50" value="1"></label><label>Hours per day<input name="hours" type="number" min="0" max="24" step="0.5" value="2"></label></div>
      <p class="err" role="alert" hidden></p><button class="btn ghost" type="submit">Add appliance</button></form>
    <div class="calc-bar"><div class="calc-live" aria-live="polite"></div><button class="btn primary" type="button" data-act="next">Next: backup and use</button></div>`;
  }
  function card(i) {
    const on = i.qty > 0;
    return `<div class="appl ${on ? 'on' : ''}" data-id="${SG.esc(i.id)}">
      <div class="appl-top"><span class="appl-ic" aria-hidden="true">${i.icon}</span><div><b>${SG.esc(i.name)}</b><span class="muted small">${i.watts} W each${i.motor ? ' · motor load' : ''}</span></div>
      ${i.custom ? `<button type="button" class="icon-btn" data-act="del" aria-label="Remove ${SG.esc(i.name)}">&times;</button>` : ''}</div>
      <div class="qty" role="group" aria-label="Quantity of ${SG.esc(i.name)}"><button type="button" data-act="dec" aria-label="Decrease quantity">&minus;</button><output>${i.qty}</output><button type="button" data-act="inc" aria-label="Increase quantity">+</button></div>
      ${on ? `<div class="appl-edit"><label>Watts<input type="number" inputmode="decimal" min="1" max="20000" value="${i.watts}" data-f="watts"></label><label>Hours/day<input type="number" inputmode="decimal" min="0" max="24" step="0.5" value="${i.hours}" data-f="hours"></label></div>` : ''}</div>`;
  }
  function renderStep2() {
    const presets = [3, 5, 8, 12];
    const isCustom = !presets.includes(Number(state.backupHours));
    return `${head()}
    <div class="two-col"><section><h3>How many hours of battery backup do you want?</h3><p class="muted">This is how long the battery should run your appliances when there is no grid and no sun.</p>
      <div class="chips big" role="radiogroup" aria-label="Backup hours">${presets.map(h => `<button type="button" role="radio" aria-checked="${Number(state.backupHours) === h}" class="chip ${Number(state.backupHours) === h ? 'on' : ''}" data-act="backup" data-h="${h}">${h} hours</button>`).join('')}<button type="button" role="radio" aria-checked="${isCustom}" class="chip ${isCustom ? 'on' : ''}" data-act="backup-custom">Custom</button></div>
      ${isCustom ? `<label class="inline">Custom hours<input type="number" min="1" max="48" step="0.5" value="${SG.esc(state.customBackup || state.backupHours)}" data-act="custom-hours"></label>` : ''}</section>
    <section><h3>What will the system power?</h3><p class="muted">This changes how many appliances we assume run at the same time. Your appliance list is never overridden.</p>
      <div class="radio-list" role="radiogroup" aria-label="Intended use">${USAGE.map(u => `<label class="radio ${state.usage === u[0] ? 'on' : ''}"><input type="radio" name="usage" value="${u[0]}" ${state.usage === u[0] ? 'checked' : ''} data-act="usage">${u[1]}</label>`).join('')}</div></section></div>
    <p class="err" role="alert" hidden></p>
    <div class="calc-bar"><button class="btn ghost" type="button" data-act="back">Back</button><button class="btn primary" type="button" data-act="calc">Show my estimate</button></div>`;
  }
  function bar(pct, label, val) { return `<div class="hbar"><span>${SG.esc(label)}</span><i style="--w:${Math.max(3, pct)}%"></i><em>${val}</em></div>`; }
  function renderStep3() {
    const r = result;
    if (!r || r.error) return `${head()}<p class="err">${SG.esc(r ? r.error : 'No result yet.')}</p><button class="btn ghost" data-act="back1" type="button">Adjust my appliance selection</button>`;
    const c = SG.config.calc, max = Math.max(...r.items.map(i => i.watts * i.qty * i.hours));
    const rows = r.items.slice().sort((a, b) => b.watts * b.qty * b.hours - a.watts * a.qty * a.hours).map(i => bar((i.watts * i.qty * i.hours) / (max || 1) * 100, `${i.qty} x ${i.name}`, SG.num(i.watts * i.qty * i.hours / 1000, 2) + ' kWh')).join('');
    return `${head()}
    <h3 class="res-title">Your estimated solar solution</h3>
    <div class="res-grid">
      <div class="res"><span>Connected load</span><b>${SG.num(r.connectedW / 1000, 2)} kW</b><small>${Math.round(r.connectedW)} W if everything ran together</small></div>
      <div class="res"><span>Estimated simultaneous load</span><b>${SG.num(r.simW / 1000, 2)} kW</b><small>assumes ${Math.round(r.sim * 100)}% runs together</small></div>
      <div class="res"><span>Energy per day</span><b>${SG.num(r.dailyKwh, 1)} kWh</b><small>${SG.num(r.backupKwh, 1)} kWh during ${r.backupHours}h backup</small></div>
      <div class="res key"><span>Suggested inverter</span><b>${r.kva ? '~' + r.kva + ' kVA' : 'Needs survey'}</b><small>${r.kva ? SG.num(r.kva * c.powerFactor, 1) + ' kW at ' + c.powerFactor + ' power factor' : 'Above single-phase range: a three-phase or parallel design is needed'}</small></div>
      <div class="res key"><span>Suggested battery</span><b>~${r.batteryKwh} kWh</b><small>${r.units} x 5kWh lithium modules (needs ${SG.num(r.batteryNeededKwh, 1)} kWh after losses)</small></div>
      <div class="res key"><span>Suggested solar array</span><b>~${SG.num(r.arrayKwp, 1)} kWp</b><small>${r.panels} x ${r.panelW}W panels</small></div>
    </div>
    <div class="res-price">${r.priced ? `<span>Indicative equipment cost (sample prices)</span><b>${SG.fmt(r.total * 0.9)} to ${SG.fmt(r.total * 1.1)}</b><small>Equipment only, excluding installation, delivery and site-specific items.</small>` : `<span>Indicative cost</span><b>Request a quotation</b><small>${r.kva ? 'Some parts of this system are not in the sample catalogue or are quote-only.' : 'This load is above the sample single-phase range.'}</small>`}</div>
    ${r.lines.length ? `<details class="lines"><summary>Sample equipment list</summary><ul>${r.lines.map(l => `<li>${l.qty} x ${SG.esc(l.name)} <em>${l.quote ? 'price on request' : SG.fmt(l.unit * l.qty)}</em></li>`).join('')}</ul></details>` : ''}
    <div class="bars"><h4>Where your daily energy goes</h4>${rows}</div>
    <details class="assume"><summary>Assumptions used</summary><ul>
      <li>Simultaneous load = ${Math.round(r.sim * 100)}% of connected load (or your largest single appliance, if higher).</li>
      <li>Inverter size = simultaneous load × ${c.inverterMargin} margin ÷ ${c.powerFactor} power factor, rounded up to a standard size. kVA and kW are not the same.</li>
      <li>Battery = backup energy ÷ (${c.inverterEfficiency} inverter efficiency × ${c.batteryUsableFraction} usable capacity × ${c.batteryDischargeEff} discharge efficiency).</li>
      <li>Solar array = daily energy ÷ inverter efficiency ÷ (${c.peakSunHours} peak-sun hours × ${c.performanceRatio} performance ratio).</li></ul></details>
    <div class="warn"><b>This is an estimate, not an engineering design.</b> ${r.hasMotor ? 'Your list includes motor loads (fridge, pump, AC, washer) that draw a much higher surge when starting. ' : ''}A qualified installer must confirm sizing using appliance starting currents, system voltage, wiring, local sun conditions, battery chemistry, roof shading and equipment compatibility before you buy or install anything.</div>
    <h3 class="res-title">Ready to power your home?</h3>
    <div class="cta-row"><button class="btn primary" type="button" data-act="quote">Request my quotation</button><button class="btn wa" type="button" data-act="wa">Send my requirements on WhatsApp</button><button class="btn ghost" type="button" data-act="assess">Request a site assessment</button><button class="btn ghost" type="button" data-act="topkg">Load into package builder</button><button class="btn ghost" type="button" data-act="back1">Adjust my appliances</button></div>`;
  }
  function render() {
    root.innerHTML = state.step === 1 ? renderStep1() : state.step === 2 ? renderStep2() : renderStep3();
    if (state.step === 1) updateSummary();
  }
  function setStep(n, scroll) { state.step = n; persist(); render(); if (scroll !== false) root.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  function calcSummaryText(r) { return `Load ${SG.num(r.connectedW / 1000, 2)} kW (est. simultaneous ${SG.num(r.simW / 1000, 2)} kW), ${SG.num(r.dailyKwh, 1)} kWh/day, ${r.backupHours}h backup. Suggested ~${r.inverterLabel}, ~${r.batteryKwh} kWh battery, ~${SG.num(r.arrayKwp, 1)} kWp (${r.panels} x ${r.panelW}W). Appliances: ${r.items.map(i => i.qty + ' x ' + i.name).join(', ')}.`; }

  SG.calcUI = {
    init() {
      root = document.getElementById('calculator-root'); if (!root) return;
      state = load(); render();
      root.addEventListener('click', e => {
        const b = e.target.closest('[data-act]'); if (!b || b.tagName === 'FORM' || b.tagName === 'INPUT') return;
        const act = b.dataset.act, cardEl = b.closest('.appl'), item = cardEl && state.items.find(i => i.id === cardEl.dataset.id);
        if (act === 'inc' && item) { item.qty = Math.min(50, item.qty + 1); persist(); render(); focusCard(item.id, 'inc'); }
        else if (act === 'dec' && item) { item.qty = Math.max(0, item.qty - 1); persist(); render(); focusCard(item.id, 'dec'); }
        else if (act === 'del' && item) { state.items = state.items.filter(i => i !== item); persist(); render(); }
        else if (act === 'preset') { const p = PRESETS[b.dataset.k]; state.items.forEach(i => { if (!i.custom) { i.qty = p.q[i.id] || 0; } }); persist(); render(); SG.toast(p.name + ' appliances loaded'); }
        else if (act === 'clear') { state.items.forEach(i => i.qty = 0); persist(); render(); }
        else if (act === 'next') { if (!state.items.some(i => i.qty > 0)) { SG.toast('Select at least one appliance first', 'warn'); return; } setStep(2); }
        else if (act === 'back') setStep(1);
        else if (act === 'back1') setStep(1);
        else if (act === 'backup') { state.backupHours = Number(b.dataset.h); state.customBackup = ''; persist(); render(); }
        else if (act === 'backup-custom') { state.backupHours = Number(state.customBackup) > 0 ? Number(state.customBackup) : 6; state.customBackup = String(state.backupHours); persist(); render(); }
        else if (act === 'calc') {
          result = SG.calcEngine.compute(state, SG.store.getProducts());
          if (result.error) { const er = root.querySelector('.err'); er.textContent = result.error; er.hidden = false; return; }
          setStep(3);
        }
        else if (act === 'quote') SG.forms.openQuote({ source: 'Solar calculator', calc: calcSummaryText(result), products: result.lines.map(l => `${l.qty} x ${l.name}`).join('; '), waMessage: SG.msg.calc(result) });
        else if (act === 'wa') SG.wa.open(SG.msg.calc(result));
        else if (act === 'assess') SG.forms.openAssessment({ calc: calcSummaryText(result) });
        else if (act === 'topkg') { SG.pkg.setLines(result.lines); SG.pkg.openDrawer(); }
      });
      root.addEventListener('input', e => {
        const t = e.target, cardEl = t.closest('.appl');
        if (cardEl && t.dataset.f) { const item = state.items.find(i => i.id === cardEl.dataset.id); const v = parseFloat(t.value); if (item && !isNaN(v)) { item[t.dataset.f] = t.dataset.f === 'watts' ? Math.min(20000, Math.max(1, v)) : Math.min(24, Math.max(0, v)); persist(); updateSummary(); } }
        else if (t.dataset.act === 'custom-hours') { const v = parseFloat(t.value); if (v > 0 && v <= 48) { state.backupHours = v; state.customBackup = String(v); persist(); } }
      });
      root.addEventListener('change', e => {
        const t = e.target;
        if (t.dataset.act === 'usage') { state.usage = t.value; persist(); render(); }
        else if (t.dataset.f) { render(); }          // refresh the "x W each" label after editing
      });
      root.addEventListener('submit', e => {
        e.preventDefault(); const f = e.target; if (f.dataset.act !== 'custom-form') return;
        const name = f.name.value.trim(), watts = parseFloat(f.watts.value), qty = parseInt(f.qty.value, 10), hours = parseFloat(f.hours.value), er = f.querySelector('.err');
        let msg = '';
        if (!name) msg = 'Enter the appliance name.'; else if (!(watts > 0 && watts <= 20000)) msg = 'Watts must be between 1 and 20,000.';
        else if (!(qty >= 1 && qty <= 50)) msg = 'Quantity must be between 1 and 50.'; else if (!(hours >= 0 && hours <= 24)) msg = 'Hours per day must be between 0 and 24.';
        if (msg) { er.textContent = msg; er.hidden = false; return; }
        state.items.push({ id: SG.uid('c'), name, icon: '🔌', watts, hours, qty, custom: true }); persist(); render(); SG.toast(name + ' added');
      });
    },
    reset() { state = fresh(); persist(); render(); }
  };
  function focusCard(id, act) { const b = root.querySelector(`.appl[data-id="${CSS.escape(id)}"] [data-act="${act}"]`); if (b) b.focus(); }
})();
