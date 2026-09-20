# Hope restaurant website

A six-page restaurant site in Swahili (Kiswahili), in plain HTML, CSS and JavaScript. No build step, no frameworks.

Pages: `index.html` (Nyumbani), `menu.html` (Menyu), `about.html` (Hadithi Yetu), `gallery.html` (Picha), `reservations.html` (Weka meza), `contact.html` (Mawasiliano).

All visible text is Swahili and every page is marked `lang="sw"`. Have a Tanzanian Swahili speaker read it before launch, especially the menu and the about page.

## Fill these in before you publish

Everything below is sample content. Do not publish until you have replaced it.

1. **Phone, email, address, opening hours, social links**: edit `js/config.js`. Every page reads from it.
2. **Search-engine details**: the `application/ld+json` block near the top of `index.html` repeats the phone, address and hours. Update it to match `js/config.js`. The sample phone number uses Tanzania's +255 code.
3. **Booking and contact forms**: paste your Formspree address into `formEndpoint` in `js/config.js` (see "Forms" below).
4. **Photos**: see "Replace the photos" below. Add credits in `photoCredits` in `js/config.js` for any photo you did not take.
5. **About page**: every paragraph, the chef or owner name and the three values are placeholders. Rewrite them so they are true for your restaurant.
6. **Home page intro** (`index.html`, the "Food to gather around" section): rewrite in your own words.
7. **Menu**: the 22 dishes are Tanzanian-style samples and the prices (TSh 2,000 to 28,000) are sample figures I chose, not researched market prices. Replace the dishes and prices in `data/menu.json` with your own. Check that every dietary tag (especially Halali and Bila Gluteni) is true for how your kitchen prepares the dish.
8. **Map**: set `mapUrl` (a Google Maps share link) in `js/config.js`. For an embedded map, also set `mapEmbedUrl`.
9. **Share image**: each page has an `og:image` tag pointing to `https://your-domain.example/images/og-cover.jpg`. Add a 1200 x 630 image and use your real domain.

## Run it on your computer

The menu loads from a JSON file, and browsers block that when you double-click a page. Serve the folder instead:

```
cd hope
python3 -m http.server 8000
```

Then open http://localhost:8000. (Any local server works, including the VS Code "Live Server" extension.)

## Edit the menu

Open `data/menu.json`. Each dish looks like this:

```json
{
  "id": "mishkaki",
  "name": "Sahani ya Mishkaki",
  "category": "Vyakula Vikuu",
  "price": 18000,
  "description": "Sentensi moja au mbili.",
  "image": "images/menu/mishkaki.jpg",
  "alt": "Kinachoonekana kwenye picha, kwa wasomaji wa skrini",
  "tags": ["Halali", "Ina Pilipili"],
  "featured": true
}
```

- `category` must be `Vianzio` (starters), `Vyakula Vikuu` (mains), `Vitindamlo` (desserts) or `Vinywaji` (drinks). A new category name also works and appears after those four. If you add one, also add a filter button for it in `menu.html`, and a matching placeholder colour in `css/styles.css` (search for `.ph-vianzio`).
- `price` is a plain number in Tanzanian shillings, for example `18000`. The site shows it as `TSh 18,000`. To change the text before the price, edit `currencyPrefix` in `js/config.js`.
- `tags` can be any of `Bila Nyama` (vegetarian), `Vegan`, `Halali` (halal), `Ina Pilipili` (spicy), `Bila Gluteni` (gluten-free). A `Vegan` dish also appears when someone filters for `Bila Nyama`, so tag vegan dishes with `Vegan` only.
- `featured: true` puts a dish in the four signature dishes on the home page. Leave it out for other dishes. If none are featured, the first four dishes are shown.
- Keep the commas between dishes exactly as in the file. If the menu goes blank, paste the file into https://jsonlint.com to find the mistake.

## Change the colours, fonts and text

- **Colours and fonts**: the first block of `css/styles.css` (`:root`) holds every colour and both fonts. The fonts load from Google Fonts in the `<head>` of each page; if you change them, change that link too.
- **Text**: edit the HTML files directly. The header and footer are repeated on every page, so change them in all six.
- **The sun on the home page**: it is a yellow circle. When you add `images/hero.jpg`, your photo fills the circle.

## Replace the photos

Every photo is optional. While a file is missing, the site shows a tidy placeholder, so nothing breaks. To use a photo, save it with **exactly** the file name below.

Sizes that work well (JPEG or WebP, under about 200 KB each so pages stay fast on mobile data):

- Menu photos: 800 x 1000 pixels (portrait). They are cropped into an arch, so keep the dish in the middle.
- Hero: 1200 x 1200 pixels (square). It fills the sun.
- Gallery: 1200 x 900 pixels.

If you use WebP or PNG, keep the file names in `data/menu.json` and `js/gallery.js` in step with the real file names.

