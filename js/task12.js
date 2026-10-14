// Задание 12. Форма отправки тематических данных (заказ фанеры)
// Перед отправкой проверяем заказ, после отправки показываем, что именно заказано.
const orderForm = document.querySelector('form[name="plywood_order"]');
orderForm.dataset.ownToast = "1"; // общую подсказку из motion.js не показываем, у формы своя

// дата получения не может быть раньше сегодняшнего дня
const pickupDate = orderForm.elements.pickup_date;
pickupDate.min = new Date().toISOString().slice(0, 10);

orderForm.addEventListener("submit", function (e) {
  const f = orderForm.elements;
  const material = f.material.options[f.material.selectedIndex];

  if (!f.material.value) {
    e.preventDefault();
    window.showToast("Выберите материал");
    f.material.focus();
    return;
  }

  const delivery = f.delivery_method.value === "delivery" ? "доставка" : "самовывоз";
  window.showToast(
    material.textContent + ", " + f.thickness_mm.value + " мм, " + f.sheets_count.value + " шт., " + delivery +
    ". Ответ сервера откроется в новой вкладке"
  );
});
