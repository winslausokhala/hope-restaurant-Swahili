/* ==========================================================================
   Hope: shared behaviour used on every page
   1. Fills phone, address, hours, social links and credits from js/config.js
   2. Mobile navigation toggle
   3. Graceful fallback when a photo file is missing
   ========================================================================== */
/* Older browsers (before Safari 14 and Chrome 86) lack replaceChildren, which every script here uses.
   This small stand-in keeps the menu and the other pages working on them. */
if (!Element.prototype.replaceChildren) {
  Element.prototype.replaceChildren = function () {
    while (this.firstChild) this.removeChild(this.firstChild);
    this.append.apply(this, arguments);
  };
}

(function () {
  "use strict";

  var S = window.HOPE || {};
  document.documentElement.classList.add("js");

  function each(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function dialable(value) {
    return String(value || "").replace(/[^\d+]/g, "");
  }

  /* ---------- 1. Fill details from config ---------- */
  var mapLink =
    S.mapUrl ||
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(S.address || "");

  each('[data-site="phone"]', function (el) {
    el.textContent = S.phone;
    if (el.tagName === "A") el.href = "tel:" + dialable(S.phone);
  });

  each('[data-site="email"]', function (el) {
    el.textContent = S.email;
    if (el.tagName === "A") el.href = "mailto:" + S.email;
  });

  each('[data-site="address"]', function (el) {
    el.textContent = S.address;
  });

  each('[data-site="map"]', function (el) {
    el.href = mapLink;
  });

  each('[data-site="whatsapp"]', function (el) {
    if (!S.whatsapp) return;
    el.href = "https://wa.me/" + dialable(S.whatsapp).replace("+", "");
    el.hidden = false;
  });

  each('[data-site="hours"]', function (el) {
    var list = make("dl", "hours-list");
    (S.hours || []).forEach(function (row) {
      var line = make("div", "hours-row");
      line.appendChild(make("dt", "", row.days));
      line.appendChild(make("dd", "", row.time));
      list.appendChild(line);
    });
    el.replaceChildren(list);
  });

  each('[data-site="social"]', function (el) {
    var social = S.social || {};
    var names = Object.keys(social).filter(function (name) {
      return social[name];
    });
    if (!names.length) {
      el.hidden = true;
      return;
    }
    names.forEach(function (name) {
      var a = make("a", "social-link", name);
      a.href = social[name];
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.appendChild(make("span", "sr-only", " (inafunguka kwenye kichupo kipya)"));
      el.appendChild(a);
    });
  });

  each('[data-site="credits"]', function (el) {
    var credits = S.photoCredits || [];
    if (!credits.length) return;
    el.appendChild(document.createTextNode("Picha kwa hisani ya: "));
    credits.forEach(function (credit, i) {
      if (i) el.appendChild(document.createTextNode(", "));
      if (credit.url) {
        var a = make("a", "", credit.text);
        a.href = credit.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        el.appendChild(a);
      } else {
        el.appendChild(document.createTextNode(credit.text));
      }
    });
    el.hidden = false;
  });

  each('[data-site="year"]', function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Embedded map (contact page): only shown when mapEmbedUrl is set. */
  each('[data-site="map-embed"]', function (el) {
    if (!S.mapEmbedUrl) return;
    var frame = document.createElement("iframe");
    frame.src = S.mapEmbedUrl;
    frame.title = "Ramani inayoonyesha mahali pa kupata " + (S.name || "mgahawa");
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    el.replaceChildren(frame);
    el.hidden = false;
  });

  /* ---------- 2. Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    var toggleLabel = toggle.querySelector(".sr-only");

    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (toggleLabel) toggleLabel.textContent = open ? "Funga orodha ya kurasa" : "Fungua orodha ya kurasa";
    };

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open);
      if (open) {
        var first = nav.querySelector("a");
        if (first) first.focus();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
  }

  /* ---------- 3. Missing photos ----------
     Every photo on the site is optional. If a file is missing, swap the broken
     image for a neutral placeholder so the layout never breaks. */
  function usePlaceholder(img) {
    if (img.dataset.fallback === "hide") {
      img.hidden = true;
      return;
    }
    var box = make("div", "ph " + (img.dataset.phClass || ""));
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", img.alt);
    if (img.dataset.phLabel) box.appendChild(make("span", "", img.dataset.phLabel));
    img.replaceWith(box);
  }

  document.addEventListener(
    "error",
    function (event) {
      if (event.target && event.target.tagName === "IMG") usePlaceholder(event.target);
    },
    true
  );

  /* Images that failed before this script ran, or were inserted from cache. */
  window.HopeImages = {
    check: function (root) {
      Array.prototype.forEach.call((root || document).querySelectorAll("img"), function (img) {
        if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) usePlaceholder(img);
      });
    }
  };
  window.HopeImages.check();
})();
