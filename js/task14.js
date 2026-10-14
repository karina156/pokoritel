// Задание 14. Кириллица -> латиница по клику и алгоритмическая задача
const MAP = {
  "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e", "ж": "zh", "з": "z",
  "и": "i", "й": "i", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r",
  "с": "s", "т": "t", "у": "u", "ф": "f", "х": "kh", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch",
  "ъ": "ie", "ы": "y", "ь": "", "э": "e", "ю": "iu", "я": "ia"
};

function translit(s) {
  let out = "";
  for (const ch of s) {
    const low = ch.toLowerCase();
    if (!(low in MAP)) { out += ch; continue; }
    const r = MAP[low];
    out += ch === low ? r : r.charAt(0).toUpperCase() + r.slice(1);
  }
  return out;
}

// запоминаем исходный текст всех надписей паспорта
const nodes = Array.from(document.querySelectorAll("#passport [data-tr]"));
const labels = Array.from(document.querySelectorAll("#passport [data-tr-label]"));
nodes.forEach(function (n) { n.dataset.cyr = n.textContent; });

function setLatin(on) {
  nodes.forEach(function (n) { n.textContent = on ? translit(n.dataset.cyr) : n.dataset.cyr; });
  labels.forEach(function (p) {
    const cyr = p.dataset.trLabel;
    p.childNodes[0].nodeValue = on ? translit(cyr) : cyr;
  });
  document.getElementById("to_latin").disabled = on;
  document.getElementById("to_cyr").disabled = !on;
  document.getElementById("status").textContent = on
    ? "Сейчас данные показаны латиницей" : "Сейчас данные показаны кириллицей";
}

document.getElementById("to_latin").addEventListener("click", function () { setLatin(true); });
document.getElementById("to_cyr").addEventListener("click", function () { setLatin(false); });
