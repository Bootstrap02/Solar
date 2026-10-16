/* Locally generated SVG artwork — no external images needed, nothing to break offline. */
(function () {
  const SG = window.SG = window.SG || {};
  const uri = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  const defs = `<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CC8E8"/><stop offset=".75" stop-color="#FCE3B0"/></linearGradient>
<radialGradient id="sun"><stop offset="0" stop-color="#FFD36B"/><stop offset="1" stop-color="#FFD36B" stop-opacity="0"/></radialGradient>
<linearGradient id="cell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3A78B8"/><stop offset="1" stop-color="#16407A"/></linearGradient>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E6EFF3"/><stop offset="1" stop-color="#F8F6EF"/></linearGradient></defs>`;

  function grid(x, y, w, h, cols, rows, skew) {
    let s = `<g transform="translate(${x} ${y}) skewX(${skew || 0})"><rect width="${w}" height="${h}" rx="3" fill="#CBD5DC"/>`;
    const cw = (w - 6) / cols, ch = (h - 6) / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
      s += `<rect x="${3 + c * cw + 1}" y="${3 + r * ch + 1}" width="${cw - 2}" height="${ch - 2}" fill="url(#cell)"/>`;
    return s + '</g>';
  }
  function windows(x, y, w, h, cols, rows) {
    let s = ''; const cw = w / cols, ch = h / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
      s += `<rect x="${x + c * cw + 6}" y="${y + r * ch + 6}" width="${cw - 12}" height="${ch - 12}" rx="2" fill="${(r + c) % 3 === 0 ? '#FFD36B' : '#DDEBF2'}"/>`;
    return s;
  }
  function scene(type) {
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice">${defs}
<rect width="800" height="520" fill="url(#sky)"/><circle cx="640" cy="120" r="120" fill="url(#sun)"/><circle cx="640" cy="120" r="40" fill="#FFC53D"/>
<path d="M0 380 Q200 300 400 370 T800 340 V520 H0Z" fill="#B7DDBF"/><path d="M0 430 Q250 390 500 430 T800 420 V520 H0Z" fill="#7DBE94"/>`;
    const body = '#F5F3EC', dark = '#1B2B45';
    if (type === 'home') {
      s += `<rect x="190" y="290" width="400" height="150" fill="${body}"/><rect x="190" y="280" width="400" height="14" fill="${dark}"/><rect x="250" y="240" width="250" height="44" fill="${body}"/>
${grid(235, 190, 280, 62, 8, 2, -22)}${windows(215, 320, 200, 70, 3, 1)}<rect x="450" y="330" width="56" height="110" fill="${dark}"/><rect x="520" y="320" width="50" height="60" fill="#DDEBF2"/>`;
    } else if (type === 'office') {
      s += `<rect x="250" y="170" width="300" height="270" fill="${body}"/><rect x="240" y="160" width="320" height="14" fill="${dark}"/>${windows(262, 195, 276, 190, 5, 4)}<rect x="370" y="390" width="60" height="50" fill="${dark}"/>${grid(262, 108, 240, 52, 8, 2, -18)}`;
    } else if (type === 'shop') {
      s += `<rect x="120" y="300" width="560" height="140" fill="${body}"/><rect x="110" y="290" width="580" height="14" fill="${dark}"/>${grid(160, 238, 420, 52, 12, 2, -20)}<path d="M140 330h520l-18 40H158z" fill="#1F9D63"/><path d="M200 330l-12 40M300 330l-8 40M400 330l-4 40M500 330l4 40M600 330l8 40" stroke="#fff" stroke-width="10"/><rect x="160" y="380" width="200" height="60" fill="#DDEBF2"/><rect x="480" y="380" width="70" height="60" fill="${dark}"/>`;
    } else if (type === 'rooftop') {
      s += `<rect x="70" y="300" width="660" height="140" fill="${body}"/>${windows(90, 330, 620, 90, 10, 2)}<rect x="60" y="290" width="680" height="14" fill="${dark}"/>${grid(100, 232, 600, 56, 20, 2, -14)}${grid(86, 176, 560, 52, 18, 2, -14)}`;
    } else if (type === 'pump') {
      s += `${grid(90, 330, 300, 90, 8, 3, -10)}<rect x="560" y="290" width="90" height="120" rx="8" fill="#CBD5DC"/><rect x="560" y="360" width="90" height="50" fill="#4DA3D4"/><path d="M470 420H520V340H560" stroke="${dark}" stroke-width="10" fill="none"/><rect x="430" y="400" width="60" height="40" rx="6" fill="${dark}"/><path d="M0 470q50-18 100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0V520H0z" fill="#4DA3D4" opacity=".7"/>`;
    } else {
      s += `<rect x="90" y="270" width="250" height="170" fill="${body}"/><rect x="80" y="260" width="270" height="12" fill="${dark}"/>${windows(100, 290, 230, 120, 4, 2)}${grid(95, 206, 230, 50, 7, 2, -18)}
<rect x="400" y="200" width="300" height="240" fill="#E7EDF1"/><rect x="390" y="190" width="320" height="12" fill="${dark}"/>${windows(412, 225, 276, 170, 5, 3)}${grid(410, 138, 240, 48, 8, 2, -18)}`;
    }
    return uri(s + '</svg>');
  }
  function product(kind, badge) {
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" preserveAspectRatio="xMidYMid slice">${defs}<rect width="600" height="450" fill="url(#bg)"/><ellipse cx="300" cy="392" rx="190" ry="16" fill="#0B2545" opacity=".12"/>`;
    const navy = '#0B2545';
    if (kind === 'panel') s += grid(160, 60, 280, 310, 6, 10, -7);
    else if (kind === 'inverter') s += `<rect x="170" y="62" width="260" height="310" rx="22" fill="#E3EAEF" stroke="#B8C4CD" stroke-width="3"/><rect x="200" y="94" width="200" height="96" rx="10" fill="${navy}"/><path d="M216 160h40l14-34 16 50 14-26h72" stroke="#33D17A" stroke-width="5" fill="none"/><circle cx="214" cy="226" r="7" fill="#1F9D63"/><circle cx="240" cy="226" r="7" fill="#F5A524"/><circle cx="266" cy="226" r="7" fill="#B8C4CD"/><rect x="200" y="320" width="200" height="30" rx="6" fill="#B8C4CD"/><path d="M220 320v30M250 320v30M280 320v30" stroke="#E3EAEF" stroke-width="4"/>`;
    else if (kind === 'lithium') s += `<rect x="90" y="130" width="420" height="190" rx="16" fill="#1B2B45"/><rect x="90" y="130" width="420" height="40" rx="16" fill="#243A5E"/><rect x="120" y="212" width="180" height="14" rx="7" fill="#33D17A"/><rect x="120" y="242" width="120" height="10" rx="5" fill="#5B7399"/><circle cx="450" cy="250" r="26" fill="#243A5E"/><path d="M450 234v32M440 244l10-10 10 10" stroke="#F5A524" stroke-width="5" fill="none"/><rect x="130" y="300" width="60" height="20" fill="#0F1C30"/><rect x="410" y="300" width="60" height="20" fill="#0F1C30"/>`;
    else if (kind === 'tubular') s += [130, 330].map(x => `<rect x="${x}" y="110" width="150" height="250" rx="10" fill="#2A3B52"/><rect x="${x}" y="110" width="150" height="46" rx="10" fill="#3B5273"/><rect x="${x + 26}" y="86" width="26" height="26" fill="#F5A524"/><rect x="${x + 98}" y="86" width="26" height="26" fill="#C9D3DB"/><rect x="${x + 24}" y="200" width="102" height="70" rx="6" fill="#1F9D63"/>`).join('');
    else if (kind === 'controller') s += `<rect x="180" y="90" width="240" height="250" rx="16" fill="#EEF2F5" stroke="#B8C4CD" stroke-width="3"/><rect x="206" y="116" width="188" height="86" rx="8" fill="${navy}"/><path d="M222 180l30-40 26 26 40-34 40 30" stroke="#F5A524" stroke-width="5" fill="none"/><circle cx="230" cy="250" r="16" fill="#1F9D63"/><circle cx="300" cy="250" r="16" fill="#B8C4CD"/><circle cx="370" cy="250" r="16" fill="#B8C4CD"/><rect x="206" y="296" width="188" height="14" rx="4" fill="#B8C4CD"/>`;
    else if (kind === 'protection') s += `<rect x="100" y="150" width="400" height="140" rx="10" fill="#C9D3DB"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${120 + i * 76}" y="170" width="56" height="100" rx="6" fill="#fff" stroke="#8795A1" stroke-width="2"/><rect x="${136 + i * 76}" y="190" width="24" height="40" rx="3" fill="${i % 2 ? '#F5A524' : navy}"/>`).join('');
    else if (kind === 'accessory') s += `<path d="M110 300L490 300M110 330L490 330" stroke="#8795A1" stroke-width="12"/>` + [150, 250, 350, 450].map(x => `<rect x="${x - 6}" y="250" width="12" height="110" fill="#B8C4CD"/>`).join('') + `<circle cx="300" cy="170" r="70" fill="none" stroke="${navy}" stroke-width="16"/><circle cx="300" cy="170" r="44" fill="none" stroke="#F5A524" stroke-width="16"/>`;
    else s += `${grid(90, 70, 190, 130, 5, 3, -8)}<rect x="320" y="90" width="90" height="140" rx="12" fill="#E3EAEF" stroke="#B8C4CD" stroke-width="3"/><rect x="334" y="106" width="62" height="40" rx="5" fill="${navy}"/><rect x="430" y="130" width="90" height="100" rx="10" fill="#1B2B45"/><rect x="442" y="190" width="40" height="8" rx="4" fill="#33D17A"/><path d="M280 140H320M410 180H430" stroke="#F5A524" stroke-width="6"/><rect x="110" y="262" width="400" height="70" rx="14" fill="#fff" stroke="#D5DDE3"/><rect x="140" y="288" width="140" height="10" rx="5" fill="#C9D3DB"/><rect x="140" y="308" width="90" height="8" rx="4" fill="#E1E7EB"/>`;
    if (badge) s += `<g><rect x="${kind === 'system' ? 380 : 400}" y="${kind === 'system' ? 280 : 340}" width="150" height="44" rx="22" fill="${navy}"/><text x="${kind === 'system' ? 455 : 475}" y="${kind === 'system' ? 309 : 369}" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#FFC53D" text-anchor="middle">${String(badge).replace(/[<>&]/g, '')}</text></g>`;
    return uri(s + '</svg>');
  }
  SG.art = {
    productKinds: ['panel', 'inverter', 'lithium', 'tubular', 'controller', 'protection', 'accessory', 'system'],
    sceneKinds: ['home', 'office', 'shop', 'rooftop', 'pump', 'mixed'],
    src(v) {
      v = String(v || '');
      if (v.startsWith('art:')) { const p = v.split(':'); return product(p[1], p.slice(2).join(':')); }
      if (v.startsWith('scene:')) return scene(v.slice(6));
      if (v.startsWith('img:')) { const n = Number(v.slice(4)); return SG.images ? SG.images.url(n) : product('system', ''); }
      if (v.startsWith('data:image/') || /^[\w./-]+\.(png|jpe?g|webp|svg)$/i.test(v)) return v;
      return product('system', '');
    }
  };
})();
