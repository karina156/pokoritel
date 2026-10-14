// Задание 13. Считываем фамилию, имя и год рождения из DOM
document.getElementById("read_btn").addEventListener("click", function () {
  const p = document.getElementsByTagName("p");
  const lastName = p[0].childNodes[1].innerText;
  const firstName = p[1].childNodes[1].innerText;
  const birthYear = p[2].childNodes[1].innerText;
  console.log(lastName, firstName, birthYear);
  const out = document.getElementById("read_out");
  out.textContent = "Фамилия: " + lastName + " · Имя: " + firstName + " · Год рождения: " + birthYear;
  out.classList.add("done");
});
