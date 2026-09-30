# Sri Ramanujar Seva Trust Website

A lightweight, responsive, bilingual static website for Sri Ramanujar Seva Trust in Vriddhachalam / Manavalanallur, Tamil Nadu.

## Run locally

Open `index.html` in a browser. For local development, VS Code Live Server is recommended. No build step or framework is required.

## Structure

- `index.html`, `about.html`, `ramanujar.html`, `activities.html`, `gallery.html`, `contact.html`: website pages
- `css/style.css`: shared responsive styling
- `js/script.js`: shared navigation, language, gallery, reveal, and form behavior
- `js/translations.js`: English and Tamil interface/content text
- `data/site-data.js`: editable Trust details and gallery image list
- `pics/`: supplied Trust images

## Updating Trust details

Edit `data/site-data.js` to change the name, location, office bearers, qualifications, address, phone, email, WhatsApp, office hours, or image list. Replace bracketed placeholders only after the Trust confirms official information. Leadership names and qualifications are shown as supplied.

## Motto and language

The official motto is configured in `data/site-data.js` and the `motto` key in `js/translations.js`. Keep the Tamil wording exactly as supplied: `உய்ய ஒரே வழி உடையவர் திருவடி`. English visitors see `The Feet of Udayavar are the Only Way to Salvation.` The language switcher stores the selection in browser local storage.

Edit page translations in `js/translations.js`. The site defaults to English; Tamil is selected with the `தமிழ்` button.

## Images and gallery

Place image files inside `pics/` and add their relative path and translation alt-text key to the `images` array in `data/site-data.js`. Gallery links are rendered from this list on `gallery.html`. Use descriptive translated alt text and preserve image aspect ratio with `object-fit` styling.

## Contact, donations, and map

Edit official contact values in `data/site-data.js`. The supplied bank image is represented there as account name, City Union Bank, account number/type, branch, IFSC and MICR. Verify banking details before publishing. UPI, QR code and donation contact remain placeholders until officially supplied. The contact form is a front-end validation demo and does not send email; connect it to an approved backend before using it for enquiries. The map link opens the official Google Maps share URL in a new tab.
