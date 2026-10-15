/* Shared helpers: escaping, formatting, toasts, dialogs, WhatsApp/email messaging. */
(function () {
  const SG = window.SG = window.SG || {};
  SG.esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  SG.fmt = n => '₦' + Math.round(n).toLocaleString('en-NG');
  SG.num = (n, d = 1) => (Math.round(n * Math.pow(10, d)) / Math.pow(10, d)).toLocaleString('en-NG', { maximumFractionDigits: d });
  SG.date = iso => { try { return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; } };
  SG.uid = p => p + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  SG.$ = (s, r) => (r || document).querySelector(s);
  SG.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  SG.img = (v, alt, cls) => `<img class="${cls || ''}" src="${SG.esc(SG.art.src(v))}" alt="${SG.esc(alt || '')}" loading="lazy">`;
  SG.price = p => p.pricingMode === 'quote-only' || !p.price ? 'Request price' : SG.fmt(p.price);

  // broken image fallback
  document.addEventListener('error', e => {
    const t = e.target;
    if (t && t.tagName === 'IMG' && !t.dataset.fb) { t.dataset.fb = '1'; t.src = SG.art.src('art:system'); }
  }, true);

  // toasts
  SG.toast = (msg, type) => {
    let box = document.getElementById('toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    const t = document.createElement('div'); t.className = 'toast ' + (type || ''); t.textContent = msg; box.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 3200);
  };

  // dialogs (single reusable <dialog>)
  SG.dialog = {
    el() {
      let d = document.getElementById('sg-dialog');
      if (!d) {
        d = document.createElement('dialog'); d.id = 'sg-dialog'; d.className = 'modal';
        d.innerHTML = '<div class="modal-inner"><button class="modal-x" type="button" data-close aria-label="Close dialog">&times;</button><div class="modal-body"></div></div>';
        document.body.appendChild(d);
        d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
      }
      return d;
    },
    open(html, opts) {
      const d = this.el(); d.classList.toggle('wide', !!(opts && opts.wide));
      d.querySelector('.modal-body').innerHTML = html;
      if (!d.open) d.showModal();
      d.querySelector('.modal-inner').scrollTop = 0;
      return d;
    },
    close() { const d = document.getElementById('sg-dialog'); if (d && d.open) d.close(); },
    confirm(title, text, okLabel) {
      return new Promise(res => {
        const d = this.open(`<h2>${SG.esc(title)}</h2><p>${SG.esc(text)}</p><div class="row end"><button class="btn ghost" data-close type="button">Cancel</button><button class="btn danger" id="confirm-ok" type="button">${SG.esc(okLabel || 'Confirm')}</button></div>`);
        let done = false;
        d.querySelector('#confirm-ok').onclick = () => { done = true; d.close(); res(true); };
        d.addEventListener('close', () => { if (!done) res(false); }, { once: true });
      });
    }
  };

  // contact / messaging
  const msgs = SG.msg = {
    general: () => `Hello ${SG.config.brand}, I would like to ask about solar equipment and installation.`,
    product: p => `Hello ${SG.config.brand}, I am interested in the ${p.name} (${p.model}). Please send me the price, availability and installation options.`,
    pkg(items, t) {
      let m = `Hello ${SG.config.brand}, I would like a quotation for this solar package:\n`;
      items.forEach(i => { m += `- ${i.qty} x ${i.name}${i.quote ? ' (price on request)' : ' @ ' + SG.fmt(i.unit)}\n`; });
      m += t.complete ? `Estimated equipment total: ${SG.fmt(t.equipment)}.` : `Equipment subtotal for priced items: ${SG.fmt(t.equipment)}; some items need individual quotes.`;
      if (t.install) m += `\nInstallation requested (est. ${SG.fmt(t.install)}).`;
      if (t.delivery) m += `\nDelivery requested.`;
      return m + '\nThis is an estimate request, not an order. Please confirm prices and availability.';
    },
    calc(r) {
      let m = `Hello ${SG.config.brand}, I used your solar calculator and would like a professional assessment and quotation.\n`;
      m += `Appliances: ${r.items.map(i => i.qty + ' x ' + i.name).join(', ')}.\n`;
      m += `Connected load: ${SG.num(r.connectedW / 1000, 2)} kW. Estimated simultaneous load: ${SG.num(r.simW / 1000, 2)} kW.\n`;
      m += `Daily energy: ${SG.num(r.dailyKwh, 1)} kWh. Backup wanted: ${r.backupHours} hours.\n`;
      m += `Estimate: ${r.inverterLabel} inverter, about ${r.batteryKwh} kWh battery, about ${SG.num(r.arrayKwp, 1)} kWp solar (${r.panels} x ${r.panelW}W panels).`;
      return m;
    },
    assessment: f => `Hello ${SG.config.brand}, I would like to book a site assessment.\nName: ${f.name}\nLocation: ${f.location}\nProperty: ${f.propertyType || '-'}\nPreferred date: ${f.date || '-'}\nTime: ${f.time || '-'}\n${f.message || ''}`
  };
  SG.wa = {
    open(message) {
      if (SG.config.waReady()) { window.open('https://wa.me/' + SG.config.whatsapp + '?text=' + encodeURIComponent(message), '_blank', 'noopener'); return; }
      const d = SG.dialog.open(`<h2>WhatsApp number not set yet</h2>
        <p>This demo has no real business WhatsApp number. When you customise the site for a client, add their number in <code>js/config.js</code> (field <code>whatsapp</code>), and this button will open WhatsApp with the message below already typed.</p>
        <label class="lbl" for="wa-preview">Message that would be sent</label><textarea id="wa-preview" rows="9" readonly>${SG.esc(message)}</textarea>
        <div class="row end"><button class="btn ghost" data-close type="button">Close</button><button class="btn primary" id="wa-copy" type="button">Copy message</button></div>`);
      d.querySelector('#wa-copy').onclick = async () => { try { await navigator.clipboard.writeText(message); SG.toast('Message copied'); } catch (e) { d.querySelector('#wa-preview').select(); SG.toast('Select and copy the message', 'warn'); } };
    },
    mailto(subject, body) { return 'mailto:' + SG.config.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); }
  };
})();
