/* ==========================================================================
   Hope: menu
   Loads data/menu.json and draws it on:
   - menu.html  (#menu-root, with search, category and dietary filters)
   - index.html ([data-featured], the signature dishes)
   To change dishes, edit data/menu.json. You do not need to touch this file.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.getElementById("menu-root");
  var featured = document.querySelector("[data-featured]");
  if (!root && !featured) return;

  var CATEGORY_ORDER = ["Vianzio", "Vyakula Vikuu", "Vitindamlo", "Vinywaji"];
  /* Prices are in Tanzanian shillings and shown like "TSh 18,000". The prefix is set in js/config.js. */
  var PREFIX = (window.HOPE && window.HOPE.currencyPrefix) || "TSh\u00a0";
  function formatPrice(amount) {
    return PREFIX + Math.round(amount).toLocaleString("en-US");
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function slug(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  /* Build one dish. variant "feature" is the larger, stacked version used on the home page. */
  function buildDish(item, variant) {
    var li = make("li", "dish" + (variant === "feature" ? " dish--feature" : ""));
    li.dataset.id = item.id;

    var media = make("div", "arch");
    var img = new Image();
    img.src = item.image;
    img.alt = item.alt || item.name;
    img.width = 400;
    img.height = 500;
    img.loading = "lazy";
    img.decoding = "async";
    img.dataset.phClass = "ph-" + slug(item.category);
    media.appendChild(img);
    li.appendChild(media);

    var body = make("div", "dish-body");
    var head = make("div", "dish-head");
    head.appendChild(make("h3", "dish-name", item.name));
    head.appendChild(make("p", "dish-price", formatPrice(item.price)));
    body.appendChild(head);
    body.appendChild(make("p", "dish-desc", item.description));

    if (item.tags && item.tags.length) {
      var tags = make("ul", "tags");
      tags.setAttribute("aria-label", "Taarifa za lishe");
      item.tags.forEach(function (tag) {
        tags.appendChild(make("li", "tag tag-" + slug(tag), tag));
      });
      body.appendChild(tags);
    }

    li.appendChild(body);
    return li;
  }

  function showError() {
    var message = make(
      "p",
      "form-status form-status--error",
      "Menyu haikuweza kupakia. Kama umefungua faili hii moja kwa moja kutoka kwenye kompyuta yako, tumia seva ya ndani " +
        "(angalia README). Vinginevyo, hakikisha data/menu.json ipo na ni sahihi."
    );
    (root || featured).replaceChildren(message);
  }

  /* ---------- Home page: signature dishes ---------- */
  function renderFeatured(items) {
    var picks = items.filter(function (item) {
      return item.featured;
    });
    if (!picks.length) picks = items.slice(0, 4);
    featured.replaceChildren.apply(
      featured,
      picks.slice(0, 4).map(function (item) {
        return buildDish(item, "feature");
      })
    );
    if (window.HopeImages) window.HopeImages.check(featured);
  }

  /* ---------- Menu page ---------- */
  function renderMenu(items) {
    var categories = CATEGORY_ORDER.filter(function (name) {
      return items.some(function (item) {
        return item.category === name;
      });
    });
    items.forEach(function (item) {
      if (categories.indexOf(item.category) === -1) categories.push(item.category);
    });

    var sections = {};
    var frag = document.createDocumentFragment();

    categories.forEach(function (name) {
      var section = make("section", "menu-section");
      section.id = slug(name);
      section.setAttribute("aria-labelledby", "cat-" + slug(name));
      var heading = make("h2", "", name);
      heading.id = "cat-" + slug(name);
      section.appendChild(heading);
      var list = make("ul", "dish-list");
      section.appendChild(list);
      sections[name] = { el: section, list: list, dishes: [] };
      frag.appendChild(section);
    });

    items.forEach(function (item) {
      var dish = buildDish(item, "row");
      var target = sections[item.category];
      target.list.appendChild(dish);
      target.dishes.push({ el: dish, item: item });
    });

    root.replaceChildren(frag);
    if (window.HopeImages) window.HopeImages.check(root);

    /* ----- Filters ----- */
    var state = { query: "", category: "All", tags: [] };
    var search = document.getElementById("menu-search");
    var count = document.getElementById("menu-count");
    var clear = document.getElementById("menu-clear");
    var empty = document.getElementById("menu-empty");

    function matches(item) {
      if (state.category !== "All" && item.category !== state.category) return false;

      var haystack = (item.name + " " + item.description + " " + (item.tags || []).join(" ")).toLowerCase();
      var terms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.every(function (term) { return haystack.indexOf(term) !== -1; })) return false;

      var tags = item.tags || [];
      return state.tags.every(function (wanted) {
        /* A vegan dish is also meat-free ("Bila Nyama"). */
        if (wanted === "Bila Nyama") return tags.indexOf("Bila Nyama") !== -1 || tags.indexOf("Vegan") !== -1;
        return tags.indexOf(wanted) !== -1;
      });
    }

    function apply() {
      var visible = 0;
      Object.keys(sections).forEach(function (name) {
        var group = sections[name];
        var shown = 0;
        group.dishes.forEach(function (entry) {
          var ok = matches(entry.item);
          entry.el.hidden = !ok;
          if (ok) shown += 1;
        });
        group.el.hidden = shown === 0;
        visible += shown;
      });

      var filtering = state.query.trim() || state.category !== "All" || state.tags.length;
      clear.hidden = !filtering;
      empty.hidden = visible !== 0;
      /* Swahili puts the noun first: "Vyakula 22", and the verb agrees with the noun class. */
      count.textContent =
        visible === 0
          ? "Hakuna chakula kinacholingana. Jaribu vichujio vichache."
          : (visible === 1 ? "Chakula 1" : "Vyakula " + visible) +
            (filtering ? (visible === 1 ? " kinaonyeshwa" : " vinaonyeshwa") : "");
    }

    search.addEventListener("input", function () {
      state.query = search.value;
      apply();
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-cat]"), function (button) {
      button.addEventListener("click", function () {
        state.category = button.dataset.cat;
        Array.prototype.forEach.call(document.querySelectorAll("[data-cat]"), function (other) {
          other.setAttribute("aria-pressed", String(other === button));
        });
        apply();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-tag]"), function (button) {
      button.addEventListener("click", function () {
        var tag = button.dataset.tag;
        var index = state.tags.indexOf(tag);
        if (index === -1) state.tags.push(tag);
        else state.tags.splice(index, 1);
        button.setAttribute("aria-pressed", String(index === -1));
        apply();
      });
    });

    function reset() {
      state = { query: "", category: "All", tags: [] };
      search.value = "";
      Array.prototype.forEach.call(document.querySelectorAll("[data-cat]"), function (button) {
        button.setAttribute("aria-pressed", String(button.dataset.cat === "All"));
      });
      Array.prototype.forEach.call(document.querySelectorAll("[data-tag]"), function (button) {
        button.setAttribute("aria-pressed", "false");
      });
      apply();
    }

    clear.addEventListener("click", function () {
      reset();
      search.focus();
    });
    var emptyClear = document.getElementById("menu-empty-clear");
    if (emptyClear) emptyClear.addEventListener("click", function () { reset(); search.focus(); });

    apply();

    /* Deep links such as menu.html#mains */
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  fetch("data/menu.json")
    .then(function (response) {
      if (!response.ok) throw new Error("menu.json returned " + response.status);
      return response.json();
    })
    .then(function (data) {
      var items = (data && data.items) || [];
      if (!items.length) throw new Error("menu.json has no items");
      if (root) renderMenu(items);
      if (featured) renderFeatured(items);
    })
    .catch(function (error) {
      console.error(error);
      showError();
    });
})();
