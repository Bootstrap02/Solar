/* ===== ALL SAMPLE DATA — fictional. Edit prices, products, projects, testimonials here. ===== */
window.SG = window.SG || {};
SG.categories = [
  { id: 'panels', label: 'Solar panels', art: 'panel', blurb: 'Mono and bifacial panels, 450W to 600W' },
  { id: 'inverters', label: 'Hybrid inverters', art: 'inverter', blurb: '1.5kVA to 15kVA, single and three phase' },
  { id: 'lithium', label: 'Lithium batteries', art: 'lithium', blurb: 'LiFePO4 rack and wall batteries' },
  { id: 'tubular', label: 'Tubular batteries', art: 'tubular', blurb: 'Deep-cycle 12V and 2V cells' },
  { id: 'controllers', label: 'Charge controllers', art: 'controller', blurb: 'MPPT controllers, 60A and 100A' },
  { id: 'protection', label: 'Protection equipment', art: 'protection', blurb: 'Breakers, surge protection, isolators' },
  { id: 'accessories', label: 'Cables and mounting', art: 'accessory', blurb: 'PV cable, rails, brackets' },
  { id: 'systems', label: 'Complete systems', art: 'system', blurb: 'Home and business packages' }
];
SG.availabilityLabels = { 'in-stock': 'In stock', 'low-stock': 'Low stock', 'pre-order': 'Pre-order', 'out-of-stock': 'Out of stock' };
SG.projectTypes = ['Residential', 'Commercial', 'Industrial', 'Solar pumping'];
SG.enquiryStatuses = ['New', 'Contacted', 'Assessment Scheduled', 'Quotation Sent', 'Completed'];
SG.enquiryTypes = ['Purchase solar equipment', 'Install solar at my home', 'Install solar at my business', 'Request a solar assessment', 'Request a maintenance service', 'Become a distributor'];

