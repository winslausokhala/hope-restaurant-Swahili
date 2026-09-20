/* ==========================================================================
   Hope: restaurant details
   Edit the values below. Everything marked PLACEHOLDER is sample text that
   you must replace before you publish. The site reads this file on every page.
   ========================================================================== */
window.HOPE = {
  name: "Hope",

  /* PLACEHOLDER: replace all contact details with the real ones. */
  phone: "+255 700 000 000",
  email: "hello@example.com",
  whatsapp: "",                 // digits only with country code, e.g. "255700000000". Leave "" to hide.
  address: "[Anwani ya mtaa], [Jiji], [Nchi]",

  /* Map: paste a Google Maps "Share" link into mapUrl (optional).
     For an embedded map, paste the "Embed a map" src URL into mapEmbedUrl. */
  mapUrl: "",
  mapEmbedUrl: "",

  /* PLACEHOLDER: sample opening hours. Also update the schema.org block in index.html. */
  hours: [
    { days: "Jumatatu hadi Alhamisi", time: "11:00 hadi 22:00" },
    { days: "Ijumaa na Jumamosi", time: "11:00 hadi 23:30" },
    { days: "Jumapili", time: "12:00 hadi 21:00" }
  ],

  /* Social links. Leave a value as "" to hide that link. */
  social: {
    Instagram: "",
    Facebook: "",
    TikTok: ""
  },

  /* Photo credits, shown in the footer. Add one line per photo you did not take yourself:
     { text: "Picha na Jane Doe kwenye Unsplash", url: "https://unsplash.com/@janedoe" } */
  photoCredits: [],

  /* Text shown before each price on the menu. Prices in data/menu.json are plain numbers in Tanzanian shillings. */
  currencyPrefix: "TSh\u00a0",

  /* Booking form options. */
  booking: {
    firstSlot: "11:00",
    lastSlot: "21:30",
    stepMinutes: 30,
    maxGuests: 12,
    daysAhead: 180
  },

  /* Where the forms send messages. Paste your Formspree form URL here,
     for example "https://formspree.io/f/abcdwxyz". See the README for setup.
     While this is empty, the forms open the visitor's email app instead. */
  formEndpoint: ""
};
