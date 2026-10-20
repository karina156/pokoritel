// Задание 11. Форма отправки личных контактных данных: данные уходят на сервер (новая вкладка), а на странице появляется список отправленного
const form = document.getElementById("contacts"); // находим форму по её id="contacts" (tasks.html)
const fill = form.querySelector(".fill"); // блок с полями для заполнения
const sent = form.querySelector(".sent"); // блок «Данные отправлены», сначала скрыт
// подписи для полей: имя поля (атрибут name) → понятное название на русском
const labels = { last_name: "Фамилия", first_name: "Имя", phone: "Номер телефона", group: "Группа", email: "Почтовый адрес", send_date: "Дата отправки" };

form.addEventListener("submit", function () { // срабатывает, когда форма отправляется на сервер
  const dl = form.querySelector(".sent-rows"); // список <dl>, куда выведем отправленные данные
  dl.innerHTML = ""; // очищаем список от прошлой отправки
  new FormData(form).forEach(function (v, k) { // перебираем все поля формы: k — имя поля, v — введённое значение
    if (!(k in labels)) return; // служебные поля (например, скрытое form_name) не показываем
    const dt = document.createElement("dt"); dt.textContent = labels[k]; // создаём название строки, например «Фамилия»
    const dd = document.createElement("dd"); dd.textContent = String(v) || "—"; // создаём значение; если поле пустое, ставим прочерк
    dl.append(dt, dd); // добавляем название и значение в список
  }); // конец перебора полей
  // setTimeout(..., 0) ждёт, пока браузер отправит форму, и только потом прячет поля и показывает список
  setTimeout(function () { fill.hidden = true; sent.hidden = false; }, 0);
}); // конец обработчика отправки

document.getElementById("refill").addEventListener("click", function () { // кнопка «Заполнить заново»
  form.reset(); sent.hidden = true; fill.hidden = false; // очищаем поля, прячем список, снова показываем форму
}); // конец обработчика кнопки
