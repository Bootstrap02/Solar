/* Quotation, enquiry and site-assessment forms (client-side only; saved to local demo storage). */
(function () {
  const SG = window.SG = window.SG || {};
  const E = SG.esc;
  const fld = (name, label, o = {}) => {
    const id = 'f-' + (o.prefix || '') + name, t = o.type || 'text';
    const req = o.req ? ' required aria-required="true"' : '';
    let input;
    if (t === 'select') input = `<select id="${id}" name="${name}"${req}>${o.options.map(x => `<option${x === (o.value || '') ? ' selected' : ''}>${E(x)}</option>`).join('')}</select>`;
    else if (t === 'textarea') input = `<textarea id="${id}" name="${name}" rows="${o.rows || 3}" maxlength="800"${req}>${E(o.value || '')}</textarea>`;
    else input = `<input id="${id}" name="${name}" type="${t}" maxlength="120" autocomplete="${o.ac || 'off'}" ${o.min ? 'min="' + o.min + '"' : ''}${req} value="${E(o.value || '')}" ${o.ph ? 'placeholder="' + E(o.ph) + '"' : ''}>`;
    return `<div class="field ${o.wide ? 'wide' : ''}"><label for="${id}">${E(label)}${o.req ? '' : ' <span class="muted small">(optional)</span>'}</label>${input}<span class="ferr" id="${id}-err" role="alert"></span></div>`;
  };
  const NOTICE = '<p class="demo-note">Demo form: your details are saved only in this browser as a sample enquiry. Nothing is sent to a real company. Do not enter real personal data.</p>';
  const today = () => new Date().toISOString().slice(0, 10);

  function html(kind, ctx = {}, prefix = '') {
    const p = { prefix };
    if (kind === 'quote') return `<form class="form" novalidate data-kind="quote">
      ${ctx.products || ctx.calc ? `<div class="ctx"><b>Included in this request</b>${ctx.products ? `<p>${E(ctx.products)}</p>` : ''}${ctx.calc ? `<p>${E(ctx.calc)}</p>` : ''}</div>` : ''}
      <div class="fgrid">${fld('name', 'Full name', { ...p, req: 1, ac: 'name' })}${fld('phone', 'Phone number', { ...p, req: 1, type: 'tel', ac: 'tel', ph: '0801 234 5678' })}
      ${fld('email', 'Email address', { ...p, type: 'email', ac: 'email' })}${fld('location', 'State or area', { ...p, req: 1, ph: 'e.g. Lekki, Lagos' })}
      ${fld('requirement', 'Residential or commercial', { ...p, type: 'select', options: ['Residential', 'Commercial'], req: 1 })}${fld('contactMethod', 'Preferred contact method', { ...p, type: 'select', options: ['WhatsApp', 'Phone call', 'Email'], req: 1 })}
      ${fld('message', 'Additional message', { ...p, type: 'textarea', wide: 1 })}</div>${NOTICE}
      <div class="row end"><button class="btn ghost" type="button" data-close>Cancel</button><button class="btn primary" type="submit">Request quotation</button></div></form>`;
    if (kind === 'assess') return `<form class="form" novalidate data-kind="assess">
      ${ctx.calc ? `<div class="ctx"><b>Calculator result attached</b><p>${E(ctx.calc)}</p></div>` : ''}
      <div class="fgrid">${fld('name', 'Full name', { ...p, req: 1, ac: 'name' })}${fld('phone', 'Phone number', { ...p, req: 1, type: 'tel', ac: 'tel' })}
      ${fld('location', 'Property location', { ...p, req: 1 })}${fld('propertyType', 'Property type', { ...p, type: 'select', req: 1, options: ['Home', 'Apartment', 'Shop', 'Office', 'Warehouse or factory', 'Farm or borehole'] })}
      ${fld('date', 'Preferred date', { ...p, type: 'date', min: today() })}${fld('time', 'Preferred contact time', { ...p, type: 'select', options: ['Any time', 'Morning', 'Afternoon', 'Evening'] })}
      ${fld('message', 'Additional information', { ...p, type: 'textarea', wide: 1 })}</div>${NOTICE}
      <div class="row end"><button class="btn primary" type="submit">Request site assessment</button></div></form>`;
    return `<form class="form" novalidate data-kind="contact"><div class="fgrid">${fld('name', 'Full name', { ...p, req: 1, ac: 'name' })}${fld('phone', 'Phone number', { ...p, req: 1, type: 'tel', ac: 'tel' })}
      ${fld('email', 'Email address', { ...p, type: 'email', ac: 'email' })}${fld('location', 'Location', { ...p, req: 1 })}
      ${fld('type', 'Type of enquiry', { ...p, type: 'select', options: SG.enquiryTypes, req: 1, wide: 1 })}${fld('message', 'Message', { ...p, type: 'textarea', req: 1, wide: 1 })}</div>${NOTICE}
      <div class="row end"><button class="btn primary" type="submit">Send demo enquiry</button></div></form>`;
  }

  const phoneOk = v => { const s = v.replace(/[\s\-().]/g, ''); return /^(\+?234|0)[789][01]\d{8}$/.test(s) || /^\+?\d{8,15}$/.test(s); };
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  function validate(form) {
    let ok = true, first = null;
    form.querySelectorAll('input,select,textarea').forEach(el => {
      const err = form.querySelector('#' + el.id + '-err'); let m = '';
      const v = el.value.trim();
      if (el.required && !v) m = 'This field is required.';
      else if (el.name === 'phone' && v && !phoneOk(v)) m = 'Enter a valid phone number, e.g. 0801 234 5678 or +234 801 234 5678.';
      else if (el.name === 'email' && v && !emailOk(v)) m = 'Enter a valid email address or leave it empty.';
      if (err) err.textContent = m;
      el.setAttribute('aria-invalid', m ? 'true' : 'false'); if (el.setAttribute) el.setAttribute('aria-describedby', m ? err.id : '');
      if (m) { ok = false; first = first || el; }
    });
    if (first) first.focus();
    return ok;
  }
  function data(form) { const o = {}; new FormData(form).forEach((v, k) => o[k] = String(v).trim()); return o; }

  function bind(form, ctx, onSaved) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (form.dataset.busy) return;                  // prevents duplicate submissions
      if (!validate(form)) return;
      form.dataset.busy = '1';
      const btn = form.querySelector('[type=submit]'); const label = btn.textContent; btn.disabled = true; btn.textContent = 'Saving...';
      const f = data(form), kind = form.dataset.kind;
      const enq = { id: SG.uid('e'), name: f.name, phone: f.phone, email: f.email || '', location: f.location,
        type: kind === 'assess' ? 'Request a solar assessment' : kind === 'contact' ? f.type : ctx.source === 'Package builder' ? 'Purchase solar equipment' : (f.requirement === 'Commercial' ? 'Install solar at my business' : 'Install solar at my home'),
        source: kind === 'assess' ? 'Site assessment form' : kind === 'contact' ? 'Contact form' : (ctx.source || 'Quote form'),
        products: ctx.products || '', calc: ctx.calc || '', message: [f.message, f.contactMethod ? 'Preferred contact: ' + f.contactMethod : '', f.propertyType ? 'Property: ' + f.propertyType : '', f.date ? 'Preferred date: ' + f.date : '', f.time && f.time !== 'Any time' ? 'Time: ' + f.time : ''].filter(Boolean).join(' | '),
        status: 'New', notes: '', createdAt: new Date().toISOString() };
      setTimeout(() => {
        const saved = SG.store.addEnquiry(enq);
        const waMsg = kind === 'assess' ? SG.msg.assessment({ ...f, message: (ctx.calc ? ctx.calc + '\n' : '') + (f.message || '') }) : (ctx.waMessage || `Hello ${SG.config.brand}, my name is ${f.name}. ${f.message || ''}`);
        onSaved(enq, waMsg, saved);
      }, 450);
    });
  }
  function success(enq, waMsg, saved) {
    const mail = SG.wa.mailto('Solar quotation request from ' + enq.name, waMsg + '\n\nPhone: ' + enq.phone + '\nLocation: ' + enq.location);
    return `<div class="success"><div class="ok-mark" aria-hidden="true">✓</div><h2>Demo request saved</h2>
      <p>This is a demonstration site, so your request was <b>saved in this browser only</b> and was <b>not sent to any company</b>. A real SunGrid-style site would deliver it to the business inbox.</p>
      <p class="muted">To see how a visitor could continue with the business right now:</p>
      <div class="row"><button class="btn wa" type="button" data-wa>Continue on WhatsApp</button><a class="btn ghost" href="${E(mail)}">Send by email</a></div>
      <p class="muted small">${saved ? '' : 'Your browser blocked local storage, so this request was not saved. '}Open <a href="admin.html#enquiries">the admin demo</a> to see it in the enquiry inbox.</p></div>`;
  }
  SG.forms = {
    html, bind,
    openQuote(ctx) {
      ctx = ctx || {};
      const d = SG.dialog.open(`<h2>Request a quotation</h2><p class="muted">This is an estimate request, not an order. No payment is taken.</p>${html('quote', ctx, 'q-')}`);
      bind(d.querySelector('form'), ctx, (enq, waMsg, saved) => { d.querySelector('.modal-body').innerHTML = success(enq, waMsg, saved); d.querySelector('[data-wa]').onclick = () => SG.wa.open(waMsg); });
    },
    openAssessment(ctx) {
      ctx = ctx || {};
      const d = SG.dialog.open(`<h2>Book a site assessment</h2><p class="muted">An engineer visits, measures and confirms the right system. This demo only records your request locally.</p>${html('assess', ctx, 'a-')}`);
      bind(d.querySelector('form'), ctx, (enq, waMsg, saved) => { d.querySelector('.modal-body').innerHTML = success(enq, waMsg, saved); d.querySelector('[data-wa]').onclick = () => SG.wa.open(waMsg); });
    },
    mountPage(container, kind, prefix) {
      container.innerHTML = html(kind, {}, prefix);
      const form = container.querySelector('form');
      bind(form, {}, (enq, waMsg, saved) => { container.innerHTML = success(enq, waMsg, saved) + '<div class="row"><button class="btn ghost" type="button" data-again>Send another</button></div>'; container.querySelector('[data-wa]').onclick = () => SG.wa.open(waMsg); container.querySelector('[data-again]').onclick = () => SG.forms.mountPage(container, kind, prefix); });
    }
  };
})();
