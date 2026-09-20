/* ==========================================================================
   Hope: gallery
   Edit the PHOTOS list below to change what appears. Put the image files in
   images/gallery/. Every photo needs alt text that describes what is in it.
   ========================================================================== */
(function () {
  "use strict";

  var grid = document.getElementById("gallery-grid");
  var box = document.getElementById("lightbox");
  if (!grid || !box) return;

  /* PLACEHOLDER: replace the file names, captions and alt text with your own photos. */
  var PHOTOS = [
    { src: "images/gallery/grill.jpg", caption: "Kutoka kwenye jiko la mkaa", alt: "Nyama ikichomwa kwa mkaa kwenye jiko wazi" },
    { src: "images/gallery/dining-room.jpg", caption: "Ukumbi wa chakula", alt: "Ukumbi wa chakula wa mgahawa wenye meza za mbao na taa za joto" },
    { src: "images/gallery/table-spread.jpg", caption: "Meza ya kushirikiana", alt: "Meza iliyojaa sahani na vinywaji vya kushirikiana" },
    { src: "images/gallery/kitchen.jpg", caption: "Jikoni", alt: "Wapishi wakipakua sahani jikoni" },
    { src: "images/gallery/drinks.jpg", caption: "Vinywaji vipya", alt: "Glasi za juisi mbichi na chai baridi kwenye kaunta ya baa" },
    { src: "images/gallery/dessert.jpg", caption: "Kitu kitamu", alt: "Kipande cha keki ya jibini ya pasheni kwenye sahani ndogo" },
    { src: "images/gallery/entrance.jpg", caption: "Karibu ndani", alt: "Mlango wa kuingia mgahawani jioni" },
    { src: "images/gallery/ingredients.jpg", caption: "Viungo vibichi", alt: "Nyanya, mimea na malimau kwenye ubao wa mbao" }
  ];

  var media = document.getElementById("lightbox-media");
  var caption = document.getElementById("lightbox-caption");
  var current = 0;
  var opener = null;

  function make(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function picture(photo, size) {
    var img = new Image();
    img.src = photo.src;
    img.alt = photo.alt;
    img.width = size === "large" ? 1200 : 600;
    img.height = size === "large" ? 900 : 450;
    if (size !== "large") {
      img.loading = "lazy";
      img.decoding = "async";
    }
    img.dataset.phLabel = photo.caption;
    return img;
  }

  /* ----- Grid ----- */
  PHOTOS.forEach(function (photo, index) {
    var li = make("li");
    var tile = make("button", "tile");
    tile.type = "button";
    tile.setAttribute("aria-label", "Kuza picha: " + photo.caption);
    tile.appendChild(picture(photo, "small"));
    tile.addEventListener("click", function () {
      opener = tile;
      show(index);
      if (typeof box.showModal === "function") box.showModal();
      else box.setAttribute("open", "");
    });
    li.appendChild(tile);
    grid.appendChild(li);
  });
  if (window.HopeImages) window.HopeImages.check(grid);

  /* ----- Lightbox ----- */
  function show(index) {
    current = (index + PHOTOS.length) % PHOTOS.length;
    var photo = PHOTOS[current];
    media.replaceChildren(picture(photo, "large"));
    caption.textContent = photo.caption + " (" + (current + 1) + " kati ya " + PHOTOS.length + ")";
    if (window.HopeImages) window.HopeImages.check(media);
  }

  function close() {
    if (typeof box.close === "function") box.close();
    else box.removeAttribute("open");
    if (opener) opener.focus();
  }

  box.addEventListener("click", function (event) {
    var action = event.target.closest("[data-lb]");
    if (action) {
      var name = action.dataset.lb;
      if (name === "prev") show(current - 1);
      if (name === "next") show(current + 1);
      if (name === "close") close();
      return;
    }
    /* Click on the dark backdrop closes the viewer. */
    if (event.target === box) close();
  });

  box.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });
})();
