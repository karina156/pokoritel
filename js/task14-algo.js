// Задание 14 (вторая часть): алгоритмическая задача № 1015
// Сделано по примеру преподавателя 0121_abc.html.
// Кнопка «Проверить» считает ответ, «Отправить на сервер» отправляет форму вместе с ответом.

// Номер моей задачи (вариант 84). Если написать null, на странице появится выбор из всех задач.
const MY_TASK = 1015;

// Берём значение из поля по его id и превращаем текст в число
function getNumber(id) {
  const text = document.getElementById(id).value;
  return parseFloat(text);
}

// Красиво выводим число: целое как есть, дробное округляем до 4 знаков после запятой
function formatNumber(x) {
  if (Number.isInteger(x)) {
    return String(x);
  }
  return String(Number(x.toFixed(4)));
}

// Сортировка чисел по возрастанию (обычный sort сравнивает числа как строки)
function byAscending(a, b) {
  return a - b;
}

// Все задачи из списка.
// У каждой задачи есть:
//   text   — условие,
//   inputs — поля ввода в виде [id, подпись, значение по умолчанию],
//   solve  — функция, которая решает задачу и возвращает ответ строкой.
const TASKS = {

  1001: {
    text: "Имеется коробка со сторонами: A × B × C. Определить, пройдёт ли она в дверь с размерами M × K.",
    inputs: [["a", "A", 40], ["b", "B", 60], ["c", "C", 200], ["m", "M (ширина двери)", 80], ["k", "K (высота двери)", 200]],
    solve: function () {
      // Сортируем стороны, чтобы сравнивать самые маленькие с самыми маленькими
      const box = [getNumber("a"), getNumber("b"), getNumber("c")].sort(byAscending);
      const door = [getNumber("m"), getNumber("k")].sort(byAscending);

      // Коробку проносят самой узкой гранью, поэтому хватит двух меньших сторон
      if (box[0] < door[0] && box[1] < door[1]) {
        return "Коробка пройдёт в дверь";
      }
      return "Коробка не пройдёт в дверь";
    }
  },

  1002: {
    text: "Дано вещественное число. Определить, какое это число: положительное, отрицательное, ноль.",
    inputs: [["x", "Число", -3.5]],
    solve: function () {
      const x = getNumber("x");
      if (x > 0) {
        return "Положительное";
      }
      if (x < 0) {
        return "Отрицательное";
      }
      return "Ноль";
    }
  },

  1003: {
    text: "Можно ли из бревна, имеющего диаметр поперечного сечения D, выпилить квадратный брус шириной A?",
    inputs: [["d", "D (диаметр бревна)", 30], ["a", "A (ширина бруса)", 20]],
    solve: function () {
      const d = getNumber("d");
      const a = getNumber("a");
      // Диагональ квадрата равна A·√2, и она должна поместиться в круг диаметром D
      const diagonal = a * Math.SQRT2;
      if (diagonal <= d) {
        return "Можно: диагональ бруса A·√2 не больше D";
      }
      return "Нельзя: диагональ бруса A·√2 больше D";
    }
  },

  1004: {
    text: "Можно ли в квадратном зале площадью S поместить круглую сцену радиусом R так, чтобы от стены до сцены был проход не менее K?",
    inputs: [["s", "S (площадь зала)", 400], ["r", "R (радиус сцены)", 6], ["k", "K (проход)", 3]],
    solve: function () {
      const hallSide = Math.sqrt(getNumber("s")); // сторона квадратного зала
      const r = getNumber("r");
      const k = getNumber("k");
      // Сцена вместе с проходами с двух сторон занимает 2·(R + K)
      if (2 * (r + k) <= hallSide) {
        return "Можно";
      }
      return "Нельзя";
    }
  },

  1005: {
    text: "Дан номер места в плацкартном вагоне. Определить, какое это место: верхнее или нижнее, в купе или боковое.",
    inputs: [["n", "Номер места (1–54)", 38]],
    solve: function () {
      const n = getNumber("n");
      if (!Number.isInteger(n) || n < 1 || n > 54) {
        return "Такого места нет";
      }

      // В плацкарте нечётные места нижние, чётные верхние
      let level = "верхнее";
      if (n % 2 === 1) {
        level = "нижнее";
      }

      // Места с 1 по 36 стоят в купе по 4, остальные боковые
      if (n <= 36) {
        const coupe = Math.ceil(n / 4);
        return "Место " + level + ", в купе №" + coupe;
      }
      return "Место " + level + ", боковое";
    }
  },

  1006: {
    text: "Известна денежная сумма. Разменять её купюрами 500, 100, 10 и монетой 2 руб., если это возможно.",
    inputs: [["sum", "Сумма, руб.", 1736]],
    solve: function () {
      let rest = getNumber("sum");
      // Все номиналы чётные, поэтому нечётную сумму разменять нельзя
      if (!Number.isInteger(rest) || rest <= 0 || rest % 2 !== 0) {
        return "Разменять нельзя: все номиналы чётные";
      }

      const money = [500, 100, 10, 2];
      const parts = [];
      // Начинаем с самой крупной купюры и берём её столько раз, сколько помещается
      for (let i = 0; i < money.length; i++) {
        const count = Math.floor(rest / money[i]);
        rest = rest - count * money[i];
        if (count > 0) {
          parts.push(money[i] + " × " + count);
        }
      }
      return parts.join(", ");
    }
  },

  1007: {
    text: "Имеются две ёмкости: кубическая с ребром A, цилиндрическая с высотой H и радиусом основания R. Определить, поместится ли жидкость объёма M в первую ёмкость, во вторую, в обе.",
    inputs: [["a", "A (ребро куба)", 2], ["h", "H (высота цилиндра)", 3], ["r", "R (радиус цилиндра)", 1], ["m", "M (объём жидкости)", 9]],
    solve: function () {
      const a = getNumber("a");
      const h = getNumber("h");
      const r = getNumber("r");
      const m = getNumber("m");

      const cube = a * a * a;             // объём куба: A³
      const cylinder = Math.PI * r * r * h; // объём цилиндра: πR²H

      const fitsCube = m <= cube;
      const fitsCylinder = m <= cylinder;

      if (fitsCube && fitsCylinder) {
        return "Поместится в обе";
      }
      if (fitsCube) {
        return "Поместится только в кубическую";
      }
      if (fitsCylinder) {
        return "Поместится только в цилиндрическую";
      }
      return "Не поместится ни в одну";
    }
  },

  1008: {
    text: "Имеются две ёмкости: кубическая с ребром A, цилиндрическая с высотой H и радиусом основания R. Определить, можно ли заполнить жидкостью объёма M первую ёмкость, вторую, обе.",
    inputs: [["a", "A (ребро куба)", 2], ["h", "H (высота цилиндра)", 3], ["r", "R (радиус цилиндра)", 1], ["m", "M (объём жидкости)", 9]],
    solve: function () {
      const a = getNumber("a");
      const h = getNumber("h");
      const r = getNumber("r");
      const m = getNumber("m");

      const cube = a * a * a;
      const cylinder = Math.PI * r * r * h;

      // Здесь наоборот: жидкости должно хватить, чтобы заполнить ёмкость до краёв
      if (m >= cube + cylinder) {
        return "Можно заполнить обе";
      }
      if (m >= cube && m >= cylinder) {
        return "Можно заполнить любую одну, но не обе сразу";
      }
      if (m >= cube) {
        return "Можно заполнить только кубическую";
      }
      if (m >= cylinder) {
        return "Можно заполнить только цилиндрическую";
      }
      return "Нельзя заполнить ни одну";
    }
  },

  1009: {
    text: "Даны вещественные числа: X, Y, Z. Определить, существует ли треугольник с такими длинами сторон и, если существует, будет ли он прямоугольным.",
    inputs: [["x", "X", 3], ["y", "Y", 4], ["z", "Z", 5]],
    solve: function () {
      // После сортировки s[2] — самая длинная сторона
      const s = [getNumber("x"), getNumber("y"), getNumber("z")].sort(byAscending);

      // Треугольник существует, если сумма двух меньших сторон больше третьей
      if (s[0] <= 0 || s[0] + s[1] <= s[2]) {
        return "Треугольник не существует";
      }

      // Проверяем теорему Пифагора (с небольшим запасом на погрешность дробей)
      const difference = s[0] * s[0] + s[1] * s[1] - s[2] * s[2];
      if (Math.abs(difference) < 0.000000001) {
        return "Существует, прямоугольный";
      }
      return "Существует, не прямоугольный";
    }
  },

  1010: {
    text: "Дано число X. Определить, принадлежит ли это число заданному промежутку [a, b].",
    inputs: [["x", "X", 15], ["a", "a", 10], ["b", "b", 20]],
    solve: function () {
      const x = getNumber("x");
      const a = getNumber("a");
      const b = getNumber("b");
      if (x >= a && x <= b) {
        return "Принадлежит";
      }
      return "Не принадлежит";
    }
  },

  1011: {
    text: "Определить значение функции Z = 1/(XY) при произвольных X и Y.",
    inputs: [["x", "X", 2], ["y", "Y", 4]],
    solve: function () {
      const product = getNumber("x") * getNumber("y");
      // На ноль делить нельзя
      if (product === 0) {
        return "Не определено: деление на ноль";
      }
      return "Z = " + formatNumber(1 / product);
    }
  },

  1012: {
    text: "Даны вещественные числа: A, B, C. Определить, выполняются ли неравенства A < B < C или A < B > C и какое именно неравенство выполняется.",
    inputs: [["a", "A", 1], ["b", "B", 5], ["c", "C", 3]],
    solve: function () {
      const a = getNumber("a");
      const b = getNumber("b");
      const c = getNumber("c");
      if (a < b && b < c) {
        return "Выполняется A < B < C";
      }
      if (a < b && b > c) {
        return "Выполняется A < B > C";
      }
      return "Ни одно не выполняется";
    }
  },

  1013: {
    text: "Даны вещественные числа X и Y. Вычислить Z: Z = X·Y при X > Y, Z = ln(X + Y) в противном случае.",
    inputs: [["x", "X", 2], ["y", "Y", 5]],
    solve: function () {
      const x = getNumber("x");
      const y = getNumber("y");
      if (x > y) {
        return "Z = " + formatNumber(x * y);
      }
      // Логарифм есть только у положительных чисел
      if (x + y <= 0) {
        return "Не определено: ln от неположительного числа";
      }
      return "Z = " + formatNumber(Math.log(x + y));
    }
  },

  1014: {
    text: "Даны вещественные положительные числа a, b, c, d. Выясните, может ли прямоугольник со сторонами a, b уместиться внутри прямоугольника со сторонами c, d так, чтобы каждая сторона внутреннего прямоугольника была параллельна или перпендикулярна стороне внешнего прямоугольника.",
    inputs: [["a", "a", 3], ["b", "b", 7], ["c", "c", 8], ["d", "d", 4]],
    solve: function () {
      const a = getNumber("a");
      const b = getNumber("b");
      const c = getNumber("c");
      const d = getNumber("d");
      // Пробуем положить прямоугольник как есть и повернув на 90°
      const straight = a <= c && b <= d;
      const turned = a <= d && b <= c;
      if (straight || turned) {
        return "Уместится";
      }
      return "Не уместится";
    }
  },

  // Моя задача (вариант 84)
  1015: {
    text: "Дано вещественное число A. Вычислить x = a² + 4 + 5 при a < 62; в противном случае x = 1/a² + 4a + 5.",
    inputs: [["a", "A", 10]],
    solve: function () {
      const a = getNumber("a"); // число, которое ввели в поле A
      let x;

      if (a < 62) {
        x = a * a + 4 + 5;             // первая формула: a² + 4 + 5
      } else {
        x = 1 / (a * a) + 4 * a + 5;   // вторая формула: 1/a² + 4a + 5
      }

      return "x = " + formatNumber(x);
    }
  },

  1016: {
    text: "Дано вещественное число A. Вычислить x = 0 при a > 100; x = a при a < 61, в противном случае x = a⁴.",
    inputs: [["a", "A", 70]],
    solve: function () {
      const a = getNumber("a");
      let x;
      if (a > 100) {
        x = 0;
      } else if (a < 61) {
        x = a;
      } else {
        x = Math.pow(a, 4);
      }
      return "x = " + formatNumber(x);
    }
  },

  1017: {
    text: "Дано вещественное число A. Вычислить x = a⁴ при a < 10; x = a при a > 61, в противном случае x = a − sin(a²).",
    inputs: [["a", "A", 20]],
    solve: function () {
      const a = getNumber("a");
      let x;
      if (a < 10) {
        x = Math.pow(a, 4);
      } else if (a > 61) {
        x = a;
      } else {
        x = a - Math.sin(a * a);
      }
      return "x = " + formatNumber(x);
    }
  },

  1018: {
    text: "Известен год. Определить, будет ли этот год високосным, и к какому веку этот год относится.",
    inputs: [["year", "Год", 2007]],
    solve: function () {
      const year = getNumber("year");
      if (!Number.isInteger(year) || year < 1) {
        return "Введите год целым положительным числом";
      }

      // Високосный: делится на 4, но не на 100, либо делится на 400
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      // Век: 2007 / 100 = 20.07, округляем вверх и получаем 21
      const century = Math.ceil(year / 100);

      if (isLeap) {
        return "Високосный, " + century + " век";
      }
      return "Не високосный, " + century + " век";
    }
  }
};


