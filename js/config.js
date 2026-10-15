/* ===== SunGrid Energy demo — business configuration =====
   Change everything about the business HERE (name, contacts, pricing rules, calculator assumptions). */
window.SG = window.SG || {};
SG.config = {
  brand: 'SunGrid Energy',
  tagline: 'Smarter Solar. Reliable Power.',
  // WhatsApp number: international format, digits only, e.g. '2348012345678'. Leave '' until you have one.
  whatsapp: '',
  phoneDisplay: '+234 800 000 0000 (demo)',
  phoneLink: '',                       // e.g. '+2348012345678' (leave '' to disable click-to-call)
  email: 'orders@sungrid-demo.example', // quotation requests can be sent by email to this address
  serviceAreas: ['Lagos Island', 'Lekki & Ajah', 'Ikeja & Maryland', 'Surulere & Yaba', 'Ikorodu', 'Badagry'],
  // Sample pricing rules (all fictional)
  pricing: { installationRate: 0.10, deliveryFlat: 45000 },
  // Calculator assumptions — all editable
  calc: {
    peakSunHours: 5,          // equivalent full-sun hours per day (sample)
    performanceRatio: 0.75,   // real-world losses on the solar array
    inverterEfficiency: 0.92,
    batteryUsableFraction: 0.90, // lithium usable depth of discharge
    batteryDischargeEff: 0.95,
    inverterMargin: 1.25,     // headroom above estimated simultaneous load
    powerFactor: 0.8,         // kW = kVA x power factor
    panelWatts: 550,
    simultaneity: {           // share of connected load assumed to run together
      lighting: 0.85, essential: 0.70, full: 0.60, office: 0.75, shop: 0.70, custom: 0.70
    },
    inverterSizesKva: [1.5, 3.5, 5, 7.5, 10]
  }
};
SG.config.waReady = function () { return /^\d{10,15}$/.test(SG.config.whatsapp || ''); };
