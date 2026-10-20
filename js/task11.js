// Задание 11. Форма с личными контактными данными.
// Данные уходят на сервер (ответ открывается в новой вкладке),
// а на странице вместо формы появляется список того, что я отправила.

const contactsForm = document.getElementById("contacts");
const fillBlock = contactsForm.querySelector(".fill"); // поля, которые заполняем
const sentBlock = contactsForm.querySelector(".sent"); // блок «Данные отправлены», сначала скрыт

// Как называть поля в списке: name поля -> подпись по-русски
const fieldNames = {
  last_name: "Фамилия",
  first_name: "Имя",
  phone: "Номер телефона",
  group: "Группа",
  email: "Почтовый адрес",
  send_date: "Дата отправки"
};

contactsForm.addEventListener("submit", function () {
  const list = contactsForm.querySelector(".sent-rows");
  list.innerHTML = ""; // убираем то, что осталось от прошлой отправки

  // FormData собирает все поля формы: key — имя поля, value — что в нём написано
  const data = new FormData(contactsForm);
  data.forEach(function (value, key) {
    // скрытое поле form_name нужно только серверу, его не показываем
    if (!(key in fieldNames)) {
      return;
    }

    const title = document.createElement("dt");
    title.textContent = fieldNames[key];

    const text = document.createElement("dd");
    text.textContent = value || "—"; // если поле пустое, ставим прочерк

    list.append(title, text);
  });

  // Прячем форму не сразу, а после того как браузер её отправит
  setTimeout(function () {
    fillBlock.hidden = true;
    sentBlock.hidden = false;
  }, 0);
});

// Кнопка «Заполнить заново» очищает форму и возвращает поля
document.getElementById("refill").addEventListener("click", function () {
  contactsForm.reset();
  sentBlock.hidden = true;
  fillBlock.hidden = false;
});
