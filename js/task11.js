// Задание 11. Форма отправки личных контактных данных: данные уходят на сервер (новая вкладка), а на странице появляется список отправленного
const form = document.getElementById("contacts");
const fill = form.querySelector(".fill");
const sent = form.querySelector(".sent");
const labels = { last_name: "Фамилия", first_name: "Имя", phone: "Номер телефона", group: "Группа", email: "Почтовый адрес", send_date: "Дата отправки" };

form.addEventListener("submit", function () {
  const dl = form.querySelector(".sent-rows");
  dl.innerHTML = "";
  new FormData(form).forEach(function (v, k) {
    if (!(k in labels)) return;
    const dt = document.createElement("dt"); dt.textContent = labels[k];
    const dd = document.createElement("dd"); dd.textContent = String(v) || "—";
    dl.append(dt, dd);
  });
  setTimeout(function () { fill.hidden = true; sent.hidden = false; }, 0);
});

document.getElementById("refill").addEventListener("click", function () {
  form.reset(); sent.hidden = true; fill.hidden = false;
});
