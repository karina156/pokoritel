// Анимации сайта «Покоритель»: микро-отклики, появление при прокрутке,
// параллакс, счётчики, «умные» поля форм и всплывающие подсказки.
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  root.classList.add("motion");
  if (reduce) root.classList.add("reduce-motion");

  document.addEventListener("DOMContentLoaded", function () {
    // 1. Первый экран: заголовок, текст и кнопка выезжают по очереди
    requestAnimationFrame(function () { document.body.classList.add("loaded"); });

    // 2. Шапка: тень при прокрутке
    const header = document.querySelector(".site-header");
    const onScrollHeader = function () { if (header) header.classList.toggle("scrolled", window.scrollY > 10); };
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });

    // 3. Карточки в сетках появляются друг за другом
    const groups = ".stats, .carousel, .cat-grid, .team, .steps, .type-list, .task-list, .faq, .passport, .faces";
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("seen"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(groups).forEach(function (g) {
      g.setAttribute("data-stagger", "");
      Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty("--i", i % 8); });
      if (reduce) g.classList.add("seen"); else io.observe(g);
    });

    // 4. Счётчики «1500+», «13 лет», «98%» набегают при появлении
    const counters = document.querySelectorAll(".stat b");
    const cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        const node = en.target.firstChild;
        if (!node || node.nodeType !== 3) return;
        const m = node.textContent.match(/^(\d+)(.*)$/);
        if (!m) return;
        const end = +m[1], tail = m[2], t0 = performance.now(), dur = 1400;
        const step = function (t) {
          const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
          node.textContent = Math.round(end * e) + tail;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    if (!reduce) counters.forEach(function (c) { cio.observe(c); });

    // 5. Параллакс: фото двигаются медленнее страницы (только на больших экранах)
    const layers = document.querySelectorAll(".photo-card img, .about-banner img, .type .img img");
    let ticking = false;
    const parallax = function () {
      ticking = false;
      const vh = window.innerHeight;
      layers.forEach(function (el) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // −1…1
        el.style.transform = "scale(1.12) translateY(" + (p * -30).toFixed(1) + "px)";
      });
    };
    if (!reduce && window.matchMedia("(min-width: 1000px)").matches) {
      window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } }, { passive: true });
      parallax();
    }

    // 6. Умные формы: поле подсвечивается, когда заполнено верно или с ошибкой
    document.querySelectorAll('input[type="tel"]').forEach(function (i) {
      if (!i.pattern) i.pattern = "[+0-9 ()\\-]{10,18}";
      if (!i.title) i.title = "Например, +7 919 753-01-01";
    });
    document.querySelectorAll("form input:not([type=hidden]):not([type=radio]):not([type=checkbox]), form select, form textarea").forEach(function (f) {
      const mark = function () { if (f.value !== "") f.classList.add("touched"); };
      f.addEventListener("blur", mark);
      f.addEventListener("input", function () { if (f.classList.contains("touched")) f.classList.add("touched"); });
    });

    // 7. Подсказка после отправки формы
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
    let tt;
    window.showToast = function (text) {
      toast.textContent = text;
      toast.classList.add("show");
      clearTimeout(tt);
      tt = setTimeout(function () { toast.classList.remove("show"); }, 3200);
    };
    document.querySelectorAll("form[action]").forEach(function (f) {
      f.addEventListener("submit", function () {
        window.showToast("Готово! Ответ сервера откроется в новой вкладке");
      });
    });

    // 8. Отклик на нажатие: кнопка «проседает» под пальцем
    document.addEventListener("pointerdown", function (e) {
      const b = e.target.closest(".btn, .btn-o, .chip, .filters button, .phone-row button");
      if (!b) return;
      b.classList.add("pressed");
      setTimeout(function () { b.classList.remove("pressed"); }, 180);
    });
  });
})();
