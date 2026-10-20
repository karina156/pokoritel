// Задание 13. Считываем фамилию, имя и год рождения из DOM
document.getElementById("read_btn").addEventListener("click", function () { // при клике на кнопку «Прочитать DOM»
  const p = document.getElementsByTagName("p"); // все абзацы <p> страницы: [0] фамилия, [1] имя, [2] год рождения
  const lastName = p[0].childNodes[1].innerText; // в первом абзаце узел [0] — текст «Фамилия:», узел [1] — <span> с фамилией
  const firstName = p[1].childNodes[1].innerText; // во втором абзаце узел [1] — <span> с именем
  const birthYear = p[2].childNodes[1].innerText; // в третьем абзаце узел [1] — <span> с годом, это и есть '2007'
  console.log(lastName, firstName, birthYear); // выводим данные в консоль DevTools (видно на скриншоте)
  const out = document.getElementById("read_out"); // поле вывода под кнопкой
  out.textContent = "Фамилия: " + lastName + " · Имя: " + firstName + " · Год рождения: " + birthYear; // пишем результат на страницу
  out.classList.add("done"); // класс done меняет оформление поля: видно, что данные прочитаны
}); // конец обработчика клика
