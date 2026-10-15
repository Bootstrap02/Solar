/* Admin demo: local-only CRUD for products, projects, testimonials and enquiries. NOT secured. */
(function () {
  const SG = window.SG, E = SG.esc, $ = SG.$;
  const view = $('#view'), title = $('#adm-title');
  const pillCls = s => 's-' + String(s).split(' ')[0];
  const opt = (arr, sel) => arr.map(x => { const v = Array.isArray(x) ? x[0] : x, l = Array.isArray(x) ? x[1] : x; return `<option value="${E(v)}"${v === sel ? ' selected' : ''}>${E(l)}</option>`; }).join('');
  const saved = ok => SG.toast(ok ? 'Saved in this browser' : 'Could not save: browser storage is blocked', ok ? '' : 'warn');
  let q = { products: { q: '', cat: 'all' }, enquiries: { q: '', st: 'all' } };

  const views = {
    dashboard() {
      const P = SG.store.getProducts(), J = SG.store.getProjects(), En = SG.store.getEnquiries(), cats = new Set(P.map(p => p.category));
      return `<div class="stats"><div class="stat"><b>${P.length}</b><span>Total products</span></div><div class="stat"><b>${cats.size}</b><span>Product categories</span></div><div class="stat"><b>${P.filter(p => p.featured).length}</b><span>Featured products</span></div><div class="stat"><b>${En.length}</b><span>Enquiries (${En.filter(e => e.status === 'New').length} new)</span></div><div class="stat"><b>${J.length}</b><span>Sample projects</span></div></div>
      <div class="panel"><h3>Recent enquiries</h3>${En.length ? `<table class="tbl resp"><thead><tr><th>Name</th><th>Type</th><th>Date</th><th>Status</th></tr></thead><tbody>${En.slice(0, 5).map(e => `<tr><td data-l="Name">${E(e.name)}</td><td data-l="Type">${E(e.type)}</td><td data-l="Date">${SG.date(e.createdAt)}</td><td data-l="Status"><span class="pill ${pillCls(e.status)}">${E(e.status)}</span></td></tr>`).join('')}</tbody></table>` : '<p class="muted">No enquiries yet. Submit a form on the public site.</p>'}</div>
      <p class="muted small">All figures are calculated from the data stored in this browser. Data does not sync across browsers or devices.</p>`;
    },
    products() {
      const P = SG.store.getProducts(), f = q.products, s = f.q.toLowerCase();
      const list = P.filter(p => (f.cat === 'all' || p.category === f.cat) && (!s || (p.name + p.brand + p.model).toLowerCase().includes(s)));
      return `<div class="toolbar"><input id="pq" type="search" placeholder="Search products" value="${E(f.q)}" aria-label="Search products"><select id="pc" aria-label="Category"><option value="all">All categories</option>${opt(SG.categories.map(c => [c.id, c.label]), f.cat)}</select><button class="btn primary" data-a="p-new" type="button">Add product</button></div>
      <div class="panel">${list.length ? `<table class="tbl resp"><thead><tr><th></th><th>Product</th><th>Category</th><th>Price</th><th>Status</th><th></th></tr></thead><tbody>${list.map(p => `<tr data-id="${E(p.id)}"><td>${SG.img(p.image, '')}</td><td data-l="Product"><b>${E(p.name)}</b>${p.featured ? ' <span class="pill">Featured</span>' : ''}</td><td data-l="Category">${E(SG.store.categoryLabel(p.category))}</td><td data-l="Price">${E(SG.price(p))}</td><td data-l="Status">${E(SG.availabilityLabels[p.availability] || p.availability)}</td><td><div class="acts"><button class="btn small ghost" data-a="p-edit" type="button">Edit</button><button class="btn small ghost" data-a="p-del" type="button">Delete</button></div></td></tr>`).join('')}</tbody></table>` : '<p class="muted">No products match.</p>'}</div>`;
    },
    projects() {
      const J = SG.store.getProjects();
      return `<div class="toolbar"><button class="btn primary" data-a="j-new" type="button">Add project</button></div><div class="panel">${J.length ? `<table class="tbl resp"><thead><tr><th></th><th>Project</th><th>Type</th><th>Location</th><th></th></tr></thead><tbody>${J.map(j => `<tr data-id="${E(j.id)}"><td>${SG.img(j.image, '')}</td><td data-l="Project"><b>${E(j.title)}</b>${j.featured ? ' <span class="pill">Featured</span>' : ''}</td><td data-l="Type">${E(j.type)}</td><td data-l="Location">${E(j.location)}</td><td><div class="acts"><button class="btn small ghost" data-a="j-edit" type="button">Edit</button><button class="btn small ghost" data-a="j-del" type="button">Delete</button></div></td></tr>`).join('')}</tbody></table>` : '<p class="muted">No projects yet.</p>'}</div>`;
    },
    testimonials() {
      const T = SG.store.getTestimonials();
      return `<p class="warn">Testimonials here are fictional samples. Replace them with genuine, authorised customer feedback for a real business.</p><div class="toolbar"><button class="btn primary" data-a="t-new" type="button">Add testimonial</button></div><div class="panel">${T.length ? `<table class="tbl resp"><thead><tr><th>Name</th><th>Review</th><th>Rating</th><th></th></tr></thead><tbody>${T.map(t => `<tr data-id="${E(t.id)}"><td data-l="Name"><b>${E(t.name)}</b></td><td data-l="Review">${E(t.review.slice(0, 90))}${t.review.length > 90 ? '…' : ''}</td><td data-l="Rating">${Number(t.rating) || 0}/5</td><td><div class="acts"><button class="btn small ghost" data-a="t-edit" type="button">Edit</button><button class="btn small ghost" data-a="t-del" type="button">Delete</button></div></td></tr>`).join('')}</tbody></table>` : '<p class="muted">No testimonials yet.</p>'}</div>`;
    },
    enquiries() {
      const En = SG.store.getEnquiries(), f = q.enquiries, s = f.q.toLowerCase();
      const list = En.filter(e => (f.st === 'all' || e.status === f.st) && (!s || (e.name + e.phone + e.location + e.type).toLowerCase().includes(s)));
      return `<p class="muted small">Changing a status here only updates this demo record. It does not message the customer.</p><div class="toolbar"><input id="eq" type="search" placeholder="Search enquiries" value="${E(f.q)}" aria-label="Search enquiries"><select id="es" aria-label="Status"><option value="all">All statuses</option>${opt(SG.enquiryStatuses, f.st)}</select></div>
      <div class="panel">${list.length ? `<table class="tbl resp"><thead><tr><th>Customer</th><th>Phone</th><th>Type</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody>${list.map(e => `<tr data-id="${E(e.id)}"><td data-l="Customer"><b>${E(e.name)}</b></td><td data-l="Phone">${E(e.phone)}</td><td data-l="Type">${E(e.type)}</td><td data-l="Date">${SG.date(e.createdAt)}</td><td data-l="Status"><select data-a="e-status" aria-label="Status for ${E(e.name)}">${opt(SG.enquiryStatuses, e.status)}</select></td><td><div class="acts"><button class="btn small ghost" data-a="e-view" type="button">View</button><button class="btn small ghost" data-a="e-del" type="button">Delete</button></div></td></tr>`).join('')}</tbody></table>` : '<p class="muted">No enquiries match.</p>'}</div>`;
    },
    settings() {
      return `<div class="panel"><h3>Demo data controls</h3><p>Data lives in this browser's localStorage for this site address. It does not sync across browsers or devices and is not secure. Never store real customer data here.</p>
      <div class="row"><button class="btn ghost" data-a="export" type="button">Export demo data (JSON)</button><label class="btn ghost" for="imp">Import JSON<input id="imp" type="file" accept="application/json,.json" hidden></label><button class="btn danger" data-a="reset" type="button">Reset all demo data</button></div><p class="muted small" id="imp-msg" role="status"></p></div>`;
    }
  };

  function route() {
    const h = (location.hash || '#dashboard').slice(1), name = views[h] ? h : 'dashboard';
    document.querySelectorAll('#adm-nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + name));
    title.textContent = { dashboard: 'Dashboard', products: 'Products', projects: 'Projects', testimonials: 'Testimonials', enquiries: 'Enquiries', settings: 'Demo controls' }[name];
    view.innerHTML = views[name](); view.dataset.v = name;
    $('#side').classList.remove('open'); $('#side-btn').setAttribute('aria-expanded', 'false');
  }
  const rerender = () => { const y = window.scrollY; view.innerHTML = views[view.dataset.v](); window.scrollTo(0, y); };

  /* ----- forms ----- */
  const field = (name, label, val, type = 'text', extra = '') => `<label>${E(label)}<input name="${name}" type="${type}" value="${E(val ?? '')}" ${extra}></label>`;
  function formErrors(d, list) { const el = d.querySelector('.err'); el.textContent = list.join(' '); el.hidden = !list.length; if (list.length) d.querySelector('.modal-inner').scrollTop = 0; return !list.length; }
  function imageBlock(img) {
    const isArt = String(img || '').startsWith('art:'), isScene = String(img || '').startsWith('scene:'), parts = isArt ? img.split(':') : [];
    return { isArt, isScene, kind: parts[1] || 'system', badge: parts.slice(2).join(':') };
  }
  function productForm(p) {
    const isNew = !p, x = p || { name: '', brand: '', model: '', category: 'panels', price: 0, pricingMode: 'show-price', availability: 'in-stock', featured: false, rating: 0, warranty: '', description: '', specifications: {}, image: 'art:panel:' };
    const im = imageBlock(x.image), custom = String(x.image).startsWith('data:');
    const d = SG.dialog.open(`<h2>${isNew ? 'Add product' : 'Edit product'}</h2><p class="err" role="alert" hidden></p><form class="form-g" novalidate>
      ${field('name', 'Product name', x.name, 'text', 'required maxlength="120"')}${field('brand', 'Brand', x.brand, 'text', 'maxlength="60"')}${field('model', 'Model', x.model, 'text', 'maxlength="60"')}
      <label>Category<select name="category">${opt(SG.categories.map(c => [c.id, c.label]), x.category)}</select></label>
      <label>Pricing mode<select name="pricingMode">${opt([['show-price', 'Show price'], ['quote-only', 'Quote only (Request price)']], x.pricingMode)}</select></label>${field('price', 'Price (₦)', x.price, 'number', 'min="0" step="1000"')}
      <label>Availability<select name="availability">${opt(Object.entries(SG.availabilityLabels), x.availability)}</select></label>${field('rating', 'Main rating (W, kVA, kWh or Ah, used by the calculator)', x.rating, 'number', 'min="0" step="any"')}${field('warranty', 'Warranty', x.warranty, 'text', 'maxlength="120"')}
      <label class="chk"><input type="checkbox" name="featured" ${x.featured ? 'checked' : ''}> Featured product</label>
      <label class="wide">Description<textarea name="description" rows="2" maxlength="400">${E(x.description)}</textarea></label>
      <label class="wide">Specifications (one per line as "Label: value")<textarea name="specs" rows="6">${E(Object.entries(x.specifications).map(([k, v]) => k + ': ' + v).join('\n'))}</textarea></label>
      <label>Image style<select name="imgkind">${opt(SG.art.productKinds.map(k => [k, k]), im.kind)}</select></label>${field('badge', 'Badge text on image (e.g. 550W)', im.badge, 'text', 'maxlength="14"')}
      <label class="wide">Or upload an image (preview only, stored in this browser)<input type="file" name="file" accept="image/*"></label>
      <div class="wide"><img class="prev" id="prev" alt="Image preview" src="${E(SG.art.src(x.image))}"><input type="hidden" name="upload" value="${custom ? E(x.image) : ''}"></div>
      <div class="wide row end"><button class="btn ghost" type="button" data-close>Cancel</button><button class="btn primary" type="submit">Save product</button></div></form>`, { wide: true });
    const f = d.querySelector('form'), prev = d.querySelector('#prev');
    const upd = () => { if (!f.upload.value) prev.src = SG.art.src(`art:${f.imgkind.value}:${f.badge.value}`); };
    f.imgkind.onchange = f.badge.oninput = () => { f.upload.value = ''; upd(); };
    f.file.onchange = () => { const file = f.file.files[0]; if (!file) return; const r = new FileReader(); r.onload = () => { const i = new Image(); i.onload = () => { const s = Math.min(1, 640 / i.width), c = document.createElement('canvas'); c.width = i.width * s; c.height = i.height * s; c.getContext('2d').drawImage(i, 0, 0, c.width, c.height); f.upload.value = c.toDataURL('image/jpeg', .8); prev.src = f.upload.value; }; i.onerror = () => SG.toast('That file is not a valid image', 'warn'); i.src = r.result; }; r.readAsDataURL(file); };
    f.onsubmit = ev => {
      ev.preventDefault(); const errs = [], name = f.name.value.trim(), price = parseFloat(f.price.value || '0'), specs = {};
      if (!name) errs.push('Product name is required.');
      if (isNaN(price) || price < 0) errs.push('Price must be zero or more.');
      if (f.pricingMode.value === 'show-price' && !(price > 0)) errs.push('Enter a price or switch to quote-only.');
      f.specs.value.split('\n').forEach(l => { const i = l.indexOf(':'); if (i > 0 && l.slice(i + 1).trim()) specs[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
      if (!Object.keys(specs).length) errs.push('Add at least one specification as "Label: value".');
      if (!formErrors(d, errs)) return;
      const all = SG.store.getProducts();
      const rec = { id: isNew ? SG.uid('p') : x.id, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), category: f.category.value, brand: f.brand.value.trim(), model: f.model.value.trim(), description: f.description.value.trim(), image: f.upload.value || `art:${f.imgkind.value}:${f.badge.value.trim()}`, price: f.pricingMode.value === 'quote-only' ? 0 : price, pricingMode: f.pricingMode.value, availability: f.availability.value, featured: f.featured.checked, specifications: specs, warranty: f.warranty.value.trim(), tags: [f.category.value], rating: parseFloat(f.rating.value) || 0 };
      const ok = SG.store.saveProducts(isNew ? [rec, ...all] : all.map(a => a.id === x.id ? rec : a)); d.close(); saved(ok); rerender();
    };
  }
  function projectForm(p) {
    const isNew = !p, x = p || { title: '', location: '', capacity: '', type: 'Residential', image: 'scene:home', featured: false, description: '' }, custom = String(x.image).startsWith('data:');
    const d = SG.dialog.open(`<h2>${isNew ? 'Add project' : 'Edit project'}</h2><p class="err" role="alert" hidden></p><form class="form-g" novalidate>
      ${field('title', 'Project title', x.title, 'text', 'required maxlength="120"')}${field('location', 'Location', x.location, 'text', 'maxlength="80"')}${field('capacity', 'System capacity', x.capacity, 'text', 'maxlength="80"')}
      <label>Project type<select name="type">${opt(SG.projectTypes, x.type)}</select></label><label>Image scene<select name="scene">${opt(SG.art.sceneKinds.map(k => [k, k]), String(x.image).replace('scene:', ''))}</select></label>
      <label class="chk"><input type="checkbox" name="featured" ${x.featured ? 'checked' : ''}> Featured project</label>
      <label class="wide">Description<textarea name="description" rows="3" maxlength="500">${E(x.description)}</textarea></label>
      <label class="wide">Or upload an image (preview only)<input type="file" name="file" accept="image/*"></label><div class="wide"><img class="prev" id="prev" alt="Preview" src="${E(SG.art.src(x.image))}"><input type="hidden" name="upload" value="${custom ? E(x.image) : ''}"></div>
      <div class="wide row end"><button class="btn ghost" type="button" data-close>Cancel</button><button class="btn primary" type="submit">Save project</button></div></form>`, { wide: true });
    const f = d.querySelector('form'), prev = d.querySelector('#prev');
    f.scene.onchange = () => { f.upload.value = ''; prev.src = SG.art.src('scene:' + f.scene.value); };
    f.file.onchange = () => { const file = f.file.files[0]; if (!file) return; const r = new FileReader(); r.onload = () => { const i = new Image(); i.onload = () => { const s = Math.min(1, 800 / i.width), c = document.createElement('canvas'); c.width = i.width * s; c.height = i.height * s; c.getContext('2d').drawImage(i, 0, 0, c.width, c.height); f.upload.value = c.toDataURL('image/jpeg', .8); prev.src = f.upload.value; }; i.onerror = () => SG.toast('That file is not a valid image', 'warn'); i.src = r.result; }; r.readAsDataURL(file); };
    f.onsubmit = ev => {
      ev.preventDefault(); const errs = []; if (!f.title.value.trim()) errs.push('Project title is required.'); if (!f.location.value.trim()) errs.push('Location is required.');
      if (!formErrors(d, errs)) return; const all = SG.store.getProjects();
      const rec = { id: isNew ? SG.uid('j') : x.id, title: f.title.value.trim(), location: f.location.value.trim(), capacity: f.capacity.value.trim(), type: f.type.value, image: f.upload.value || 'scene:' + f.scene.value, featured: f.featured.checked, description: f.description.value.trim() };
      const ok = SG.store.saveProjects(isNew ? [rec, ...all] : all.map(a => a.id === x.id ? rec : a)); d.close(); saved(ok); rerender();
    };
  }
  function testiForm(t) {
    const isNew = !t, x = t || { name: '', review: '', rating: 5, category: 'Residential' };
    const d = SG.dialog.open(`<h2>${isNew ? 'Add testimonial' : 'Edit testimonial'}</h2><p class="warn small">Use fictional demonstration names and clearly mark them as samples.</p><p class="err" role="alert" hidden></p><form class="form-g" novalidate>
      ${field('name', 'Customer display name', x.name, 'text', 'required maxlength="60"')}<label>Rating<select name="rating">${opt([5, 4, 3, 2, 1].map(n => [String(n), n + ' stars']), String(x.rating))}</select></label>
      <label>Project category<select name="category">${opt(SG.projectTypes, x.category)}</select></label><label class="wide">Review<textarea name="review" rows="4" required maxlength="500">${E(x.review)}</textarea></label>
      <div class="wide row end"><button class="btn ghost" type="button" data-close>Cancel</button><button class="btn primary" type="submit">Save testimonial</button></div></form>`);
    const f = d.querySelector('form');
    f.onsubmit = ev => {
      ev.preventDefault(); const errs = []; if (!f.name.value.trim()) errs.push('Customer name is required.'); if (!f.review.value.trim()) errs.push('Review text is required.');
      if (!formErrors(d, errs)) return; const all = SG.store.getTestimonials();
      const rec = { id: isNew ? SG.uid('t') : x.id, name: f.name.value.trim(), review: f.review.value.trim(), rating: Number(f.rating.value), category: f.category.value };
      const ok = SG.store.saveTestimonials(isNew ? [rec, ...all] : all.map(a => a.id === x.id ? rec : a)); d.close(); saved(ok); rerender();
    };
  }
  function enquiryView(e) {
    const d = SG.dialog.open(`<h2>${E(e.name)}</h2><div class="kv"><div><span>Phone</span><b>${E(e.phone)}</b></div><div><span>Email</span><b>${E(e.email || '-')}</b></div><div><span>Location</span><b>${E(e.location)}</b></div><div><span>Type</span><b>${E(e.type)}</b></div><div><span>Source</span><b>${E(e.source || '-')}</b></div><div><span>Submitted</span><b>${SG.date(e.createdAt)}</b></div></div>
      ${e.products ? `<h3>Requested products</h3><p>${E(e.products)}</p>` : ''}${e.calc ? `<h3>Calculator result</h3><p>${E(e.calc)}</p>` : ''}${e.message ? `<h3>Message</h3><p>${E(e.message)}</p>` : ''}
      <label class="lbl" for="en-notes">Internal demo notes</label><textarea id="en-notes" rows="3" maxlength="500">${E(e.notes || '')}</textarea><div class="row end"><button class="btn ghost" data-close type="button">Close</button><button class="btn primary" id="en-save" type="button">Save notes</button></div>`);
    d.querySelector('#en-save').onclick = () => { const all = SG.store.getEnquiries(); const ok = SG.store.saveEnquiries(all.map(a => a.id === e.id ? { ...a, notes: d.querySelector('#en-notes').value.trim() } : a)); d.close(); saved(ok); };
  }

  /* ----- events ----- */
  document.addEventListener('click', async ev => {
    const b = ev.target.closest('[data-a]'); if (!b || b.tagName === 'SELECT') return; const a = b.dataset.a, id = b.closest('tr') && b.closest('tr').dataset.id;
    const del = async (label, kind, saveFn, getFn) => { if (await SG.dialog.confirm('Delete ' + label + '?', 'This removes it from this browser. You can restore sample data from Demo controls.', 'Delete')) { const ok = SG[kind][saveFn](SG.store[getFn]().filter(x => x.id !== id)); saved(ok); rerender(); } };
    if (a === 'p-new') productForm(); else if (a === 'p-edit') productForm(SG.store.getProducts().find(x => x.id === id));
    else if (a === 'p-del') del('this product', 'store', 'saveProducts', 'getProducts');
    else if (a === 'j-new') projectForm(); else if (a === 'j-edit') projectForm(SG.store.getProjects().find(x => x.id === id)); else if (a === 'j-del') del('this project', 'store', 'saveProjects', 'getProjects');
    else if (a === 't-new') testiForm(); else if (a === 't-edit') testiForm(SG.store.getTestimonials().find(x => x.id === id)); else if (a === 't-del') del('this testimonial', 'store', 'saveTestimonials', 'getTestimonials');
    else if (a === 'e-view') enquiryView(SG.store.getEnquiries().find(x => x.id === id)); else if (a === 'e-del') del('this enquiry', 'store', 'saveEnquiries', 'getEnquiries');
    else if (a === 'export') { const blob = new Blob([JSON.stringify(SG.store.exportAll(), null, 2)], { type: 'application/json' }), u = URL.createObjectURL(blob), l = document.createElement('a'); l.href = u; l.download = 'sungrid-demo-data.json'; l.click(); setTimeout(() => URL.revokeObjectURL(u), 1000); }
    else if (a === 'reset') { if (await SG.dialog.confirm('Reset all demo data?', 'Products, projects, testimonials, enquiries, the saved package and calculator will return to the original samples.', 'Reset')) { SG.store.resetDemoData(); SG.toast('Demo data reset'); route(); } }
  });
  document.addEventListener('change', ev => {
    const t = ev.target;
    if (t.dataset.a === 'e-status') { const id = t.closest('tr').dataset.id; saved(SG.store.saveEnquiries(SG.store.getEnquiries().map(e => e.id === id ? { ...e, status: t.value } : e))); }
    else if (t.id === 'imp') { const file = t.files[0], msg = $('#imp-msg'); if (!file) return; const r = new FileReader(); r.onload = () => { try { SG.store.importAll(JSON.parse(r.result)); msg.textContent = 'Import complete.'; SG.toast('Import complete'); } catch (e) { msg.textContent = 'Import failed: ' + e.message; } }; r.readAsText(file); }
    else if (t.id === 'pc') { q.products.cat = t.value; rerender(); } else if (t.id === 'es') { q.enquiries.st = t.value; rerender(); }
  });
  document.addEventListener('input', ev => {
    const t = ev.target; if (t.id === 'pq' || t.id === 'eq') { const k = t.id === 'pq' ? 'products' : 'enquiries'; q[k].q = t.value; const pos = t.selectionStart; rerender(); const n = $('#' + t.id); n.focus(); n.setSelectionRange(pos, pos); }
  });
  $('#side-btn').onclick = () => { const o = $('#side').classList.toggle('open'); $('#side-btn').setAttribute('aria-expanded', o); };
  window.addEventListener('hashchange', route); window.addEventListener('storage', route);
  document.querySelectorAll('[data-brand]').forEach(el => el.textContent = SG.config.brand);
  route();
})();
