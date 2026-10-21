// Форма заказа фанеры (тематические данные).
// Форма разбита на 3 шага: товар → получение → контакты.
// Все поля лежат в одной форме, поэтому на сервер уходят сразу все значения.

const orderForm = document.querySelector('form[name="plywood_order"]');
const steps = orderForm.querySelectorAll(".form-step");        // три блока fieldset
const barItems = orderForm.querySelectorAll(".form-steps-bar li"); // полоска 1 — 2 — 3
const summary = orderForm.querySelector(".form-summary");
let current = 0; // номер текущего шага, считаем с нуля

// У этой формы своя подсказка, поэтому общую из motion.js отключаем
orderForm.dataset.ownToast = "1";

// Дату получения нельзя поставить раньше сегодняшнего дня
const today = new Date().toISOString().slice(0, 10); // например, "2026-10-21"
orderForm.elements.pickup_date.min = today;

// Название выбранного материала, например «Фанера березовая ФСФ»
function materialName() {
  const select = orderForm.elements.material;
  return select.options[select.selectedIndex].textContent;
}

function deliveryName() {
  return orderForm.elements.delivery_method.value === "delivery" ? "доставка" : "самовывоз";
}

// Показываем шаг с номером index, остальные прячем
function showStep(index) {
  current = index;
  steps.forEach(function (step, i) {
    step.classList.toggle("is-current", i === index);
  });
  barItems.forEach(function (item, i) {
    item.classList.toggle("is-current", i === index);
    item.classList.toggle("is-done", i < index);
  });
  // классы для кнопок: на первом шаге нет «Назад», на последнем вместо «Далее» — «Отправить»
  orderForm.classList.toggle("on-first", index === 0);
  orderForm.classList.toggle("on-last", index === steps.length - 1);

  // На последнем шаге показываем, что получится в заказе
  if (index === steps.length - 1) {
    const f = orderForm.elements;
    summary.textContent = "Ваш заказ: " + materialName() + ", " + f.thickness_mm.value + " мм, " +
      f.sheets_count.value + " шт., " + deliveryName() + " " +
      f.pickup_date.value.split("-").reverse().join(".") + "."; // 2026-10-21 -> 21.10.2026
  }
}

// Проверяем поля текущего шага (required, min, max, type="email")
function stepIsValid(index) {
  const fields = steps[index].querySelectorAll("input, select");
  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity(); // браузер сам покажет подсказку у поля
      return false;
    }
  }
  return true;
}

orderForm.querySelector("[data-step-next]").addEventListener("click", function () {
  if (stepIsValid(current)) {
    showStep(current + 1);
  }
});

orderForm.querySelector("[data-step-back]").addEventListener("click", function () {
  showStep(current - 1);
});

// При самовывозе прячем поле «Адрес доставки»
function updateDelivery() {
  orderForm.classList.toggle("is-pickup", orderForm.elements.delivery_method.value === "pickup");
}
orderForm.querySelectorAll('input[name="delivery_method"]').forEach(function (radio) {
  radio.addEventListener("change", updateDelivery);
});

orderForm.addEventListener("submit", function (event) {
  // Enter на первых шагах не отправляет форму, а переходит дальше
  if (current < steps.length - 1) {
    event.preventDefault();
    if (stepIsValid(current)) {
      showStep(current + 1);
    }
    return;
  }

  window.showToast(
    materialName() + ", " + orderForm.elements.thickness_mm.value + " мм, " +
    orderForm.elements.sheets_count.value + " шт., " + deliveryName() +
    ". Ответ сервера откроется в новой вкладке"
  );
  // дальше браузер сам отправляет форму на httpbin.org
});

updateDelivery();
showStep(0);
