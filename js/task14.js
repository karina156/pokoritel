// Задание 14. По кнопке меняем данные в паспорте с кириллицы на латиницу и обратно.

// Как каждая русская буква пишется латиницей
const LETTERS = {
  "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e", "ж": "zh", "з": "z",
  "и": "i", "й": "i", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r",
  "с": "s", "т": "t", "у": "u", "ф": "f", "х": "kh", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch",
  "ъ": "ie", "ы": "y", "ь": "", "э": "e", "ю": "iu", "я": "ia"
};

// Переводит строку на латиницу: «Манукян» -> «Manukian»
function toLatin(text) {
  let result = "";

  for (const letter of text) {
    const small = letter.toLowerCase();

    // Цифры, пробелы и знаки препинания оставляем как есть
    if (!(small in LETTERS)) {
      result += letter;
      continue;
    }

    const latin = LETTERS[small];
    if (letter === small) {
      result += latin;
    } else {
      // Буква была заглавной, значит и латинскую делаем с большой
      result += latin.charAt(0).toUpperCase() + latin.slice(1);
    }
  }

  return result;
}

// Всё, что нужно переводить, помечено в HTML атрибутом data-tr
const textParts = document.querySelectorAll("#passport [data-tr]");
// Подписи «Фамилия:», «Имя:», «Год рождения:» стоят в абзацах с data-tr-label
const labels = document.querySelectorAll("#passport [data-tr-label]");

// Запоминаем русский текст, чтобы потом его вернуть
textParts.forEach(function (part) {
  part.dataset.cyr = part.textContent;
});

const latinButton = document.getElementById("to_latin");
const cyrButton = document.getElementById("to_cyr");
const status = document.getElementById("status");

// latin = true — показываем латиницу, false — возвращаем кириллицу
function switchAlphabet(latin) {
  textParts.forEach(function (part) {
    if (latin) {
      part.textContent = toLatin(part.dataset.cyr);
    } else {
      part.textContent = part.dataset.cyr;
    }
  });

  labels.forEach(function (paragraph) {
    const russian = paragraph.dataset.trLabel;
    // Меняем только текст подписи (узел [0]), иначе сотрётся <span> с данными
    if (latin) {
      paragraph.childNodes[0].nodeValue = toLatin(russian);
    } else {
      paragraph.childNodes[0].nodeValue = russian;
    }
  });

  // Нажать можно только ту кнопку, которая что-то поменяет
  latinButton.disabled = latin;
  cyrButton.disabled = !latin;

  if (latin) {
    status.textContent = "Сейчас данные показаны латиницей";
  } else {
    status.textContent = "Сейчас данные показаны кириллицей";
  }
}

latinButton.addEventListener("click", function () {
  switchAlphabet(true);
});

cyrButton.addEventListener("click", function () {
  switchAlphabet(false);
});
