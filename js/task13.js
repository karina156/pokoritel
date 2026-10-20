// Задание 13. Читаем фамилию, имя и год рождения прямо из DOM.
// На странице три абзаца <p>: «Фамилия: <span>…</span>», «Имя: …», «Год рождения: …».
// В каждом абзаце childNodes[0] — это текст подписи, а childNodes[1] — <span> с данными.

document.getElementById("read_btn").addEventListener("click", function () {
  const paragraphs = document.getElementsByTagName("p");

  const lastName = paragraphs[0].childNodes[1].innerText;
  const firstName = paragraphs[1].childNodes[1].innerText;
  const birthYear = paragraphs[2].childNodes[1].innerText; // здесь будет '2007'

  // Это видно в консоли DevTools (скриншот на странице)
  console.log(lastName, firstName, birthYear);

  // И то же самое выводим на страницу под кнопкой
  const output = document.getElementById("read_out");
  output.textContent = "Фамилия: " + lastName + " · Имя: " + firstName + " · Год рождения: " + birthYear;
  output.classList.add("done");
});
