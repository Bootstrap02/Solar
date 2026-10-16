/* Real photo library. Use any photo anywhere with the value "img:N" (N = 1 to 16), e.g. image: 'img:3'.
Open image-map.html in a browser to see every photo with its number. Photos are served by Cloudinary
with automatic format/size optimisation; if one fails to load the site falls back to a drawn illustration. */
window.SG = window.SG || {};
SG.images = {
  urls: [
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080159/images_zywdni.jpg',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080165/images_2_lhncy0.jpg',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080162/images_3_ezatzr.jpg',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080176/images_4_jglvou.jpg',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080166/images_5_if7ixr.jpg',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080167/images_6_djqr7j.jpg',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080163/images_7_p9ujnz.jpg',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080167/images_8_evdeur.jpg',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080174/images_9_yypi2h.jpg',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080171/images_10_y9j9bl.jpg',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080170/images_11_gqlynx.jpg',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080173/images_12_psoopf.jpg',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080176/images_13_xlldkg.jpg',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080176/images_14_ufgixg.jpg',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080167/200294370_NjIwLTM0Ni03ZTg3YTdjNmRi_czssnu.webp',
    'https://res.cloudinary.com/dtthdh8tb/image/upload/v1792080166/images_1_cdmr5x.jpg'
  ],
  // Photo-role assignments: maps photo number (1-16) to role name.
  // These defaults can be changed via photo-assign.html or by editing this assignment.
  assign: {
    1: 'hero',
    2: 'about',
    3: 'panels',
    4: 'inverters',
    5: 'lithium',
    6: 'tubular',
    7: 'controllers',
    8: 'protection',
    9: 'accessories',
    10: 'systems',
    11: 'project-1',
    12: 'project-2',
    13: 'project-3',
    14: 'project-4',
    15: 'project-5',
    16: 'project-6'
  },
  // Which photo each role uses (documentation/helper - read-only).
  hero: 'img:1',
  about: 'img:2',
  panels: 'img:3',
  inverters: 'img:4',
  lithium: 'img:5',
  tubular: 'img:6',
  controllers: 'img:7',
  protection: 'img:8',
  accessories: 'img:9',
  systems: 'img:10',
  project1: 'img:11',
  project2: 'img:12',
  project3: 'img:13',
  project4: 'img:14',
  project5: 'img:15',
  project6: 'img:16'
};

SG.images.url = (n, w) => {
  const u = SG.images.urls[n - 1];
  return u ? u.replace('/upload/', '/upload/f_auto,q_auto,w_' + (w || 900) + '/') : '';
};

SG.images.KEY = 'sungrid.v2.photomap';
SG.images.roleMap = function () {
  const m = Object.assign({}, SG.images.assign);
  try { const o = JSON.parse(localStorage.getItem(SG.images.KEY)); if (o && typeof o === 'object') Object.assign(m, o); } catch (e) { /* ignore */ }
  return m;
};
SG.images.forRole = function (role) {
  return Object.entries(SG.images.roleMap()).filter(e => e[1] === role).map(e => Number(e[0])).sort((a, b) => a - b);
};
SG.images.first = function (role, fallback) { const l = SG.images.forRole(role); return l.length ? 'img:' + l[0] : fallback; };

// Public-site views of the data: same records, with assigned photos applied (admin data is never changed)
SG.pub = {
  products() {
    const cnt = {};
    return SG.store.getProducts().map(p => {
      if (!String(p.image).startsWith('art:')) return p;
      const ph = SG.images.forRole(p.category); if (!ph.length) return p;
      const i = cnt[p.category] = (cnt[p.category] || 0); cnt[p.category]++;
      return Object.assign({}, p, { image: 'img:' + ph[i % ph.length] });
    });
  },
  projects() {
    return SG.store.getProjects().map(p => {
      const m = /^j-(\d)$/.exec(p.id); if (!m) return p;
      const ph = SG.images.forRole('project-' + m[1]);
      return ph.length ? Object.assign({}, p, { image: 'img:' + ph[0] }) : p;
    });
  }
};