// Задание 14. Кириллица -> латиница по клику
const MAP = { // таблица транслитерации: строчная русская буква → латинские буквы
  "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e", "ж": "zh", "з": "z", // буквы от «а» до «з»
  "и": "i", "й": "i", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", // буквы от «и» до «р»
  "с": "s", "т": "t", "у": "u", "ф": "f", "х": "kh", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch", // буквы от «с» до «щ»
  "ъ": "ie", "ы": "y", "ь": "", "э": "e", "ю": "iu", "я": "ia" // буквы от «ъ» до «я»; мягкий знак пропадает
}; // конец таблицы

function translit(s) { // функция переводит строку s с кириллицы на латиницу
  let out = ""; // сюда собираем результат
  for (const ch of s) { // перебираем строку по одному символу
    const low = ch.toLowerCase(); // приводим букву к строчной, чтобы найти её в таблице
    if (!(low in MAP)) { out += ch; continue; } // символа нет в таблице (цифра, пробел, двоеточие) — оставляем как есть
    const r = MAP[low]; // латинское написание буквы из таблицы
    out += ch === low ? r : r.charAt(0).toUpperCase() + r.slice(1); // если буква была заглавной, делаем заглавной первую латинскую букву
  } // конец перебора символов
  return out; // возвращаем готовую строку латиницей
} // конец функции translit

// запоминаем исходный текст всех надписей паспорта
const nodes = Array.from(document.querySelectorAll("#passport [data-tr]")); // все элементы паспорта с атрибутом data-tr (их переводим)
const labels = Array.from(document.querySelectorAll("#passport [data-tr-label]")); // абзацы с подписями «Фамилия:», «Имя:», «Год рождения:»
nodes.forEach(function (n) { n.dataset.cyr = n.textContent; }); // сохраняем русский текст каждого элемента в data-cyr, чтобы потом вернуть

function setLatin(on) { // on = true — показать латиницу, on = false — вернуть кириллицу
  nodes.forEach(function (n) { n.textContent = on ? translit(n.dataset.cyr) : n.dataset.cyr; }); // меняем текст каждого элемента
  labels.forEach(function (p) { // перебираем абзацы с подписями
    const cyr = p.dataset.trLabel; // русская подпись хранится в атрибуте data-tr-label
    p.childNodes[0].nodeValue = on ? translit(cyr) : cyr; // меняем только текстовый узел [0], чтобы не стереть <span> с данными
  }); // конец перебора подписей
  document.getElementById("to_latin").disabled = on; // кнопка «Изменить данные» неактивна, когда уже латиница
  document.getElementById("to_cyr").disabled = !on; // кнопка «Вернуть кириллицу» неактивна, когда уже кириллица
  document.getElementById("status").textContent = on // строка состояния под паспортом
    ? "Сейчас данные показаны латиницей" : "Сейчас данные показаны кириллицей"; // текст зависит от режима
} // конец функции setLatin

document.getElementById("to_latin").addEventListener("click", function () { setLatin(true); }); // клик «Изменить данные» → латиница
document.getElementById("to_cyr").addEventListener("click", function () { setLatin(false); }); // клик «Вернуть кириллицу» → кириллица
