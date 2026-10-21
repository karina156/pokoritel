// Задание 12. Форма заказа фанеры (тематические данные).
// Перед отправкой проверяем, что выбран материал,
// а после отправки внизу экрана пишем, что именно заказали.

const orderForm = document.querySelector('form[name="plywood_order"]');

// У этой формы своя подсказка, поэтому общую из motion.js отключаем
orderForm.dataset.ownToast = "1";

// Дату получения нельзя поставить раньше сегодняшнего дня
const today = new Date().toISOString().slice(0, 10); // например, "2026-10-21"
orderForm.elements.pickup_date.min = today;

orderForm.addEventListener("submit", function (event) {
  const fields = orderForm.elements; // к полям можно обращаться по name

  // У пункта «Выберите материал» пустое значение, значит материал не выбран
  if (fields.material.value === "") {
    event.preventDefault(); // форму не отправляем
    window.showToast("Выберите материал");
    fields.material.focus();
    return;
  }

  const materialName = fields.material.options[fields.material.selectedIndex].textContent;
  const thickness = fields.thickness_mm.value;
  const sheets = fields.sheets_count.value;

  let delivery = "самовывоз";
  if (fields.delivery_method.value === "delivery") {
    delivery = "доставка";
  }

  window.showToast(
    materialName + ", " + thickness + " мм, " + sheets + " шт., " + delivery +
    ". Ответ сервера откроется в новой вкладке"
  );
  // дальше браузер сам отправляет форму на httpbin.org
});
