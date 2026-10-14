// Общие скрипты сайта «Покоритель»
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  // Выпадающее меню «Ещё»
  const more = document.querySelector(".more");
  if (more) {
    const btn = more.querySelector(".more-btn");
    btn.addEventListener("click", function () {
      more.classList.toggle("open");
      btn.setAttribute("aria-expanded", more.classList.contains("open"));
    });
    document.addEventListener("mousedown", function (e) {
      if (!more.contains(e.target)) more.classList.remove("open");
    });
  }

  // Мобильное меню
  const menu = document.querySelector(".mobile-menu");
  document.querySelectorAll("[data-menu]").forEach(function (b) {
    b.addEventListener("click", function () { menu.classList.toggle("open"); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (more) more.classList.remove("open");
      if (menu) menu.classList.remove("open");
    }
  });

  // Появление блоков при прокрутке
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll("[data-reveal]").forEach(function (el) { io.observe(el); });

  // Частые вопросы: открыт один пункт
  document.querySelectorAll(".faq-item button").forEach(function (b) {
    b.addEventListener("click", function () {
      const item = b.parentElement;
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(function (i) {
        i.classList.remove("open");
        i.querySelector(".sign").textContent = "+";
      });
      if (!wasOpen) { item.classList.add("open"); item.querySelector(".sign").textContent = "–"; }
    });
  });

  // Выбор толщины листа
  document.querySelectorAll(".chips").forEach(function (group) {
    group.addEventListener("click", function (e) {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      const on = chip.classList.contains("on");
      group.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("on"); });
      if (!on) chip.classList.add("on");
      // цена выбранной толщины
      const price = group.parentElement.querySelector(".price");
      if (price) price.textContent = on ? price.dataset.base : chip.dataset.price;
    });
  });

  // Толщины: одна строка, остальное — под текстовой кнопкой «Ещё» / «Скрыть»
  function fitChips(group) {
    const chips = Array.from(group.querySelectorAll(".chip:not(.more-chip)"));
    let more = group.querySelector(".more-chip");
    chips.forEach(function (c) { c.hidden = false; });
    if (more) more.hidden = true;
    const rows = function () {
      const tops = [];
      group.querySelectorAll(".chip:not([hidden]), .more-chip:not([hidden])").forEach(function (c) {
        const y = Math.round(c.offsetTop + c.offsetHeight / 2);
        if (!tops.some(function (t) { return Math.abs(t - y) < 8; })) tops.push(y);
      });
      return tops.length;
    };
    if (rows() <= 1) return;
    if (!more) {
      more = document.createElement("button");
      more.type = "button";
      more.className = "more-chip";
      group.appendChild(more);
    }
    more.hidden = false;
    if (group.dataset.open === "1") { more.textContent = "Скрыть"; return; }
    more.textContent = "Ещё";
    for (let i = chips.length - 1; i > 0 && rows() > 1; i--) {
      if (!chips[i].classList.contains("on")) chips[i].hidden = true;
    }
  }
  const chipGroups = document.querySelectorAll(".chips");
  chipGroups.forEach(function (group) {
    fitChips(group);
    group.addEventListener("click", function (e) {
      if (!e.target.closest(".more-chip")) return;
      e.stopImmediatePropagation();
      group.dataset.open = group.dataset.open === "1" ? "" : "1";
      fitChips(group);
    }, true);
  });
  let rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { chipGroups.forEach(fitChips); }, 150);
  });
  if (document.fonts) document.fonts.ready.then(function () { chipGroups.forEach(fitChips); });

  // Карусель каталога на главной
  const car = document.querySelector(".carousel");
  if (car && document.querySelector(".counter")) {
    const counter = document.querySelector(".counter");
    const n = car.children.length;
    let cur = 0;
    const pad = function (x) { return String(x).padStart(2, "0"); };
    const show = function () { counter.textContent = pad(cur + 1) + " / " + pad(n); };
    const go = function (i) {
      cur = Math.max(0, Math.min(n - 1, i));
      car.scrollTo({ left: car.children[cur].offsetLeft - car.firstElementChild.offsetLeft, behavior: "smooth" });
      show();
    };
    document.querySelector("[data-prev]").addEventListener("click", function () { go(cur - 1); });
    document.querySelector("[data-next]").addEventListener("click", function () { go(cur + 1); });
    let t;
    car.addEventListener("scroll", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        const w = car.firstElementChild.getBoundingClientRect().width + 22;
        const atEnd = car.scrollLeft + car.clientWidth >= car.scrollWidth - 4;
        cur = atEnd ? n - 1 : Math.round(car.scrollLeft / w);
        show();
      }, 120);
    });
    show();
  }

  // Фильтр-бар каталога: теги сверху показывают только выбранный тип.
  // Закладка в адресе (catalog.html#birch) выбирает тег при открытии.
  const grid = document.querySelector(".cat-grid");
  if (grid) {
    const tabs = document.querySelectorAll(".filters [data-type]");
    const types = Array.prototype.map.call(tabs, function (t) { return t.dataset.type; });
    const apply = function (type) {
      if (types.indexOf(type) < 0) type = "all";
      grid.querySelectorAll(".product").forEach(function (p) {
        p.hidden = type !== "all" && p.dataset.type !== type;
        if (!p.hidden) p.classList.add("in");
      });
      tabs.forEach(function (t) { t.setAttribute("aria-selected", t.dataset.type === type ? "true" : "false"); });
      window.dispatchEvent(new Event("resize")); // пересчитать «Ещё» у тегов размеров
    };
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        apply(t.dataset.type);
        history.replaceState(null, "", t.dataset.type === "all" ? location.pathname : "#" + t.dataset.type);
      });
    });
    const fromHash = function () { apply(decodeURIComponent(location.hash.slice(1))); };
    fromHash();
    window.addEventListener("hashchange", fromHash);
  }

  // Дата отправки по умолчанию — сегодня
  document.querySelectorAll("input[data-today]").forEach(function (i) {
    if (!i.value) i.valueAsDate = new Date();
  });
});