(function () {
  const P = (id, category, brand, model, name, price, rating, avail, featured, specs, warranty, desc, badge, mode) => ({
    id, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), category, brand, model, description: desc,
    image: 'art:' + (SG.categories.find(c => c.id === category).art) + ':' + badge, price, pricingMode: mode || 'show-price',
    availability: avail, featured: !!featured, specifications: specs, warranty, tags: [category, brand.toLowerCase()], rating
  });
  const products = [
    P('p-panel-450', 'panels', 'Helios', 'HM-450', 'Helios Mono 450W Solar Panel', 135000, 450, 'in-stock', false,
      { 'Rated power': '450 W', 'Cell technology': 'Monocrystalline PERC', 'Efficiency': '20.7%', 'Dimensions': '2094 x 1038 x 35 mm', 'Weight': '23.5 kg' }, '12-year product, 25-year performance (sample)', 'Reliable mid-size panel for homes and small shops.', '450W'),
    P('p-panel-550', 'panels', 'Helios', 'HM-550', 'Helios Mono 550W Solar Panel', 172000, 550, 'in-stock', true,
      { 'Rated power': '550 W', 'Cell technology': 'Monocrystalline half-cut', 'Efficiency': '21.3%', 'Dimensions': '2278 x 1134 x 35 mm', 'Weight': '27.5 kg' }, '12-year product, 25-year performance (sample)', 'Our most popular panel. High output per roof area.', '550W'),
    P('p-panel-600', 'panels', 'SolMax', 'SX-600B', 'SolMax Bifacial 600W Solar Panel', 205000, 600, 'low-stock', false,
      { 'Rated power': '600 W', 'Cell technology': 'N-type bifacial', 'Efficiency': '22.1%', 'Dimensions': '2384 x 1134 x 33 mm', 'Weight': '32 kg' }, '15-year product, 30-year performance (sample)', 'Bifacial design for ground-mount and commercial roofs.', '600W'),
    P('p-inv-1500', 'inverters', 'VoltEdge', 'VE-1.5H', 'VoltEdge Hybrid Inverter 1.5kVA', 310000, 1.5, 'in-stock', false,
      { 'Rated capacity': '1.5 kVA / 1.2 kW', 'Output voltage': '230 V AC, 50 Hz', 'Battery voltage': '12 V', 'Battery compatibility': 'Lithium and tubular', 'Solar input': 'Up to 1000 W PV', 'System type': 'Single-phase hybrid' }, '2 years (sample)', 'Compact hybrid inverter for lights, fans and TV.', '1.5kVA'),
    P('p-inv-3500', 'inverters', 'VoltEdge', 'VE-3.5H', 'VoltEdge Hybrid Inverter 3.5kVA', 620000, 3.5, 'in-stock', false,
      { 'Rated capacity': '3.5 kVA / 2.8 kW', 'Output voltage': '230 V AC, 50 Hz', 'Battery voltage': '24 V', 'Battery compatibility': 'Lithium and tubular', 'Solar input': 'Up to 4000 W PV', 'System type': 'Single-phase hybrid' }, '2 years (sample)', 'Great starter for a flat or small home.', '3.5kVA'),
    P('p-inv-5000', 'inverters', 'VoltEdge', 'VE-5H', 'VoltEdge Hybrid Inverter 5kVA', 890000, 5, 'in-stock', true,
      { 'Rated capacity': '5 kVA / 4 kW', 'Output voltage': '230 V AC, 50 Hz', 'Battery voltage': '48 V', 'Battery compatibility': 'Lithium and tubular', 'Solar input': 'Up to 6500 W PV', 'System type': 'Single-phase hybrid' }, '2 years (sample)', 'The everyday choice for a three-bedroom home.', '5kVA'),
    P('p-inv-7500', 'inverters', 'VoltEdge', 'VE-7.5H', 'VoltEdge Hybrid Inverter 7.5kVA', 1350000, 7.5, 'in-stock', false,
      { 'Rated capacity': '7.5 kVA / 6 kW', 'Output voltage': '230 V AC, 50 Hz', 'Battery voltage': '48 V', 'Battery compatibility': 'Lithium', 'Solar input': 'Up to 9000 W PV', 'System type': 'Single-phase hybrid' }, '2 years (sample)', 'For larger homes, small offices and shops.', '7.5kVA'),
    P('p-inv-10000', 'inverters', 'VoltEdge', 'VE-10H', 'VoltEdge Hybrid Inverter 10kVA', 1850000, 10, 'low-stock', false,
      { 'Rated capacity': '10 kVA / 8 kW', 'Output voltage': '230 V AC, 50 Hz', 'Battery voltage': '48 V', 'Battery compatibility': 'Lithium', 'Solar input': 'Up to 12000 W PV', 'System type': 'Single-phase hybrid, parallel-ready' }, '2 years (sample)', 'Heavy-duty inverter for compounds and commercial use.', '10kVA'),
    P('p-inv-15000', 'inverters', 'VoltEdge', 'VE-15T', 'VoltEdge Three-Phase Inverter 15kVA', 0, 15, 'pre-order', false,
      { 'Rated capacity': '15 kVA / 12 kW', 'Output voltage': '400 V AC three-phase', 'Battery voltage': '192-500 V HV', 'Battery compatibility': 'High-voltage lithium', 'Solar input': 'Up to 20 kW PV', 'System type': 'Three-phase hybrid' }, '3 years (sample)', 'Three-phase hybrid for commercial sites. Priced after site survey.', '15kVA', 'quote-only'),
    P('p-li-5', 'lithium', 'AmpCore', 'AC-48-100', 'AmpCore LiFePO4 Battery 5kWh', 1250000, 5, 'in-stock', true,
      { 'Chemistry': 'LiFePO4', 'Nominal voltage': '51.2 V', 'Capacity': '100 Ah / 5.12 kWh', 'Usable energy': '4.6 kWh (90% DoD)', 'Cycle life': '6000 cycles to 80% (sample)', 'Compatibility': '48 V hybrid inverters' }, '5 years (sample)', 'Rack-mount module. Stack several for more storage.', '5kWh'),
    P('p-li-10', 'lithium', 'AmpCore', 'AC-48-200', 'AmpCore LiFePO4 Battery 10kWh', 2300000, 10, 'in-stock', false,
      { 'Chemistry': 'LiFePO4', 'Nominal voltage': '51.2 V', 'Capacity': '200 Ah / 10.24 kWh', 'Usable energy': '9.2 kWh (90% DoD)', 'Cycle life': '6000 cycles to 80% (sample)', 'Compatibility': '48 V hybrid inverters' }, '5 years (sample)', 'Single-box 10kWh storage for larger homes.', '10kWh'),
    P('p-li-15', 'lithium', 'AmpCore', 'AC-48-300W', 'AmpCore LiFePO4 Wall Battery 15kWh', 3300000, 15, 'pre-order', false,
      { 'Chemistry': 'LiFePO4', 'Nominal voltage': '51.2 V', 'Capacity': '300 Ah / 15.36 kWh', 'Usable energy': '13.8 kWh (90% DoD)', 'Cycle life': '6000 cycles to 80% (sample)', 'Compatibility': '48 V hybrid inverters' }, '5 years (sample)', 'Wall-mounted high-capacity battery.', '15kWh'),
    P('p-tub-200', 'tubular', 'DeepCell', 'DC-12-200T', 'DeepCell Tubular Battery 12V 200Ah', 285000, 2.4, 'in-stock', false,
      { 'Chemistry': 'Lead-acid tubular plate', 'Nominal voltage': '12 V', 'Capacity': '200 Ah (C10)', 'Energy': '2.4 kWh nominal', 'Recommended depth of discharge': '50%', 'Compatibility': '12 V, 24 V, 48 V banks' }, '2 years (sample)', 'Affordable deep-cycle storage.', '200Ah'),
    P('p-tub-220', 'tubular', 'DeepCell', 'DC-12-220T', 'DeepCell Tubular Battery 12V 220Ah', 320000, 2.64, 'low-stock', false,
      { 'Chemistry': 'Lead-acid tubular plate', 'Nominal voltage': '12 V', 'Capacity': '220 Ah (C10)', 'Energy': '2.64 kWh nominal', 'Recommended depth of discharge': '50%', 'Compatibility': '12 V, 24 V, 48 V banks' }, '2 years (sample)', 'Slightly larger tubular option.', '220Ah'),
    P('p-tub-opzs', 'tubular', 'DeepCell', 'DC-2-1000', 'DeepCell OPzS 2V 1000Ah Cell', 0, 2, 'pre-order', false,
      { 'Chemistry': 'Flooded OPzS', 'Nominal voltage': '2 V per cell', 'Capacity': '1000 Ah (C10)', 'Energy': '2 kWh per cell', 'Service life': '15+ years at 25 C (sample)' }, '3 years (sample)', 'Industrial stationary cell. Quoted per bank.', '2V 1000Ah', 'quote-only'),
    P('p-mppt-60', 'controllers', 'VoltEdge', 'MP-60', 'VoltEdge MPPT Charge Controller 60A', 210000, 60, 'in-stock', false,
      { 'Product type': 'MPPT charge controller', 'Charge current': '60 A', 'Battery voltage': '12 / 24 / 48 V auto', 'Max PV input': '150 V', 'Display': 'LCD with Bluetooth' }, '2 years (sample)', 'Standalone controller for off-grid battery banks.', '60A'),
    P('p-mppt-100', 'controllers', 'VoltEdge', 'MP-100', 'VoltEdge MPPT Charge Controller 100A', 420000, 100, 'in-stock', false,
      { 'Product type': 'MPPT charge controller', 'Charge current': '100 A', 'Battery voltage': '24 / 48 V auto', 'Max PV input': '250 V', 'Display': 'LCD with Bluetooth' }, '2 years (sample)', 'For larger arrays and 48 V systems.', '100A'),
    P('p-prot-dc', 'protection', 'GuardLine', 'GL-DC4', 'GuardLine DC Protection Box (4-string)', 85000, 0, 'in-stock', false,
      { 'Product type': 'DC combiner and surge protection', 'Strings': '4 inputs', 'Rated voltage': '1000 V DC', 'Contents': 'DC breakers, surge arrester, fuse holders', 'Enclosure': 'IP65' }, '1 year (sample)', 'Pre-wired protection for the PV side.', 'DC box'),
    P('p-prot-ac', 'protection', 'GuardLine', 'GL-AC2', 'GuardLine AC Protection Kit', 65000, 0, 'in-stock', false,
      { 'Product type': 'AC breaker and surge kit', 'Rated voltage': '230 V AC', 'Contents': 'MCB, RCD, surge protector, enclosure', 'Compatibility': 'Single-phase inverters up to 10 kVA' }, '1 year (sample)', 'Protection on the AC output side.', 'AC kit'),
    P('p-mount-4', 'accessories', 'RoofLine', 'RL-R4', 'RoofLine Mounting Rail Kit (4 panels)', 95000, 0, 'in-stock', false,
      { 'Product type': 'Roof mounting kit', 'Material': 'Anodised aluminium with stainless fixings', 'Compatibility': 'Standard 35 mm framed panels', 'Covers': '4 panels', 'Roof types': 'Corrugated metal, tile adaptors sold separately' }, '10 years (sample)', 'Rails, clamps and brackets for four panels.', '4 panels'),
    P('p-cable-6', 'accessories', 'RoofLine', 'RL-PV6', 'PV Solar Cable 6mm2 (100m roll)', 140000, 0, 'in-stock', false,
      { 'Product type': 'PV DC cable', 'Conductor': 'Tinned copper, 6 mm2', 'Rated voltage': '1.5 kV DC', 'Length': '100 m', 'UV resistance': 'Yes' }, '1 year (sample)', 'Double-insulated solar cable.', '100m'),
    P('p-sys-home', 'systems', 'SunGrid', 'SG-HOME-3.5', 'Home Essentials System 3.5kVA', 2650000, 3.5, 'in-stock', false,
      { 'Inverter': '3.5 kVA hybrid', 'Solar array': '4 x 550W (2.2 kWp)', 'Battery': '5 kWh lithium', 'Protection': 'AC and DC kits included', 'Suitable for': 'Lights, fans, TV, fridge, laptops', 'Installation': 'Not included (quoted separately)' }, 'Per component (sample)', 'Bundled system for a one to two bedroom home.', '3.5kVA'),
    P('p-sys-family', 'systems', 'SunGrid', 'SG-FAM-5', 'Family Comfort System 5kVA', 4900000, 5, 'in-stock', true,
      { 'Inverter': '5 kVA hybrid', 'Solar array': '6 x 550W (3.3 kWp)', 'Battery': '10 kWh lithium', 'Protection': 'AC and DC kits included', 'Suitable for': 'Lights, fans, TV, fridge, freezer, pump', 'Installation': 'Not included (quoted separately)' }, 'Per component (sample)', 'Our best-selling home package.', '5kVA'),
    P('p-sys-comm', 'systems', 'SunGrid', 'SG-COM-10', 'Business Power System 10kVA', 0, 10, 'in-stock', false,
      { 'Inverter': '10 kVA hybrid', 'Solar array': '12 x 550W (6.6 kWp)', 'Battery': '20 kWh lithium', 'Suitable for': 'Shops, offices, small clinics', 'Installation': 'Survey and design required' }, 'Per component (sample)', 'Scaled to your site after a survey.', '10kVA', 'quote-only')
  ];

  const projects = [
    { id: 'j-1', title: 'Three-bedroom home backup system', location: 'Lekki, Lagos', capacity: '3.3 kWp / 5 kVA / 10 kWh', type: 'Residential', image: 'scene:home', featured: true, description: 'Sample project: a 6-panel array with a 5kVA hybrid inverter and 10kWh lithium storage, sized for lights, fans, TVs, fridge and a pump.' },
    { id: 'j-2', title: 'Small office solar installation', location: 'Ikeja, Lagos', capacity: '5.5 kWp / 7.5 kVA / 10 kWh', type: 'Commercial', image: 'scene:office', featured: true, description: 'Sample project: daytime-heavy load, so the array is sized larger than the battery to run computers and air conditioners from the sun.' },
    { id: 'j-3', title: 'Retail shop backup and solar', location: 'Surulere, Lagos', capacity: '2.2 kWp / 3.5 kVA / 5 kWh', type: 'Commercial', image: 'scene:shop', featured: false, description: 'Sample project: freezers, lighting and a POS system kept running through grid outages.' },
    { id: 'j-4', title: 'Commercial rooftop array', location: 'Apapa, Lagos', capacity: '40 kWp / 30 kVA three-phase', type: 'Industrial', image: 'scene:rooftop', featured: true, description: 'Sample project: a three-phase rooftop installation for a warehouse, designed after a structural survey.' },
    { id: 'j-5', title: 'Solar-powered borehole pumping', location: 'Ikorodu, Lagos', capacity: '3 kWp direct pump drive', type: 'Solar pumping', image: 'scene:pump', featured: false, description: 'Sample project: a direct-drive pumping system with no batteries, filling a storage tank during daylight.' },
    { id: 'j-6', title: 'Mixed-use property installation', location: 'Victoria Island, Lagos', capacity: '8.8 kWp / 10 kVA / 20 kWh', type: 'Commercial', image: 'scene:mixed', featured: false, description: 'Sample project: shared system for ground-floor retail units and upstairs apartments.' }
  ];

  const testimonials = [
    { id: 't-1', name: 'Adaeze O. (fictional)', review: 'Sample review: The assessment was thorough and the quote matched what the team installed. Our fridge and fans now run all night.', rating: 5, category: 'Residential' },
    { id: 't-2', name: 'Tunde B. (fictional)', review: 'Sample review: They explained the difference between kVA and kW in plain words before recommending an inverter.', rating: 5, category: 'Residential' },
    { id: 't-3', name: 'Ngozi M. (fictional)', review: 'Sample review: Our shop freezers no longer thaw when the grid drops. The team finished in a day.', rating: 4, category: 'Commercial' },
    { id: 't-4', name: 'Ibrahim S. (fictional)', review: 'Sample review: The solar calculator gave us a realistic starting point. The engineer then adjusted it after visiting.', rating: 5, category: 'Commercial' },
    { id: 't-5', name: 'Folake A. (fictional)', review: 'Sample review: Clear warranty terms and a tidy installation. Support answered on WhatsApp the same day.', rating: 5, category: 'Residential' },
    { id: 't-6', name: 'Chidi E. (fictional)', review: 'Sample review: Our borehole pump runs from the sun now. Fuel costs for the generator dropped sharply.', rating: 4, category: 'Solar pumping' }
  ];

  const d = n => new Date(Date.now() - n * 86400000).toISOString();
  const enquiries = [
    { id: 'e-1', name: 'Demo Customer A', phone: '08000000001', email: '', location: 'Lekki, Lagos', type: 'Install solar at my home', source: 'Solar calculator', products: '1 x Helios Mono 550W (x6), VoltEdge 5kVA, AmpCore 5kWh (x2)', calc: 'Connected load 3.9 kW, daily energy 14 kWh, suggested 5 kVA inverter, 10 kWh battery, 6 panels', message: 'Sample enquiry for demonstration.', status: 'New', notes: '', createdAt: d(0) },
    { id: 'e-2', name: 'Demo Customer B', phone: '08000000002', email: 'demo-b@example.com', location: 'Ikeja, Lagos', type: 'Purchase solar equipment', source: 'Package builder', products: '2 x VoltEdge Hybrid Inverter 3.5kVA', calc: '', message: 'Sample enquiry for demonstration.', status: 'Contacted', notes: 'Asked about delivery to Ikeja.', createdAt: d(2) },
    { id: 'e-3', name: 'Demo Customer C', phone: '08000000003', email: '', location: 'Surulere, Lagos', type: 'Request a solar assessment', source: 'Site assessment form', products: '', calc: '', message: 'Sample: shop with two freezers.', status: 'Assessment Scheduled', notes: '', createdAt: d(4) },
    { id: 'e-4', name: 'Demo Customer D', phone: '08000000004', email: 'demo-d@example.com', location: 'Ikorodu, Lagos', type: 'Install solar at my business', source: 'Quote form', products: 'Business Power System 10kVA (quote-only)', calc: '', message: 'Sample enquiry for demonstration.', status: 'Quotation Sent', notes: 'Quote sent, waiting for reply.', createdAt: d(7) },
    { id: 'e-5', name: 'Demo Customer E', phone: '08000000005', email: '', location: 'Yaba, Lagos', type: 'Request a maintenance service', source: 'Contact form', products: '', calc: '', message: 'Sample: inverter shows a fault light.', status: 'Completed', notes: 'Fixed on site.', createdAt: d(12) }
  ];

  const appliances = [
    { id: 'led', name: 'LED bulbs', icon: '💡', watts: 10, hours: 6, qty: 8 },
    { id: 'fan', name: 'Standing fan', icon: '🌀', watts: 75, hours: 8, qty: 2 },
    { id: 'ceil', name: 'Ceiling fan', icon: '🪭', watts: 70, hours: 8, qty: 3 },
    { id: 'tv', name: 'Television', icon: '📺', watts: 100, hours: 6, qty: 1 },
    { id: 'laptop', name: 'Laptop', icon: '💻', watts: 65, hours: 6, qty: 1 },
    { id: 'desktop', name: 'Desktop computer', icon: '🖥️', watts: 200, hours: 6, qty: 1 },
    { id: 'fridge', name: 'Refrigerator', icon: '🧊', watts: 200, hours: 10, qty: 1, motor: true },
    { id: 'freezer', name: 'Chest freezer', icon: '❄️', watts: 250, hours: 10, qty: 1, motor: true },
    { id: 'wash', name: 'Washing machine', icon: '🧺', watts: 500, hours: 1, qty: 1, motor: true },
    { id: 'pump', name: 'Water pump', icon: '🚰', watts: 750, hours: 1, qty: 1, motor: true },
    { id: 'micro', name: 'Microwave', icon: '🍲', watts: 1000, hours: 0.5, qty: 1 },
    { id: 'iron', name: 'Electric iron', icon: '👔', watts: 1000, hours: 0.5, qty: 1 },
    { id: 'ac', name: 'Air conditioner (1HP)', icon: '🌬️', watts: 900, hours: 6, qty: 1, motor: true }
  ];

  SG.seed = { products, projects, testimonials, enquiries, appliances };
})();
