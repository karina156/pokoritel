// Задание 14 (вторая часть): алгоритмическая задача № 1015 (мой вариант 84)
// Сделано по примеру преподавателя 0121_abc.html.
// Кнопка «Проверить» считает ответ, «Отправить на сервер» отправляет форму вместе с ответом.
//
// Условие: дано вещественное число A.
// x = a² + 4 + 5 при a < 62; в противном случае x = 1/a² + 4a + 5.

const form = document.getElementById("UserEnter");    // вся форма
const inputA = document.getElementById("a");          // поле для числа A
const resultField = document.getElementById("result"); // поле «Результат решения задачи»

// Красиво выводим число: целое как есть, дробное округляем до 4 знаков после запятой
function formatNumber(x) {
  if (Number.isInteger(x)) {
    return String(x);
  }
  return String(Number(x.toFixed(4)));
}

// Решение задачи
function solve() {
  const a = parseFloat(inputA.value); // текст из поля -> число
  let x;

  if (a < 62) {
    x = a * a + 4 + 5;           // a² + 4 + 5
  } else {
    x = 1 / (a * a) + 4 * a + 5; // 1/a² + 4a + 5
  }

  return "x = " + formatNumber(x);
}

// В чёрном блоке справа показываем код решения
document.getElementById("code").textContent = "// Задача 1015\n" + solve.toString();

// «Проверить»: решаем задачу и пишем ответ в поле результата
document.getElementById("verify").addEventListener("click", function () {
  resultField.value = solve();
});

// «Отправить на сервер»: сначала решаем, чтобы ответ ушёл вместе с формой, потом отправляем
document.getElementById("send").addEventListener("click", function () {
  resultField.value = solve();
  form.submit(); // POST на httpbin.org, ответ откроется в новой вкладке
});
