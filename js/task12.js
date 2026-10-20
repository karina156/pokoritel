// Задание 12. Форма отправки тематических данных (заказ фанеры)
// Перед отправкой проверяем заказ, после отправки показываем, что именно заказано.
const orderForm = document.querySelector('form[name="plywood_order"]'); // находим форму заказа по имени name="plywood_order"
orderForm.dataset.ownToast = "1"; // общую подсказку из motion.js не показываем, у формы своя

// дата получения не может быть раньше сегодняшнего дня
const pickupDate = orderForm.elements.pickup_date; // поле «Дата получения» (name="pickup_date")
pickupDate.min = new Date().toISOString().slice(0, 10); // сегодняшняя дата в виде ГГГГ-ММ-ДД становится минимальной

orderForm.addEventListener("submit", function (e) { // срабатывает при нажатии «Отправить все»
  const f = orderForm.elements; // все поля формы, к ним можно обращаться по name: f.material, f.sheets_count
  const material = f.material.options[f.material.selectedIndex]; // выбранный пункт списка «Материал»

  if (!f.material.value) { // если материал не выбран (у пункта «Выберите материал» пустое значение)
    e.preventDefault(); // отменяем отправку формы
    window.showToast("Выберите материал"); // показываем подсказку внизу экрана (функция из motion.js)
    f.material.focus(); // ставим курсор на список материалов
    return; // дальше не идём
  } // конец проверки материала

  const delivery = f.delivery_method.value === "delivery" ? "доставка" : "самовывоз"; // какая радиокнопка выбрана
  window.showToast( // показываем внизу экрана, что именно заказано
    // склеиваем строку: материал, толщина, количество листов и способ получения
    material.textContent + ", " + f.thickness_mm.value + " мм, " + f.sheets_count.value + " шт., " + delivery +
    ". Ответ сервера откроется в новой вкладке" // поясняем, где смотреть ответ сервера
  ); // конец вызова подсказки
}); // конец обработчика отправки; дальше браузер сам отправляет форму на httpbin.org