// Элементы страницы algo.html, с которыми работаем
const form = document.getElementById("UserEnter");    // вся форма
const taskSelect = document.getElementById("task_no"); // выпадающий список с номерами задач
const resultField = document.getElementById("result"); // поле «Результат решения задачи»

// Заполняем выпадающий список номерами задач
for (const number in TASKS) {
  const option = document.createElement("option");
  option.value = number;
  option.textContent = "Задача " + number;
  taskSelect.appendChild(option);
}

// Показывает на странице задачу с нужным номером
function showTask(number) {
  const task = TASKS[number];
  taskSelect.value = number;

  // Условие задачи
  document.getElementById("task").value = task.text;

  // Поля ввода: для каждого делаем подпись и поле для числа
  let html = "";
  for (let i = 0; i < task.inputs.length; i++) {
    const id = task.inputs[i][0];
    const label = task.inputs[i][1];
    const value = task.inputs[i][2];
    html += '<label class="f">' + label +
      '<input id="' + id + '" name="' + id + '" type="number" step="any" value="' + value + '"></label>';
  }
  document.getElementById("inputs").innerHTML = html;

  // В чёрном блоке справа показываем код решения этой задачи
  // (убираем лишние 4 пробела в начале строк, которые остались от отступа внутри TASKS)
  const code = task.solve.toString().replace("function () ", "").replace(/\n    /g, "\n");
  document.getElementById("code").textContent = "// Задача " + number + "\nfunction solve() " + code;

  // Пока не нажали «Проверить», ответа нет
  resultField.value = "не определен";
}

// Выбрали другую задачу в списке — показываем её
taskSelect.addEventListener("change", function () {
  showTask(taskSelect.value);
});

// «Проверить»: решаем задачу и пишем ответ в поле результата
document.getElementById("verify").addEventListener("click", function () {
  resultField.value = TASKS[taskSelect.value].solve();
});

// «Отправить на сервер»: сначала решаем, чтобы ответ ушёл вместе с формой, потом отправляем
document.getElementById("send").addEventListener("click", function () {
  resultField.value = TASKS[taskSelect.value].solve();
  form.submit(); // POST на httpbin.org, ответ откроется в новой вкладке
});

// При открытии страницы сразу показываем мою задачу и прячем выбор номера
if (MY_TASK) {
  showTask(MY_TASK);
  document.getElementById("pick_wrap").hidden = true;
} else {
  showTask(1001);
}
