# SunGrid Energy: solar business website demo

A static HTML/CSS/JavaScript prototype to show solar dealers and installers what a professional website can do. **SunGrid Energy is fictional. All products, prices, projects, reviews and enquiries are sample data. This is not suitable for real orders or real customer data.**

## What it demonstrates
Catalogue (24 sample products, search, filters, sorting, compare up to 3), solar calculator (appliances, backup hours, usage, estimate with transparent assumptions), package builder with totals, quotation / enquiry / site-assessment forms, WhatsApp and email hand-off, installation portfolio, testimonials, FAQ, and a separate admin demo.

## Run it
Open `index.html` in a browser, or serve the folder: `python3 -m http.server 8000` then visit `http://localhost:8000`. Admin demo: `admin.html` (linked in the page footer and top bar). Host both files on the same address so they share data.

## Files
- `index.html`, `admin.html`: pages
- `css/main.css`, `css/admin.css`: styling (colours at the top of main.css)
- `js/config.js`: **business name, WhatsApp number, phone, email, pricing rules, calculator assumptions**
- `js/demo-data.js`: all sample products, projects, testimonials, appliances
- `js/storage.js`, `util.js`, `forms.js`, `calculator.js`, `app.js`, `admin.js`: behaviour
- `js/art.js`: locally generated SVG images (no external image files needed)

## Customising for a real client
1. Edit `js/config.js`: brand name, `whatsapp` (digits only, e.g. `2348012345678`), phone, email, service areas.
2. Replace products, prices and appliance wattages in `js/demo-data.js`. Set `pricingMode: 'quote-only'` to show "Request price".
3. Replace sample projects and testimonials with genuine, authorised ones, and remove the demo notices in `index.html`.
4. Replace images: set a product `image` to a file path such as `assets/panel.jpg`.

Until a WhatsApp number is set, the WhatsApp buttons show the prepared message with a Copy button instead.

## Calculator
Connected load = sum of watts x quantity. Daily energy = watts x quantity x hours / 1000. Simultaneous load uses a configurable share of connected load. Inverter, battery and solar sizes use the efficiency, margin, peak-sun and performance assumptions in `config.js`. It is an indicative estimate and always says a qualified installer must confirm the design.

## Data and reset
Everything is stored in this browser's localStorage (keys start `sungrid.v1.`). It does not sync across browsers, devices or different site addresses. Admin has export/import (validated JSON) and "Reset all demo data".

## Before production you need
A backend and database, real authentication and authorization for admin, server-side form delivery (email or CRM), and real inventory and payment handling if selling online.
# Solar
