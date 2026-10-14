// Задание 14 (вторая часть). Решение алгоритмической задачи № 1015 (пример преподавателя: 0121_abc.html).
// «Проверить» решает задачу, «Отправить на сервер» отправляет форму со всеми данными.
// MY_TASK — номер задачи из списка. null — показывать выбор из всех 18 задач.
const MY_TASK = 1015;

const num = function (id) { return parseFloat(document.getElementById(id).value); };
const fmt = function (x) { return Number.isInteger(x) ? String(x) : String(+x.toFixed(4)); };

const TASKS = {
  1001: { text: "Имеется коробка со сторонами: A × B × C. Определить, пройдёт ли она в дверь с размерами M × K.",
    inputs: [["a", "A", 40], ["b", "B", 60], ["c", "C", 200], ["m", "M (ширина двери)", 80], ["k", "K (высота двери)", 200]],
    solve: function () {
      const box = [num("a"), num("b"), num("c")].sort(function (x, y) { return x - y; });
      const door = [num("m"), num("k")].sort(function (x, y) { return x - y; });
      return box[0] < door[0] && box[1] < door[1] ? "Коробка пройдёт в дверь" : "Коробка не пройдёт в дверь";
    } },
  1002: { text: "Дано вещественное число. Определить, какое это число: положительное, отрицательное, ноль.",
    inputs: [["x", "Число", -3.5]],
    solve: function () { const x = num("x"); return x > 0 ? "Положительное" : x < 0 ? "Отрицательное" : "Ноль"; } },
  1003: { text: "Можно ли из бревна, имеющего диаметр поперечного сечения D, выпилить квадратный брус шириной A?",
    inputs: [["d", "D (диаметр бревна)", 30], ["a", "A (ширина бруса)", 20]],
    solve: function () { return num("a") * Math.SQRT2 <= num("d") ? "Можно: диагональ бруса A·√2 не больше D" : "Нельзя: диагональ бруса A·√2 больше D"; } },
  1004: { text: "Можно ли в квадратном зале площадью S поместить круглую сцену радиусом R так, чтобы от стены до сцены был проход не менее K?",
    inputs: [["s", "S (площадь зала)", 400], ["r", "R (радиус сцены)", 6], ["k", "K (проход)", 3]],
    solve: function () { return 2 * (num("r") + num("k")) <= Math.sqrt(num("s")) ? "Можно" : "Нельзя"; } },
  1005: { text: "Дан номер места в плацкартном вагоне. Определить, какое это место: верхнее или нижнее, в купе или боковое.",
    inputs: [["n", "Номер места (1–54)", 38]],
    solve: function () {
      const n = num("n");
      if (!Number.isInteger(n) || n < 1 || n > 54) return "Такого места нет";
      const level = n % 2 ? "нижнее" : "верхнее";
      return n <= 36 ? "Место " + level + ", в купе №" + Math.ceil(n / 4) : "Место " + level + ", боковое";
    } },
  1006: { text: "Известна денежная сумма. Разменять её купюрами 500, 100, 10 и монетой 2 руб., если это возможно.",
    inputs: [["sum", "Сумма, руб.", 1736]],
    solve: function () {
      let s = num("sum");
      if (!Number.isInteger(s) || s <= 0 || s % 2) return "Разменять нельзя: все номиналы чётные";
      const out = [];
      [500, 100, 10, 2].forEach(function (v) { const c = Math.floor(s / v); s -= c * v; if (c) out.push(v + " × " + c); });
      return out.join(", ");
    } },
  1007: { text: "Имеются две ёмкости: кубическая с ребром A, цилиндрическая с высотой H и радиусом основания R. Определить, поместится ли жидкость объёма M в первую ёмкость, во вторую, в обе.",
    inputs: [["a", "A (ребро куба)", 2], ["h", "H (высота цилиндра)", 3], ["r", "R (радиус цилиндра)", 1], ["m", "M (объём жидкости)", 9]],
    solve: function () {
      const v1 = Math.pow(num("a"), 3), v2 = Math.PI * num("r") * num("r") * num("h"), m = num("m");
      const a = m <= v1, b = m <= v2;
      return a && b ? "Поместится в обе" : a ? "Поместится только в кубическую" : b ? "Поместится только в цилиндрическую" : "Не поместится ни в одну";
    } },
  1008: { text: "Имеются две ёмкости: кубическая с ребром A, цилиндрическая с высотой H и радиусом основания R. Определить, можно ли заполнить жидкостью объёма M первую ёмкость, вторую, обе.",
    inputs: [["a", "A (ребро куба)", 2], ["h", "H (высота цилиндра)", 3], ["r", "R (радиус цилиндра)", 1], ["m", "M (объём жидкости)", 9]],
    solve: function () {
      const v1 = Math.pow(num("a"), 3), v2 = Math.PI * num("r") * num("r") * num("h"), m = num("m");
      const a = m >= v1, b = m >= v2, both = m >= v1 + v2;
      return both ? "Можно заполнить обе" : a && b ? "Можно заполнить любую одну, но не обе сразу" : a ? "Можно заполнить только кубическую" : b ? "Можно заполнить только цилиндрическую" : "Нельзя заполнить ни одну";
    } },
  1009: { text: "Даны вещественные числа: X, Y, Z. Определить, существует ли треугольник с такими длинами сторон и, если существует, будет ли он прямоугольным.",
    inputs: [["x", "X", 3], ["y", "Y", 4], ["z", "Z", 5]],
    solve: function () {
      const s = [num("x"), num("y"), num("z")].sort(function (p, q) { return p - q; });
      if (s[0] <= 0 || s[0] + s[1] <= s[2]) return "Треугольник не существует";
      return Math.abs(s[0] * s[0] + s[1] * s[1] - s[2] * s[2]) < 1e-9 ? "Существует, прямоугольный" : "Существует, не прямоугольный";
    } },
  1010: { text: "Дано число X. Определить, принадлежит ли это число заданному промежутку [a, b].",
    inputs: [["x", "X", 15], ["a", "a", 10], ["b", "b", 20]],
    solve: function () { const x = num("x"); return x >= num("a") && x <= num("b") ? "Принадлежит" : "Не принадлежит"; } },
  1011: { text: "Определить значение функции Z = 1/(XY) при произвольных X и Y.",
    inputs: [["x", "X", 2], ["y", "Y", 4]],
    solve: function () { const p = num("x") * num("y"); return p === 0 ? "Не определено: деление на ноль" : "Z = " + fmt(1 / p); } },
  1012: { text: "Даны вещественные числа: A, B, C. Определить, выполняются ли неравенства A < B < C или A < B > C и какое именно неравенство выполняется.",
    inputs: [["a", "A", 1], ["b", "B", 5], ["c", "C", 3]],
    solve: function () {
      const a = num("a"), b = num("b"), c = num("c");
      return a < b && b < c ? "Выполняется A < B < C" : a < b && b > c ? "Выполняется A < B > C" : "Ни одно не выполняется";
    } },
  1013: { text: "Даны вещественные числа X и Y. Вычислить Z: Z = X·Y при X > Y, Z = ln(X + Y) в противном случае.",
    inputs: [["x", "X", 2], ["y", "Y", 5]],
    solve: function () {
      const x = num("x"), y = num("y");
      if (x > y) return "Z = " + fmt(x * y);
      return x + y > 0 ? "Z = " + fmt(Math.log(x + y)) : "Не определено: ln от неположительного числа";
    } },
  1014: { text: "Даны вещественные положительные числа a, b, c, d. Выясните, может ли прямоугольник со сторонами a, b уместиться внутри прямоугольника со сторонами c, d так, чтобы каждая сторона внутреннего прямоугольника была параллельна или перпендикулярна стороне внешнего прямоугольника.",
    inputs: [["a", "a", 3], ["b", "b", 7], ["c", "c", 8], ["d", "d", 4]],
    solve: function () {
      const a = num("a"), b = num("b"), c = num("c"), d = num("d");
      return (a <= c && b <= d) || (a <= d && b <= c) ? "Уместится" : "Не уместится";
    } },
  1015: { text: "Дано вещественное число A. Вычислить x = a² + 4 + 5 при a < 62; в противном случае x = 1/a² + 4a + 5.",
    inputs: [["a", "A", 10]],
    solve: function () { const a = num("a"); return "x = " + fmt(a < 62 ? a * a + 4 + 5 : 1 / (a * a) + 4 * a + 5); } },
  1016: { text: "Дано вещественное число A. Вычислить x = 0 при a > 100; x = a при a < 61, в противном случае x = a⁴.",
    inputs: [["a", "A", 70]],
    solve: function () { const a = num("a"); return "x = " + fmt(a > 100 ? 0 : a < 61 ? a : Math.pow(a, 4)); } },
  1017: { text: "Дано вещественное число A. Вычислить x = a⁴ при a < 10; x = a при a > 61, в противном случае x = a − sin(a²).",
    inputs: [["a", "A", 20]],
    solve: function () { const a = num("a"); return "x = " + fmt(a < 10 ? Math.pow(a, 4) : a > 61 ? a : a - Math.sin(a * a)); } },
  1018: { text: "Известен год. Определить, будет ли этот год високосным, и к какому веку этот год относится.",
    inputs: [["year", "Год", 2007]],
    solve: function () {
      const y = num("year");
      if (!Number.isInteger(y) || y < 1) return "Введите год целым положительным числом";
      const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
      return (leap ? "Високосный" : "Не високосный") + ", " + Math.ceil(y / 100) + " век";
    } },
};

const form = document.getElementById("UserEnter");
const pick = document.getElementById("task_no");
const result = document.getElementById("result");

Object.keys(TASKS).forEach(function (n) {
  const o = document.createElement("option");
  o.value = n; o.textContent = "Задача " + n;
  pick.appendChild(o);
});

function show(n) {
  const t = TASKS[n];
  pick.value = n;
  document.getElementById("task").value = t.text;
  document.getElementById("inputs").innerHTML = t.inputs.map(function (i) {
    return '<label class="f">' + i[1] + '<input id="' + i[0] + '" name="' + i[0] + '" type="number" step="any" value="' + i[2] + '"></label>';
  }).join("");
  document.getElementById("code").textContent = "// Задача " + n + "\nfunction solve() " + t.solve.toString().replace(/^function \(\) /, "");
  result.value = "не определен";
}

pick.addEventListener("change", function () { show(pick.value); });
document.getElementById("verify").addEventListener("click", function () {
  result.value = TASKS[pick.value].solve();
});
document.getElementById("send").addEventListener("click", function () {
  result.value = TASKS[pick.value].solve();
  form.submit();
});

if (MY_TASK) {
  show(MY_TASK);
  document.getElementById("pick_wrap").hidden = true;
} else {
  show(1001);
}
