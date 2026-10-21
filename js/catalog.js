// Каталог: карточки товаров создаются скриптом из массива products.
// В catalog.html есть только пустой контейнер <div class="cat-grid" id="products">,
// а 12 одинаковых по устройству блоков собирает функция productCard().

// Каждый товар: тип (для фильтра), название, размер листа, фото
// и список толщин с ценой: [толщина в мм, цена в рублях за лист]
const products = [
  { type: "birch", name: "Фанера березовая калиброванная ФК", size: "1525*1525", photo: "assets/photo/prod1.jpg",
    prices: [[4, 290], [5, 400], [6, 440], [8, 500], [9, 530], [10, 650], [12, 700], [15, 900], [18, 1000], [21, 1150], [24, 1450]] },
  { type: "birch", name: "Фанера березовая шлифованная ФК", size: "1525*1525", photo: "assets/photo/prod2.jpg",
    prices: [[3, 300], [5, 450], [6, 500], [8, 610], [9, 650], [10, 700], [12, 800], [15, 950], [18, 1120], [21, 1250]] },
  { type: "wet", name: "Фанера березовая ФСФ", size: "1525*3050", photo: "assets/photo/prod3.jpg",
    prices: [[6, 830], [9, 1500], [12, 1720], [15, 2050], [18, 2800], [21, 2900]] },
  { type: "wet", name: "Фанера березовая ФСФ водостойкая", size: "1220*2440", photo: "assets/photo/type-wet.jpg",
    prices: [[9, 1100], [12, 1150], [15, 1400], [18, 1550], [21, 1850]] },
  { type: "conifer", name: "Фанера хвойная ФСФ", size: "1220*2440", photo: "assets/photo/type-conifer.jpg",
    prices: [[6, 800], [9, 900]] },
  { type: "laminated", name: "Фанера ламинированная ФОФ", size: "1220*2440", photo: "assets/photo/type-laminated.jpg",
    prices: [[18, 2100], [21, 3200]] },
  { type: "laminated", name: "Фанера ламинированная сетка транспортная", size: "1220*2440", photo: "assets/photo/type-laminated.jpg",
    prices: [[6, 1600], [9, 2000], [12, 2200], [15, 2550], [18, 2800], [24, 4800], [30, 5800]] },
  { type: "laminated", name: "Фанера ламинированная гладкая с двух сторон", size: "1220*2440", photo: "assets/photo/type-laminated.jpg",
    prices: [[6, 1600], [9, 1900], [12, 2100]] },
  { type: "boards", name: "Плита ОСБ (OSB-3)", size: "1220*2440", photo: "assets/photo/type-conifer.jpg",
    prices: [[9, 500], [12, 620], [15, 700], [18, 950], [22, 1150]] },
  { type: "boards", name: "Плита ОСБ (OSB-3)", size: "1250*2500", photo: "assets/photo/type-wet.jpg",
    prices: [[9, 570], [12, 790], [15, 700], [18, 1150], [22, 1450]] },
  { type: "boards", name: "Цементно-стружечная плита ЦСП", size: "1250*3200", photo: "assets/photo/prod1.jpg",
    prices: [[10, 1700], [12, 1830], [20, 2800]] },
  { type: "boards", name: "Цементно-стружечная плита ЦСП", size: "1200*3200", photo: "assets/photo/prod2.jpg",
    prices: [[10, 1700], [12, 1830], [16, 2400], [20, 2800]] }
];

// Собираем HTML одной карточки по шаблону
function productCard(product) {
  // Кнопки толщин: первая выбрана сразу (класс on)
  let chips = "";
  product.prices.forEach(function (item, index) {
    const mm = item[0];
    const price = item[1];
    const on = index === 0 ? " on" : "";
    chips += `<button class="chip${on}" type="button" data-price="${price} руб/лист">${mm} мм</button>`;
  });

  // Подпись «от ... руб/лист» берём по самой первой (самой тонкой) толщине
  const basePrice = "от " + product.prices[0][1] + " руб/лист";

  return `
    <figure class="product" data-type="${product.type}" data-reveal>
      <div class="pic" style="background-image:url(${product.photo})" role="img" aria-label="${product.name}"></div>
      <figcaption>
        <div class="head"><h2>${product.name}</h2><span class="size">${product.size}</span></div>
        <div class="row chips">${chips}</div>
        <span class="price" data-base="${basePrice}">${basePrice}</span>
        <a class="btn" href="process.html#order" target="_self">Заказать</a>
      </figcaption>
    </figure>`;
}

// Вставляем все карточки в контейнер одной строкой
const productsGrid = document.getElementById("products");
let cardsHtml = "";
products.forEach(function (product) {
  cardsHtml += productCard(product);
});
productsGrid.innerHTML = cardsHtml;
