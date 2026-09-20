/* ==========================================================================
   Hope: booking and contact forms
   - Validates on the page and shows a clear message under each field
   - Sends the form to the Formspree address in js/config.js
   - If no address is set yet, opens the visitor's email app with the message ready
   ========================================================================== */
(function () {
  "use strict";

  var S = window.HOPE || {};
  var B = S.booking || {};
  var forms = document.querySelectorAll("form[data-form]");
  if (!forms.length) return;

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function isoDate(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  var today = isoDate(new Date());

  /* ---------- Fill the booking options ---------- */
  var dateInput = document.getElementById("date");
  if (dateInput) {
    var last = new Date();
    last.setDate(last.getDate() + (B.daysAhead || 180));
    dateInput.min = today;
    dateInput.max = isoDate(last);
  }

  var timeSelect = document.getElementById("time");
  if (timeSelect) {
    var toMinutes = function (hhmm) {
      var parts = hhmm.split(":");
      return Number(parts[0]) * 60 + Number(parts[1]);
    };
    var step = B.stepMinutes || 30;
    for (var m = toMinutes(B.firstSlot || "11:00"); m <= toMinutes(B.lastSlot || "21:30"); m += step) {
      var label = pad(Math.floor(m / 60)) + ":" + pad(m % 60);
      timeSelect.appendChild(new Option(label, label));
    }
  }

  var guestSelect = document.getElementById("guests");
  if (guestSelect) {
    for (var g = 1; g <= (B.maxGuests || 12); g++) {
      guestSelect.appendChild(new Option((g === 1 ? "Mgeni " : "Wageni ") + g, String(g)));
    }
  }

  /* ---------- Validation rules: return an error message, or "" when the value is fine ---------- */
  var rules = {
    name: function (v) {
      return v.trim().length < 2 ? "Andika jina lako." : "";
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Andika barua pepe kama jina@mfano.com.";
    },
    phone: function (v) {
      var digits = v.replace(/\D/g, "");
      return digits.length >= 7 && /^[\d\s()+\-.]+$/.test(v.trim())
        ? ""
        : "Andika namba ya simu yenye angalau tarakimu 7.";
    },
    date: function (v) {
      if (!v) return "Chagua tarehe.";
      return v < today ? "Chagua leo au tarehe ya baadaye." : "";
    },
    time: function (v) {
      return v ? "" : "Chagua saa.";
    },
    guests: function (v) {
      return v ? "" : "Chagua idadi ya wageni.";
    },
    message: function (v) {
      return v.trim().length < 5 ? "Andika ujumbe mfupi ili tujue jinsi ya kukusaidia." : "";
    }
  };

  function errorBox(field) {
    return document.getElementById(field.id + "-error");
  }

  function setError(field, message) {
    var box = errorBox(field);
    if (!box) return;
    if (message) {
      box.textContent = message;
      box.hidden = false;
      field.setAttribute("aria-invalid", "true");
    } else {
      box.textContent = "";
      box.hidden = true;
      field.removeAttribute("aria-invalid");
    }
  }

  function check(field) {
    var rule = rules[field.name];
    if (!rule) return true;
    var message = rule(field.value);
    setError(field, message);
    return !message;
  }

  /* ---------- Messages ---------- */
  function say(box, kind, title, lines) {
    box.className = "form-status form-status--" + kind;
    box.hidden = false;
    var nodes = [];
    var heading = document.createElement("p");
    heading.className = "form-status-title";
    heading.textContent = title;
    nodes.push(heading);
    lines.forEach(function (line) {
      var p = document.createElement("p");
      p.textContent = line;
      nodes.push(p);
    });
    box.replaceChildren.apply(box, nodes);
    box.focus();
  }

  function longDate(value) {
    var parts = value.split("-");
    var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString("sw-TZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  /* ---------- Sending ---------- */
  function send(kind, data) {
    if (S.formEndpoint) {
      return fetch(S.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      }).then(function (response) {
        if (!response.ok) throw new Error("The form service returned " + response.status);
        return "sent";
      });
    }

    /* No form service yet: hand the message to the visitor's email app. */
    var labels = {
      name: "Jina",
      email: "Barua pepe",
      phone: "Simu",
      date: "Tarehe",
      time: "Saa",
      guests: "Wageni",
      notes: "Maelezo",
      message: "Ujumbe"
    };
    var lines = Object.keys(data)
      .filter(function (key) {
        return key.charAt(0) !== "_" && data[key];
      })
      .map(function (key) {
        return (labels[key] || key) + ": " + data[key];
      });
    window.location.href =
      "mailto:" + S.email + "?subject=" + encodeURIComponent(data._subject) + "&body=" + encodeURIComponent(lines.join("\n"));
    return Promise.resolve("mailto");
  }

  Array.prototype.forEach.call(forms, function (form) {
    var kind = form.dataset.form;
    var status = form.querySelector(".form-status");
    var button = form.querySelector('button[type="submit"]');
    var fields = Array.prototype.filter.call(form.elements, function (el) {
      return rules[el.name];
    });

    fields.forEach(function (field) {
      field.addEventListener("blur", function () {
        if (field.value !== "") check(field);
      });
      field.addEventListener("input", function () {
        if (field.hasAttribute("aria-invalid")) check(field);
      });
      field.addEventListener("change", function () {
        if (field.hasAttribute("aria-invalid")) check(field);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      status.hidden = true;

      var firstBad = null;
      fields.forEach(function (field) {
        if (!check(field) && !firstBad) firstBad = field;
      });
      if (firstBad) {
        firstBad.focus();
        return;
      }

      /* Spam trap: real visitors never see or fill this field. */
      var trap = form.elements._gotcha;
      if (trap && trap.value) return;

      var data = {};
      fields.forEach(function (field) {
        data[field.name] = field.value.trim();
      });
      if (form.elements.notes) data.notes = form.elements.notes.value.trim();

      data._subject =
        kind === "booking"
          ? "Ombi la meza kutoka kwa " + data.name + " kwa wageni " + data.guests + " tarehe " + data.date + " saa " + data.time
          : "Ujumbe wa tovuti kutoka kwa " + data.name;

      var original = button.textContent;
      button.disabled = true;
      button.textContent = "Inatuma...";

      send(kind, data)
        .then(function (mode) {
          var lines = [];
          if (mode === "mailto") {
            lines.push("Programu yako ya barua pepe inapaswa kuwa imefunguka na ujumbe wako tayari. Bonyeza tuma kwenye programu hiyo ili ukamilishe.");
            lines.push("Kama hakuna kilichofunguka, tupigie kwenye " + S.phone + ".");
            say(status, "success", "Hatua moja zaidi", lines);
          } else if (kind === "booking") {
            lines.push(
              "Tumepokea ombi lako la meza ya " + (data.guests === "1" ? "mgeni 1" : "wageni " + data.guests) +
                " tarehe " + longDate(data.date) + " saa " + data.time + "."
            );
            lines.push("Tutathibitisha meza yako kwa barua pepe au simu. Mipango ikibadilika, tupigie kwenye " + S.phone + ".");
            say(status, "success", "Asante, " + data.name.split(" ")[0], lines);
          } else {
            lines.push("Tutakujibu kupitia " + data.email + " mapema iwezekanavyo.");
            say(status, "success", "Ujumbe umetumwa", lines);
          }
          form.reset();
        })
        .catch(function (error) {
          console.error(error);
          say(status, "error", "Haikutumwa", [
            "Angalia mtandao wako kisha jaribu tena, au tupigie kwenye " + S.phone + "."
          ]);
        })
        .then(function () {
          button.disabled = false;
          button.textContent = original;
        });
    });
  });
})();
