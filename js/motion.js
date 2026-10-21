// Анимации сайта «Покоритель».
// Идеи взяты из статьи на sostav.ru: отклик на нажатие, появление при прокрутке,
// параллакс, бегущие счётчики, подсветка полей формы и всплывающие подсказки.

// Весь код обёрнут в функцию, чтобы его переменные не мешали другим скриптам
(function () {
  // Если человек в настройках системы попросил «уменьшить движение», анимации не показываем
  const lessMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const html = document.documentElement;
  html.classList.add("motion");
  if (lessMotion) {
    html.classList.add("reduce-motion");
  }

  document.addEventListener("DOMContentLoaded", function () {

    // 1. Первый экран: заголовок, текст и кнопка выезжают по очереди (сама анимация в CSS)
    requestAnimationFrame(function () {
      document.body.classList.add("loaded");
    });

    // 2. У шапки появляется тень, как только страницу начали прокручивать
    const header = document.querySelector(".site-header");

    function updateHeaderShadow() {
      if (header) {
        header.classList.toggle("scrolled", window.scrollY > 10);
      }
    }

    updateHeaderShadow();
    window.addEventListener("scroll", updateHeaderShadow, { passive: true });

    // 3. Карточки в сетках появляются не все сразу, а друг за другом
    const gridSelector = ".stats, .carousel, .cat-grid, .team, .steps, .type-list, .task-list, .faq, .passport, .faces";

    const gridObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("seen");
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(gridSelector).forEach(function (grid) {
      grid.setAttribute("data-stagger", "");

      // --i — порядковый номер карточки, по нему CSS считает задержку
      Array.from(grid.children).forEach(function (card, index) {
        card.style.setProperty("--i", index % 8);
      });

      if (lessMotion) {
        grid.classList.add("seen");
      } else {
        gridObserver.observe(grid);
      }
    });

    // 4. Цифры «1500+», «13 лет», «98%» набегают от нуля, когда блок появился на экране
    function runCounter(textNode) {
      // Делим текст на число и хвост: "1500+" -> 1500 и "+"
      const match = textNode.textContent.match(/^(\d+)(.*)$/);
      if (!match) {
        return;
      }

      const target = Number(match[1]);
      const tail = match[2];
      const start = performance.now();
      const duration = 1400; // мс

      function step(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3); // в конце счёт замедляется
        textNode.textContent = Math.round(target * eased) + tail;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }
        counterObserver.unobserve(entry.target);

        // Меняем только текст с цифрой, подпись внутри <strong> не трогаем
        const textNode = entry.target.firstChild;
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          runCounter(textNode);
        }
      });
    }, { threshold: 0.5 });

    if (!lessMotion) {
      document.querySelectorAll(".stat strong").forEach(function (number) {
        counterObserver.observe(number);
      });
    }

    // 5. Параллакс: фотографии едут чуть медленнее страницы (только на больших экранах)
    const photos = document.querySelectorAll(".photo-card img, .about-banner img, .type .img img");
    let waitingForFrame = false;

    function movePhotos() {
      waitingForFrame = false;
      const screenHeight = window.innerHeight;

      photos.forEach(function (photo) {
        const box = photo.getBoundingClientRect();
        // Фото за пределами экрана не двигаем
        if (box.bottom < 0 || box.top > screenHeight) {
          return;
        }
        // shift от −1 (фото вверху экрана) до 1 (внизу)
        const shift = (box.top + box.height / 2 - screenHeight / 2) / screenHeight;
        photo.style.transform = "scale(1.12) translateY(" + (shift * -30).toFixed(1) + "px)";
      });
    }

    if (!lessMotion && window.matchMedia("(min-width: 1000px)").matches) {
      window.addEventListener("scroll", function () {
        // Пересчитываем не чаще одного раза за кадр
        if (!waitingForFrame) {
          waitingForFrame = true;
          requestAnimationFrame(movePhotos);
        }
      }, { passive: true });
      movePhotos();
    }

    // 6. Поля формы подсвечиваются зелёным или красным, когда из них ушли
    // Телефон: от 10 до 18 символов из цифр, пробелов, скобок, дефисов и «+»
    document.querySelectorAll('input[type="tel"]').forEach(function (phone) {
      if (!phone.pattern) {
        phone.pattern = "[+0-9 \\(\\)\\-]{10,18}";
      }
      if (!phone.title) {
        phone.title = "Например, +7 919 753-01-01";
      }
    });

    const formFields = document.querySelectorAll(
      "form input:not([type=hidden]):not([type=radio]):not([type=checkbox]), form select, form textarea"
    );

    formFields.forEach(function (field) {
      // Класс touched включает подсветку в CSS: пустые поля не подсвечиваем
      field.addEventListener("blur", function () {
        if (field.value !== "") {
          field.classList.add("touched");
        }
      });
    });

    // 7. Всплывающая подсказка внизу экрана
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status"); // экранные дикторы прочитают её вслух
    document.body.appendChild(toast);

    let hideTimer;

    // Делаем функцию общей, чтобы её мог вызвать order-form.js
    window.showToast = function (text) {
      toast.textContent = text;
      toast.classList.add("show");

      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        toast.classList.remove("show");
      }, 3200);
    };

    document.querySelectorAll("form[action]").forEach(function (form) {
      form.addEventListener("submit", function () {
        // У формы заказа своя подсказка
        if (form.dataset.ownToast) {
          return;
        }
        window.showToast("Готово! Ответ сервера откроется в новой вкладке");
      });
    });

    // 8. Кнопка чуть «проседает», когда на неё нажимают
    document.addEventListener("pointerdown", function (event) {
      const button = event.target.closest(".btn, .btn-o, .chip, .filters button, .phone-row button");
      if (!button) {
        return;
      }
      button.classList.add("pressed");
      setTimeout(function () {
        button.classList.remove("pressed");
      }, 180);
    });
  });
})();
