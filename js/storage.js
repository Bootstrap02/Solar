/* Local demo storage. Seed data is never edited; the editable copy lives in localStorage. */
(function () {
  const SG = window.SG = window.SG || {};
  const KEYS = { products: 'sungrid.v1.products', projects: 'sungrid.v1.projects', testimonials: 'sungrid.v1.testimonials',
    enquiries: 'sungrid.v1.enquiries', package: 'sungrid.v1.package', calc: 'sungrid.v1.calc' };
  const mem = {};            // fallback when localStorage is blocked
  const clone = v => JSON.parse(JSON.stringify(v));
  function rawGet(k) { try { return localStorage.getItem(k); } catch (e) { return mem[k] ?? null; } }
  function rawSet(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { mem[k] = v; return false; } }
  function rawDel(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } delete mem[k]; }
  const isStr = v => typeof v === 'string' && v.length > 0;
  const validators = {
    products: p => p && isStr(p.id) && isStr(p.name) && isStr(p.category) && typeof p.price === 'number' && p.price >= 0 && p.specifications && typeof p.specifications === 'object',
    projects: p => p && isStr(p.id) && isStr(p.title),
    testimonials: t => t && isStr(t.id) && isStr(t.name) && isStr(t.review),
    enquiries: e => e && isStr(e.id) && isStr(e.name)
  };
  function load(kind) {
    let data = null;
    try { data = JSON.parse(rawGet(KEYS[kind])); } catch (e) { data = null; }
    if (!Array.isArray(data)) { data = clone(SG.seed[kind]); rawSet(KEYS[kind], JSON.stringify(data)); return data; }
    return data.filter(validators[kind]);        // drop only malformed records, keep valid user changes
  }
  function save(kind, arr) { return rawSet(KEYS[kind], JSON.stringify(arr)); }
  SG.store = {
    KEYS, clone,
    getProducts: () => load('products'), saveProducts: a => save('products', a),
    getProjects: () => load('projects'), saveProjects: a => save('projects', a),
    getTestimonials: () => load('testimonials'), saveTestimonials: a => save('testimonials', a),
    getEnquiries: () => load('enquiries'), saveEnquiries: a => save('enquiries', a),
    getObj(key, fallback) { try { const v = JSON.parse(rawGet(KEYS[key])); return v && typeof v === 'object' ? v : fallback; } catch (e) { return fallback; } },
    setObj(key, v) { return rawSet(KEYS[key], JSON.stringify(v)); },
    addEnquiry(e) { const all = load('enquiries'); all.unshift(e); return save('enquiries', all); },
    resetDemoData() { ['products', 'projects', 'testimonials', 'enquiries', 'package', 'calc'].forEach(k => rawDel(KEYS[k])); },
    exportAll() { return { schema: 'sungrid-demo-v1', exportedAt: new Date().toISOString(), products: load('products'), projects: load('projects'), testimonials: load('testimonials'), enquiries: load('enquiries') }; },
    importAll(obj) {  // validates; never executes content
      if (!obj || obj.schema !== 'sungrid-demo-v1') throw new Error('Not a SunGrid demo export file.');
      for (const k of ['products', 'projects', 'testimonials', 'enquiries']) {
        if (!Array.isArray(obj[k])) throw new Error('Missing list: ' + k);
        if (!obj[k].every(validators[k])) throw new Error('Some ' + k + ' records are invalid.');
      }
      for (const k of ['products', 'projects', 'testimonials', 'enquiries']) save(k, obj[k]);
    },
    categoryLabel(id) { const c = SG.categories.find(x => x.id === id); return c ? c.label : 'Other'; }
  };
})();
