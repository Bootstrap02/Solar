/* Public site: catalogue, compare, package builder, projects, testimonials, navigation. */
(function () {
  const SG = window.SG = window.SG || {};
  const E = SG.esc, $ = SG.$, $$ = SG.$$;
  let products = [], F = { q: '', cat: 'all', price: 'all', avail: 'all', featured: false, sort: 'featured' }, cmp = [], projFilter = 'All';

  const SERVICES = [
    ['Residential solar installation', 'Complete home systems designed around your appliances, installed and tested by trained technicians.'],
    ['Commercial solar installation', 'Solar and backup for shops, offices, clinics and small factories, designed after a site visit.'],
    ['Solar system assessment', 'An engineer checks your load, roof, shading and wiring, then confirms the right system size.'],
    ['Inverter and battery installation', 'Upgrade or add storage to an existing system, with compatibility checked first.'],
    ['Maintenance and troubleshooting', 'Fault finding, panel cleaning, battery health checks and inverter servicing.'],
    ['Solar equipment supply', 'Panels, inverters, batteries and accessories for installers and DIY-minded customers.'],
    ['Solar-powered pumping', 'Borehole and irrigation pumping systems that run from daylight.']
  ];
  const FAQ = [
    ['How do I estimate the solar system I need?', 'List the appliances you want to power, how many hours a day you use them, and how long you want backup. Our calculator turns that into an estimate. An engineer then confirms the final design on site.'],
    ['How long will the battery last?', 'It depends on the battery size and how much power your appliances draw. A 5kWh lithium battery with about 90% usable capacity gives roughly 4.5kWh. At a 1kW load that is a little over four hours, before conversion losses.'],
    ['How do I choose an inverter?', 'Inverters are rated in kVA, but they deliver kW (roughly kVA × power factor). Choose one that covers the appliances running together, with headroom for motors such as fridges, pumps and air conditioners that surge on start-up.'],
    ['Can solar run an air conditioner?', 'Often yes, but air conditioners are demanding. They need a larger inverter, more battery and more panels. Include them in the calculator and ask for an assessment.'],
    ['How does installation work?', 'After your assessment and quotation we agree a design, schedule installation, mount panels, wire protection, commission the system and show you how to use it.'],
    ['What maintenance is needed?', 'Panels need occasional cleaning and a visual check. Batteries and connections should be inspected periodically. The maintenance schedule depends on your equipment.'],
    ['What warranties apply?', 'Warranty terms vary by product and are shown on each product page. The figures on this demo site are sample values only.']
  ];

  /* ---------- helpers ---------- */
  const catLabel = id => SG.store.categoryLabel(id);
  const spec2 = p => Object.values(p.specifications || {}).slice(0, 2).join(' · ');
  const stars = n => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);

  function pcard(p) {
    const checked = cmp.includes(p.id) ? 'checked' : '';
    return `<article class="pcard" data-id="${E(p.id)}">
      <button class="pimg" type="button" data-g="view" aria-label="View details for ${E(p.name)}">${SG.img(p.image, p.name)}<span class="avail a-${E(p.availability)}">${E(SG.availabilityLabels[p.availability] || p.availability)}</span>${p.featured ? '<span class="feat">Featured</span>' : ''}</button>
      <div class="pbody"><span class="pcat">${E(catLabel(p.category))}</span><h3>${E(p.name)}</h3><p class="pspec">${E(spec2(p))}</p>
        <div class="pprice ${p.pricingMode === 'quote-only' || !p.price ? 'rq' : ''}">${E(SG.price(p))}</div>
        <div class="pact"><button class="btn small ghost" type="button" data-g="view">View details</button><button class="btn small primary" type="button" data-g="add">Add to package</button><button class="btn small ghost" type="button" data-g="pquote">Request quote</button></div>
        <label class="cmp"><input type="checkbox" data-g="cmp" ${checked}> Compare</label></div></article>`;
  }

  /* ---------- catalogue ---------- */
  function priceBand(p) {
    if (F.price === 'all') return true;
    if (p.pricingMode === 'quote-only' || !p.price) return false;
    const x = p.price;
    return F.price === 'u300' ? x < 300000 : F.price === '300-1m' ? x >= 300000 && x < 1000000 : F.price === '1-3m' ? x >= 1000000 && x < 3000000 : x >= 3000000;
  }
  function filtered() {
    const q = F.q.trim().toLowerCase();
    let list = products.filter(p => (F.cat === 'all' || p.category === F.cat) && priceBand(p) && (F.avail === 'all' || p.availability === F.avail) && (!F.featured || p.featured) &&
      (!q || [p.name, p.brand, p.model].join(' ').toLowerCase().includes(q)));
    const pr = p => (p.pricingMode === 'quote-only' || !p.price) ? Infinity : p.price;
    if (F.sort === 'asc') list.sort((a, b) => pr(a) - pr(b)); else if (F.sort === 'desc') list.sort((a, b) => (pr(b) === Infinity ? -1 : pr(b)) - (pr(a) === Infinity ? -1 : pr(a)));
    else if (F.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name)); else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return list;
  }
  function renderCatalogue() {
    const list = filtered();
    $('#prod-count').textContent = `${list.length} of ${products.length} products`;
    $('#prod-grid').innerHTML = list.length ? list.map(pcard).join('') : `<div class="empty"><h3>No products match these filters</h3><p>Try a different search, price range or category.</p><button class="btn primary" type="button" data-g="reset">Reset filters</button></div>`;
  }
  function renderFeatured() {
    const f = products.filter(p => p.featured).slice(0, 6);
    $('#featured-grid').innerHTML = f.length ? f.map(pcard).join('') : '<div class="empty"><p>No featured products yet. Mark products as featured in the admin demo.</p></div>';
  }
  function renderCats() {
    $('#cat-grid').innerHTML = SG.categories.map(c => {
      const n = products.filter(p => p.category === c.id).length;
      return `<button class="cat" type="button" data-g="cat" data-c="${E(c.id)}">${SG.img('art:' + c.art, c.label)}<span class="cat-t"><b>${E(c.label)}</b><small>${E(c.blurb)}</small><em>${n} product${n === 1 ? '' : 's'}</em></span></button>`;
    }).join('');
    $('#f-cat').innerHTML = '<option value="all">All categories</option>' + SG.categories.map(c => `<option value="${E(c.id)}">${E(c.label)}</option>`).join('');
    $('#f-cat').value = F.cat;
  }
  function syncControls() { $('#f-q').value = F.q; $('#f-cat').value = F.cat; $('#f-price').value = F.price; $('#f-avail').value = F.avail; $('#f-sort').value = F.sort; $('#f-feat').checked = F.featured; }
  function refreshAll() { products = SG.pub.products(); renderCats(); renderFeatured(); renderCatalogue(); renderProjects(); renderTesti(); pkg.render(); updateCmpTray(); }

  /* ---------- product detail ---------- */
  function detail(p) {
    const rows = Object.entries(p.specifications || {}).map(([k, v]) => `<div><dt>${E(k)}</dt><dd>${E(v)}</dd></div>`).join('');
    const d = SG.dialog.open(`<div class="pdetail"><div class="pd-img">${SG.img(p.image, p.name)}</div><div class="pd-info">
      <span class="pcat">${E(catLabel(p.category))} · ${E(p.brand)}</span><h2>${E(p.name)}</h2><p class="muted">Model ${E(p.model)}</p><p>${E(p.description)}</p>
      <div class="pd-price"><b>${E(SG.price(p))}</b><span class="avail a-${E(p.availability)}">${E(SG.availabilityLabels[p.availability] || '')}</span></div>
      ${p.pricingMode === 'quote-only' ? '' : '<p class="muted small">Sample price for demonstration. Excludes installation.</p>'}
      <dl class="specs">${rows}<div><dt>Warranty</dt><dd>${E(p.warranty || 'Ask us')}</dd></div></dl>
      <div class="row"><div class="qty" role="group" aria-label="Quantity"><button type="button" data-q="-1" aria-label="Decrease">&minus;</button><output id="pd-qty">1</output><button type="button" data-q="1" aria-label="Increase">+</button></div>
      <button class="btn primary" type="button" id="pd-add">Add to package</button></div>
      <div class="row"><button class="btn ghost" type="button" id="pd-quote">Request quote</button><button class="btn wa" type="button" id="pd-wa">Ask on WhatsApp</button></div></div></div>`, { wide: true });
    let q = 1; const out = d.querySelector('#pd-qty');
    d.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { q = Math.min(99, Math.max(1, q + Number(b.dataset.q))); out.textContent = q; });
    d.querySelector('#pd-add').onclick = () => { pkg.add(p.id, q); SG.dialog.close(); };
    d.querySelector('#pd-quote').onclick = () => SG.forms.openQuote({ source: 'Product quote', products: p.name, waMessage: SG.msg.product(p) });
    d.querySelector('#pd-wa').onclick = () => SG.wa.open(SG.msg.product(p));
  }

  /* ---------- compare ---------- */
  function updateCmpTray() {
    cmp = cmp.filter(id => products.some(p => p.id === id));
    const t = $('#compare-tray'); t.hidden = !cmp.length;
    t.innerHTML = cmp.length ? `<span><b>${cmp.length}</b> selected (max 3)</span><button class="btn small primary" type="button" data-g="cmp-open" ${cmp.length < 2 ? 'disabled' : ''}>Compare</button><button class="btn small ghost" type="button" data-g="cmp-clear">Clear</button>` : '';
  }
  function openCompare() {
    const ps = cmp.map(id => products.find(p => p.id === id)).filter(Boolean);
    if (ps.length < 2) { SG.toast('Select at least two products', 'warn'); return; }
    const cats = new Set(ps.map(p => p.category));
    const keys = [...new Set(ps.flatMap(p => Object.keys(p.specifications)))];
    const d = SG.dialog.open(`<h2>Compare products</h2>${cats.size > 1 ? '<p class="warn">These products are in different categories, so many specifications do not apply to every product. Compare like with like where you can.</p>' : ''}
      <div class="tbl-wrap"><table class="cmp-table"><thead><tr><th></th>${ps.map(p => `<th>${SG.img(p.image, p.name)}<div>${E(p.name)}</div><button class="link" type="button" data-rm="${E(p.id)}">Remove</button></th>`).join('')}</tr></thead>
      <tbody><tr><th>Price</th>${ps.map(p => `<td>${E(SG.price(p))}</td>`).join('')}</tr><tr><th>Availability</th>${ps.map(p => `<td>${E(SG.availabilityLabels[p.availability] || '')}</td>`).join('')}</tr>
      ${keys.map(k => `<tr><th>${E(k)}</th>${ps.map(p => `<td>${E(p.specifications[k] ?? '—')}</td>`).join('')}</tr>`).join('')}<tr><th>Warranty</th>${ps.map(p => `<td>${E(p.warranty || '—')}</td>`).join('')}</tr></tbody></table></div>
      <div class="row end"><button class="btn ghost" data-close type="button">Close</button></div>`, { wide: true });
    d.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { cmp = cmp.filter(id => id !== b.dataset.rm); renderCatalogue(); renderFeatured(); updateCmpTray(); if (cmp.length >= 2) openCompare(); else SG.dialog.close(); });
  }

  /* ---------- package builder ---------- */
  const pkg = SG.pkg = {
    st: { lines: [], install: false, delivery: false },
    load() { const s = SG.store.getObj('package', null); if (s && Array.isArray(s.lines)) this.st = { lines: s.lines.filter(l => l && typeof l.id === 'string' && l.qty > 0), install: !!s.install, delivery: !!s.delivery }; },
    save() { SG.store.setObj('package', this.st); },
    resolved() { return this.st.lines.map(l => { const p = products.find(x => x.id === l.id); return p ? { p, qty: l.qty, id: p.id, name: p.name, unit: p.price, quote: p.pricingMode === 'quote-only' || !p.price } : null; }).filter(Boolean); },
    totals() {
      const items = this.resolved(), c = SG.config.pricing;
      const equipment = items.reduce((s, i) => s + (i.quote ? 0 : i.unit * i.qty), 0);
      const quoteItems = items.filter(i => i.quote);
      const install = this.st.install && equipment ? Math.round(equipment * c.installationRate) : 0;
      const delivery = this.st.delivery && items.length ? c.deliveryFlat : 0;
      return { items, equipment, quoteItems, install, delivery, complete: items.length > 0 && !quoteItems.length, grand: equipment + install + delivery };
    },
    add(id, qty) { const l = this.st.lines.find(x => x.id === id); if (l) l.qty = Math.min(99, l.qty + (qty || 1)); else this.st.lines.push({ id, qty: qty || 1 }); this.save(); this.render(); SG.toast('Added to your package'); },
    setLines(lines) { this.st.lines = lines.map(l => ({ id: l.id, qty: l.qty })); this.save(); this.render(); },
    change(id, d) { const l = this.st.lines.find(x => x.id === id); if (!l) return; l.qty += d; if (l.qty < 1) this.st.lines = this.st.lines.filter(x => x !== l); this.save(); this.render(); },
    remove(id) { this.st.lines = this.st.lines.filter(x => x.id !== id); this.save(); this.render(); },
    clear() { this.st = { lines: [], install: false, delivery: false }; this.save(); this.render(); },
    openDrawer() { const d = $('#pkg-drawer'); this.render(); if (!d.open) d.showModal(); },
    render() {
      const t = this.totals(), n = t.items.reduce((s, i) => s + i.qty, 0), badge = $('#pkg-count'); badge.textContent = n; badge.hidden = !n;
      const body = $('#pkg-body'); if (!body) return;
      if (!t.items.length) { body.innerHTML = '<div class="empty"><h3>Your package is empty</h3><p>Add panels, an inverter and batteries from the catalogue, or let the solar calculator suggest a package.</p><div class="row"><a class="btn primary" href="#products" data-g="pkg-close">Browse products</a><a class="btn ghost" href="#calculator" data-g="pkg-close">Use the calculator</a></div></div>'; return; }
      body.innerHTML = `<ul class="pkg-list">${t.items.map(i => `<li data-id="${E(i.id)}">${SG.img(i.p.image, i.name)}<div><b>${E(i.name)}</b><span class="muted small">${i.quote ? 'Price on request' : SG.fmt(i.unit) + ' each'}</span></div>
        <div class="qty sm"><button type="button" data-p="dec" aria-label="Decrease quantity of ${E(i.name)}">&minus;</button><output>${i.qty}</output><button type="button" data-p="inc" aria-label="Increase quantity of ${E(i.name)}">+</button></div>
        <span class="line-t">${i.quote ? 'Quote' : SG.fmt(i.unit * i.qty)}</span><button class="icon-btn" type="button" data-p="rm" aria-label="Remove ${E(i.name)}">&times;</button></li>`).join('')}</ul>
        <div class="opts"><label><input type="checkbox" data-opt="install" ${this.st.install ? 'checked' : ''}> Include installation (sample ${Math.round(SG.config.pricing.installationRate * 100)}% of equipment)</label><label><input type="checkbox" data-opt="delivery" ${this.st.delivery ? 'checked' : ''}> Include delivery (sample ${SG.fmt(SG.config.pricing.deliveryFlat)})</label></div>
        <dl class="totals"><div><dt>Equipment subtotal${t.quoteItems.length ? ' (priced items)' : ''}</dt><dd>${SG.fmt(t.equipment)}</dd></div>${t.install ? `<div><dt>Installation (optional)</dt><dd>${SG.fmt(t.install)}</dd></div>` : ''}${t.delivery ? `<div><dt>Delivery (optional)</dt><dd>${SG.fmt(t.delivery)}</dd></div>` : ''}
        <div class="grand"><dt>${t.complete ? 'Estimated total' : 'Subtotal so far'}</dt><dd>${SG.fmt(t.grand)}</dd></div></dl>
        ${t.quoteItems.length ? `<p class="warn small">${t.quoteItems.length} item${t.quoteItems.length > 1 ? 's need' : ' needs'} an individual quote (${E(t.quoteItems.map(i => i.name).join(', '))}). The total above excludes ${t.quoteItems.length > 1 ? 'them' : 'it'}.</p>` : ''}
        <p class="muted small">Estimate only, not a binding offer. Nothing is reserved and no payment is taken.</p>
        <div class="stack"><button class="btn primary" type="button" data-p="quote">Request quotation for this package</button><button class="btn wa" type="button" data-p="wa">Send package on WhatsApp</button><button class="btn ghost" type="button" data-p="clear">Clear package</button></div>`;
    }
  };
  function pkgContext() { const t = pkg.totals(); return { source: 'Package builder', products: t.items.map(i => `${i.qty} x ${i.name}`).join('; ') + (t.complete ? `. Est. total ${SG.fmt(t.grand)}` : '. Some items need quotes'), waMessage: SG.msg.pkg(t.items, t) }; }

  /* ---------- projects & testimonials ---------- */
  function renderProjects() {
    const all = SG.pub.projects(), types = ['All', ...SG.projectTypes];
    $('#proj-filters').innerHTML = types.map(t => `<button type="button" class="chip ${projFilter === t ? 'on' : ''}" data-g="pf" data-t="${E(t)}" aria-pressed="${projFilter === t}">${E(t)}</button>`).join('');
    const list = all.filter(p => projFilter === 'All' || p.type === projFilter);
    $('#proj-grid').innerHTML = list.length ? list.map(p => `<article class="jcard" data-id="${E(p.id)}"><button type="button" class="jimg" data-g="pview" aria-label="View project ${E(p.title)}">${SG.img(p.image, p.title)}<span class="tag">Sample project</span></button><div class="jbody"><span class="pcat">${E(p.type || 'Project')}</span><h3>${E(p.title)}</h3><p class="muted small">${E(p.location || '')}${p.capacity ? ' · ' + E(p.capacity) : ''}</p><button class="btn small ghost" type="button" data-g="pview">View project</button></div></article>`).join('') : '<div class="empty"><h3>No projects in this category</h3><p>Choose another filter.</p></div>';
  }
  function projectDetail(id) {
    const p = SG.pub.projects().find(x => x.id === id); if (!p) return;
    const d = SG.dialog.open(`<div class="pdetail"><div class="pd-img">${SG.img(p.image, p.title)}</div><div class="pd-info"><span class="pcat">${E(p.type)} · Sample demonstration project</span><h2>${E(p.title)}</h2>
      <dl class="specs"><div><dt>Location</dt><dd>${E(p.location)}</dd></div><div><dt>System</dt><dd>${E(p.capacity)}</dd></div><div><dt>Type</dt><dd>${E(p.type)}</dd></div></dl><p>${E(p.description)}</p>
      <p class="muted small">Demonstration record. Not work completed by a real company.</p><div class="row"><button class="btn primary" id="pj-q" type="button">Request a similar system</button></div></div></div>`, { wide: true });
    d.querySelector('#pj-q').onclick = () => SG.forms.openQuote({ source: 'Project: ' + p.title, products: 'Interested in a system like: ' + p.title + ' (' + p.capacity + ')' });
  }
  function renderTesti() {
    const t = SG.store.getTestimonials();
    $('#testi-grid').innerHTML = t.length ? t.map(x => `<figure class="testi"><div class="stars" aria-label="${Number(x.rating) || 0} out of 5 stars">${stars(Math.min(5, Math.max(0, Number(x.rating) || 0)))}</div><blockquote>${E(x.review)}</blockquote><figcaption><b>${E(x.name)}</b><span>${E(x.category || '')}</span></figcaption></figure>`).join('') : '<div class="empty"><p>No testimonials yet.</p></div>';
  }

  /* ---------- init ---------- */
  function init() {
    const c = SG.config;
    $$('[data-brand]').forEach(el => el.textContent = c.brand); $$('[data-tagline]').forEach(el => el.textContent = c.tagline);
    $$('[data-phone]').forEach(el => { el.textContent = c.phoneDisplay; if (c.phoneLink) el.href = 'tel:' + c.phoneLink; else { el.removeAttribute('href'); el.title = 'Demo number'; } });
    $$('[data-email]').forEach(el => { el.textContent = c.email; el.href = 'mailto:' + c.email; });
    $('#areas').innerHTML = c.serviceAreas.map(a => `<li>${E(a)}</li>`).join('');
    $('#services-grid').innerHTML = SERVICES.map(s => `<article class="svc"><h3>${E(s[0])}</h3><p>${E(s[1])}</p><button class="link" type="button" data-g="svc" data-s="${E(s[0])}">Ask about this service</button></article>`).join('');
    $('#faq-list').innerHTML = FAQ.map(f => `<details><summary>${E(f[0])}</summary><p>${E(f[1])}</p></details>`).join('');
    $('#foot-cats').innerHTML = SG.categories.map(x => `<li><a href="#products" data-g="cat" data-c="${E(x.id)}">${E(x.label)}</a></li>`).join('');
    pkg.load(); products = SG.store.getProducts(); refreshAll(); SG.calcUI.init();
    SG.forms.mountPage($('#contact-form'), 'contact', 'c-'); SG.forms.mountPage($('#assess-form'), 'assess', 'as-');

    // catalogue controls
    $('#filters').addEventListener('input', e => {
      const t = e.target;
      if (t.id === 'f-q') F.q = t.value; else if (t.id === 'f-cat') F.cat = t.value; else if (t.id === 'f-price') F.price = t.value; else if (t.id === 'f-avail') F.avail = t.value; else if (t.id === 'f-sort') F.sort = t.value; else if (t.id === 'f-feat') F.featured = t.checked;
      renderCatalogue();
    });
    $('#filters').addEventListener('submit', e => e.preventDefault());

    // global delegation
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-g]'); if (!b) return;
      const g = b.dataset.g, card = b.closest('.pcard'), p = card && products.find(x => x.id === card.dataset.id);
      if (g === 'view' && p) detail(p);
      else if (g === 'add' && p) pkg.add(p.id, 1);
      else if (g === 'pquote' && p) SG.forms.openQuote({ source: 'Product quote', products: p.name, waMessage: SG.msg.product(p) });
      else if (g === 'cmp' && p) {
        if (b.checked) { if (cmp.length >= 3) { b.checked = false; SG.toast('You can compare up to three products', 'warn'); return; } cmp.push(p.id); } else cmp = cmp.filter(id => id !== p.id);
        $$(`.pcard[data-id="${CSS.escape(p.id)}"] [data-g=cmp]`).forEach(x => x.checked = cmp.includes(p.id)); updateCmpTray();
      }
      else if (g === 'cmp-open') openCompare();
      else if (g === 'cmp-clear') { cmp = []; $$('[data-g=cmp]').forEach(x => x.checked = false); updateCmpTray(); }
      else if (g === 'cat') { F = { q: '', cat: b.dataset.c, price: 'all', avail: 'all', featured: false, sort: 'featured' }; syncControls(); renderCatalogue(); if (b.tagName === 'BUTTON') $('#products').scrollIntoView({ behavior: 'smooth' }); }
      else if (g === 'reset') { F = { q: '', cat: 'all', price: 'all', avail: 'all', featured: false, sort: 'featured' }; syncControls(); renderCatalogue(); }
      else if (g === 'pf') { projFilter = b.dataset.t; renderProjects(); }
      else if (g === 'pview') projectDetail(b.closest('.jcard').dataset.id);
      else if (g === 'svc') SG.forms.openQuote({ source: 'Service: ' + b.dataset.s, products: 'Service enquiry: ' + b.dataset.s });
      else if (g === 'quote') SG.forms.openQuote({ source: 'General quote' });
      else if (g === 'assess') SG.forms.openAssessment({});
      else if (g === 'wa') SG.wa.open(SG.msg.general());
      else if (g === 'pkg-open') pkg.openDrawer();
      else if (g === 'pkg-close') $('#pkg-drawer').close();
    });
    // package drawer
    const dr = $('#pkg-drawer');
    dr.addEventListener('click', e => {
      if (e.target === dr || e.target.closest('[data-dclose]')) { dr.close(); return; }
      const b = e.target.closest('[data-p]'); if (!b) return; const id = b.closest('li') && b.closest('li').dataset.id, a = b.dataset.p;
      if (a === 'inc') pkg.change(id, 1); else if (a === 'dec') pkg.change(id, -1); else if (a === 'rm') pkg.remove(id);
      else if (a === 'clear') { pkg.clear(); SG.toast('Package cleared'); }
      else if (a === 'quote') { const ctx = pkgContext(); dr.close(); SG.forms.openQuote(ctx); }
      else if (a === 'wa') SG.wa.open(pkgContext().waMessage);
    });
    dr.addEventListener('change', e => { const o = e.target.dataset.opt; if (o) { pkg.st[o] = e.target.checked; pkg.save(); pkg.render(); } });

    // nav
    const mb = $('#menu-btn'), nav = $('#nav');
    mb.addEventListener('click', () => { const o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
    nav.addEventListener('click', e => { if (e.target.closest('a')) { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.focus(); } });
    window.addEventListener('storage', ev => { if (ev.key && ev.key.startsWith('sungrid.v1.')) refreshAll(); });   // admin changes in another tab
  }
  document.addEventListener('DOMContentLoaded', init);
})();
