// Общие скрипты для всех страниц сайта «Покоритель»

// Класс js на <html> говорит стилям, что скрипты включены
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {

  // ---------- Выпадающее меню «Ещё» в шапке ----------
  const moreMenu = document.querySelector(".more");

  if (moreMenu) {
    const moreButton = moreMenu.querySelector(".more-btn");

    moreButton.addEventListener("click", function () {
      moreMenu.classList.toggle("open");
      moreButton.setAttribute("aria-expanded", moreMenu.classList.contains("open"));
    });

    // Клик мимо меню закрывает его
    document.addEventListener("mousedown", function (event) {
      if (!moreMenu.contains(event.target)) {
        moreMenu.classList.remove("open");
      }
    });
  }

  // ---------- Мобильное меню (кнопка-бургер и «Закрыть») ----------
  const mobileMenu = document.querySelector(".mobile-menu");

  document.querySelectorAll("[data-menu]").forEach(function (button) {
    button.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
    });
  });

  // Esc закрывает оба меню
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }
    if (moreMenu) {
      moreMenu.classList.remove("open");
    }
    if (mobileMenu) {
      mobileMenu.classList.remove("open");
    }
  });

  // ---------- Блоки плавно появляются, когда до них докрутили ----------
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target); // один раз показали — больше не следим
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll("[data-reveal]").forEach(function (block) {
    revealObserver.observe(block);
  });

  // ---------- Частые вопросы: открыт только один ответ ----------
  const faqItems = document.querySelectorAll(".faq-item");

  document.querySelectorAll(".faq-item button").forEach(function (button) {
    button.addEventListener("click", function () {
      const item = button.parentElement;
      const wasOpen = item.classList.contains("open");

      // Сначала закрываем все вопросы
      faqItems.forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".sign").textContent = "+";
      });

      // Потом открываем тот, на который нажали (если он был закрыт)
      if (!wasOpen) {
        item.classList.add("open");
        item.querySelector(".sign").textContent = "–";
      }
    });
  });

  // ---------- Выбор толщины листа в карточке товара ----------
  document.querySelectorAll(".chips").forEach(function (group) {
    group.addEventListener("click", function (event) {
      const chip = event.target.closest(".chip");
      if (!chip) {
        return;
      }

      const wasSelected = chip.classList.contains("on");

      group.querySelectorAll(".chip").forEach(function (other) {
        other.classList.remove("on");
      });
      // Повторный клик по выбранной толщине снимает выбор
      if (!wasSelected) {
        chip.classList.add("on");
      }

      // Цена меняется на цену выбранной толщины (или возвращается обычная)
      const price = group.parentElement.querySelector(".price");
      if (price) {
        if (wasSelected) {
          price.textContent = price.dataset.base;
        } else {
          price.textContent = chip.dataset.price;
        }
      }
    });
  });

  // ---------- Толщины в одну строку, остальные под кнопкой «Ещё» ----------

  // Считает, на сколько строк сейчас разъехались видимые теги
  function countRows(group) {
    const rowCenters = [];
    group.querySelectorAll(".chip:not([hidden]), .more-chip:not([hidden])").forEach(function (chip) {
      const center = Math.round(chip.offsetTop + chip.offsetHeight / 2);
      // Теги с почти одинаковой высотой центра стоят в одной строке
      const sameRow = rowCenters.some(function (y) {
        return Math.abs(y - center) < 8;
      });
      if (!sameRow) {
        rowCenters.push(center);
      }
    });
    return rowCenters.length;
  }

  function fitChips(group) {
    const chips = Array.from(group.querySelectorAll(".chip:not(.more-chip)"));
    let moreChip = group.querySelector(".more-chip");

    // Начинаем с того, что показываем всё
    chips.forEach(function (chip) {
      chip.hidden = false;
    });
    if (moreChip) {
      moreChip.hidden = true;
    }

    // Всё влезло в одну строку — кнопка «Ещё» не нужна
    if (countRows(group) <= 1) {
      return;
    }

    if (!moreChip) {
      moreChip = document.createElement("button");
      moreChip.type = "button";
      moreChip.className = "more-chip";
      group.appendChild(moreChip);
    }
    moreChip.hidden = false;

    // Если список раскрыт, показываем всё и предлагаем «Скрыть»
    if (group.dataset.open === "1") {
      moreChip.textContent = "Скрыть";
      return;
    }

    // Иначе прячем теги с конца, пока не останется одна строка (выбранный не прячем)
    moreChip.textContent = "Ещё";
    for (let i = chips.length - 1; i > 0 && countRows(group) > 1; i--) {
      if (!chips[i].classList.contains("on")) {
        chips[i].hidden = true;
      }
    }
  }

  const chipGroups = document.querySelectorAll(".chips");

  chipGroups.forEach(function (group) {
    fitChips(group);

    // Нажали «Ещё» или «Скрыть» — раскрываем или сворачиваем теги.
    // true в конце: ловим клик раньше обработчика выбора толщины выше
    group.addEventListener("click", function (event) {
      if (!event.target.closest(".more-chip")) {
        return;
      }
      event.stopImmediatePropagation();

      if (group.dataset.open === "1") {
        group.dataset.open = "";
      } else {
        group.dataset.open = "1";
      }
      fitChips(group);
    }, true);
  });

  // При изменении размера окна пересчитываем, но не на каждый пиксель, а когда пользователь закончил
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      chipGroups.forEach(fitChips);
    }, 150);
  });

  // Когда загрузятся шрифты, ширина тегов может поменяться — тоже пересчитываем
  if (document.fonts) {
    document.fonts.ready.then(function () {
      chipGroups.forEach(fitChips);
    });
  }

  // ---------- Карусель каталога на главной ----------
  const carousel = document.querySelector(".carousel");
  const counter = document.querySelector(".counter");

  if (carousel && counter) {
    const total = carousel.children.length;
    let current = 0;

    // 3 -> "03", чтобы счётчик выглядел как «01 / 06»
    function twoDigits(number) {
      return String(number).padStart(2, "0");
    }

    function updateCounter() {
      counter.textContent = twoDigits(current + 1) + " / " + twoDigits(total);
    }

    function goToCard(index) {
      // Не даём уйти левее первой и правее последней карточки
      current = Math.max(0, Math.min(total - 1, index));

      const firstCard = carousel.firstElementChild;
      const left = carousel.children[current].offsetLeft - firstCard.offsetLeft;
      carousel.scrollTo({ left: left, behavior: "smooth" });

      updateCounter();
    }

    document.querySelector("[data-prev]").addEventListener("click", function () {
      goToCard(current - 1);
    });
    document.querySelector("[data-next]").addEventListener("click", function () {
      goToCard(current + 1);
    });

    // Если листают пальцем или колёсиком, узнаём текущую карточку, когда прокрутка остановилась
    let scrollTimer;
    carousel.addEventListener("scroll", function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        const cardWidth = carousel.firstElementChild.getBoundingClientRect().width + 22; // 22 — отступ между карточками
        const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 4;

        if (atEnd) {
          current = total - 1;
        } else {
          current = Math.round(carousel.scrollLeft / cardWidth);
        }
        updateCounter();
      }, 120);
    });

    updateCounter();
  }

  // ---------- Фильтр в каталоге ----------
  // Теги сверху показывают только выбранный тип фанеры.
  // Ссылка вида catalog.html#birch сразу открывает нужный тег.
  const catalogGrid = document.querySelector(".cat-grid");

  if (catalogGrid) {
    const tabs = document.querySelectorAll(".filters [data-type]");
    const types = Array.from(tabs).map(function (tab) {
      return tab.dataset.type;
    });

    function showType(type) {
      // Неизвестный тип в адресе — показываем всё
      if (!types.includes(type)) {
        type = "all";
      }

      catalogGrid.querySelectorAll(".product").forEach(function (product) {
        product.hidden = type !== "all" && product.dataset.type !== type;
        if (!product.hidden) {
          product.classList.add("in");
        }
      });

      tabs.forEach(function (tab) {
        tab.setAttribute("aria-selected", tab.dataset.type === type ? "true" : "false");
      });

      // Карточки поменялись — пусть теги толщин пересчитают «Ещё»
      window.dispatchEvent(new Event("resize"));
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        showType(tab.dataset.type);

        // Записываем выбранный тип в адрес, чтобы ссылкой можно было поделиться
        if (tab.dataset.type === "all") {
          history.replaceState(null, "", location.pathname);
        } else {
          history.replaceState(null, "", "#" + tab.dataset.type);
        }
      });
    });

    function showTypeFromAddress() {
      const type = decodeURIComponent(location.hash.slice(1)); // "#birch" -> "birch"
      showType(type);
    }

    showTypeFromAddress();
    window.addEventListener("hashchange", showTypeFromAddress);
  }

  // ---------- В поле «Дата отправки» по умолчанию стоит сегодняшняя дата ----------
  document.querySelectorAll("input[data-today]").forEach(function (input) {
    if (!input.value) {
      input.valueAsDate = new Date();
    }
  });
});