Also update the `alt` text so it describes your real photo.

**Hero and about page**
- `images/hero.jpg`
- `images/about/chef.jpg`

**Gallery** (names, captions and alt text live in `js/gallery.js`)
- `images/gallery/grill.jpg`
- `images/gallery/dining-room.jpg`
- `images/gallery/table-spread.jpg`
- `images/gallery/kitchen.jpg`
- `images/gallery/drinks.jpg`
- `images/gallery/dessert.jpg`
- `images/gallery/entrance.jpg`
- `images/gallery/ingredients.jpg`

**Menu** (22 photos)
- `images/menu/sambusa-nyama.jpg` (Sambusa za Nyama)
- `images/menu/bajia-za-viazi.jpg` (Bajia za Viazi)
- `images/menu/urojo-wa-zanzibar.jpg` (Urojo wa Zanzibar)
- `images/menu/mihogo-ya-kukaanga.jpg` (Mihogo ya Kukaanga na Mchuzi wa Pilipili)
- `images/menu/mtori-wa-nyama.jpg` (Mtori wa Nyama)
- `images/menu/mishkaki.jpg` (Sahani ya Mishkaki)
- `images/menu/ugali-sangara.jpg` (Ugali na Sangara wa Kukaanga)
- `images/menu/samaki-wa-kupaka.jpg` (Samaki wa Kupaka)
- `images/menu/pilau-ya-nyama.jpg` (Pilau ya Nyama)
- `images/menu/ndizi-nyama.jpg` (Ndizi Nyama)
- `images/menu/maharage-ya-nazi.jpg` (Maharage ya Nazi na Chapati)
- `images/menu/kuku-wa-kupaka.jpg` (Kuku wa Kupaka)
- `images/menu/vitumbua.jpg` (Vitumbua vya Nazi)
- `images/menu/kaimati.jpg` (Kaimati)
- `images/menu/halwa.jpg` (Halwa ya Zanzibar)
- `images/menu/embe-aiskrimu-nazi.jpg` (Embe Mbivu na Aiskrimu ya Nazi)
- `images/menu/chai-ya-viungo.jpg` (Chai ya Viungo)
- `images/menu/kahawa-chungu.jpg` (Kahawa Chungu ya Zanzibar)
- `images/menu/juisi-ya-embe.jpg` (Juisi ya Embe)
- `images/menu/juisi-ya-parachichi.jpg` (Juisi ya Parachichi)
- `images/menu/juisi-ya-miwa.jpg` (Juisi ya Miwa)
- `images/menu/maji-ya-dafu.jpg` (Maji ya Dafu)

Photo file names stay in English so they are easy to type. Only the words visitors read are in Swahili.

### Where to find photos you may use

Use your own photos where you can. Otherwise use royalty-free sources such as Unsplash or Pexels, and credit the photographer in `photoCredits` in `js/config.js`. Never copy photos from other restaurants or from brand websites.

## Forms (bookings and messages)

The site has no server, so forms need an email service. The simplest is Formspree:

1. Create a free account at https://formspree.io and make a new form. Use the email address where you want bookings to arrive.
2. Copy the form address (it looks like `https://formspree.io/f/abcdwxyz`).
3. Paste it into `formEndpoint` in `js/config.js`.
4. Submit a test booking and confirm the email arrives. Check your spam folder the first time.

Until `formEndpoint` is set, the forms open the visitor's email app with the message filled in. That works, but it is a poorer experience, so set up Formspree before you launch.

The forms include a hidden spam trap field and browser-side validation. Formspree adds its own spam filtering.

If you prefer EmailJS, replace the `fetch` call inside the `send` function in `js/forms.js` with EmailJS's `emailjs.send(...)` call, following their browser quick-start.

## Deploy

**Netlify (easiest):** sign in at https://app.netlify.com, choose "Add new site", then "Deploy manually", and drag the whole `hope` folder onto the page. You get a working address in under a minute. You can attach your own domain in the site settings.

**GitHub Pages:** create a repository, upload the contents of this folder to it, then go to Settings, Pages, and publish from the `main` branch. The site is served at `https://<your-username>.github.io/<repository-name>/`.

After deploying, update `og:image` in each page (see the checklist above), and test the booking form once on the live site.

## Accessibility and performance notes

- Semantic HTML, a skip link, visible focus outlines, labelled form fields with error messages, and alt text on images.
- The menu filters, mobile menu, photo viewer and forms work with a keyboard. The photo viewer closes with Escape and moves between photos with the arrow keys.
- Motion is limited to the sun rising on the home page and a small zoom on gallery photos. Both switch off for visitors who ask their device to reduce motion.
- Photos load lazily. Only two web fonts are used.
- Run Lighthouse in Chrome (DevTools, Lighthouse tab) after you add real photos. Large uncompressed photos are the most common cause of a low performance score.
