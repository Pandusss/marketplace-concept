/* Демо-данные прототипа.
   Фото: Wikimedia Commons (CC0 / CC BY / CC BY-SA, см. ../CREDITS.md) + локальный спрайт.
   Чтобы заменить фото — поменяйте поле img у товара. */
(function () {
  const w = (hash, name) => `https://thumb.wikimedia.org/wikipedia/commons/thumb/${hash}/${name}/960px-${name}`;
  const sprite = (x, y) => ({ sprite: true, pos: `${x}% ${y}%` });

  const IMG = {
    ipBack: w("9/91", "Back_of_the_iPhone_13_Pro.jpg"),
    ipRed1: w("1/17", "Apple_iPhone_13_Pro_on_MacBook_Pro_07.jpg"),
    ipRed2: w("e/e5", "Apple_iPhone_13_Pro_on_MacBook_Pro_08.jpg"),
    ipRed3: w("8/88", "Apple_iPhone_13_Pro_on_MacBook_Pro_10.jpg"),
    ipPair: w("b/b5", "Apple_iPhone_13_Pro_and_13_Pro_Max.jpg"),
    ipGold: w("1/13", "Back_view_of_iPhone_13_Pro_Max_Gold.jpg"),
    ipStudio: sprite(1.5, 1.5),
    chairStudio: sprite(98.5, 1.5),
    headStudio: sprite(1.5, 98.5),
    camStudio: sprite(98.5, 98.5),
    macWhite: w("c/c9", "Macbook_Air.jpg"),
    macDesk: w("9/9d", "Photo_of_an_Apple_MacBook_Air_with_strong_bokeh.jpg"),
    armchair: w("d/dc", "Louis_Comfort_Tiffany_%28American%2C_1848-1933%29%2C_Tiffany_Glass_%5E_Decorating_Co._%28American%2C_1892-1900%29_-_Armchair_-_1990.91_-_Cleveland_Museum_of_Art.jpg"),
    sony: w("b/b2", "Sony_Headphones_%2840476165073%29.jpg"),
    canon1: w("5/58", "Canon_AE-1_front_with_50mm_lens.jpg"),
    canon2: w("f/f2", "Vintage_Canon_AE-1_35mm_SLR_Film_Camera%2C_Made_In_Japan_From_April_1976_To_1984_%2828347449805%29.jpg"),
    canon3: w("d/d4", "Film_Camera_canon_sure_shot_90u.jpg"),
    bike: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Guerciotti_with_Rolf_Elan_Wheelset.jpg",
    sofa: w("c/c5", "Cozy_living_room_with_a_gray_sofa.jpg"),
    golf1: w("6/6c", "Volkswagen_Golf_VIII_R_20_Years_Auto_Zuerich_2023_1X7A1359.jpg"),
    golf2: w("e/ed", "Volkswagen_Golf_VIII_R_20_Years_Auto_Zuerich_2023_1X7A1358.jpg"),
    flat1: w("e/ed", "The_living_room_that_needs_houseplants.jpg"),
    flat2: w("4/49", "Modern_living_room_with_stylish_furniture_and_a_view_of_the_outdoors_in_a_cozy_apartment_setting.jpg"),
    flat3: w("f/f5", "Modern_kitchen_and_dining_area_with_stylish_furnishings_and_natural_light_in_a_contemporary_home_setting.jpg"),
    guitar: w("6/67", "Fender_California_Series_Acoustic_Guitar_%28serial_no._CSC10001615%29_%282018-04-26_13.21.46_Piqsels.com_id_olkmb%29.jpg"),
    guitarEl: w("c/c9", "Rob_Allen_Electric_Guitar_with_Fender_amp_%288309116958%29.jpg"),
    jacket: "https://upload.wikimedia.org/wikipedia/commons/9/93/Leather_jacket.jpg",
    ps5: w("1/1b", "PlayStation_5_and_DualSense_with_transparent_background.png"),
    plant: w("6/65", "Modern_faux_plant_in_white_pot_on_a_kitchen_countertop%2C_enhancing_decor.jpg"),
    watch1: w("c/c5", "Junghans_Mega.jpg"),
    watch2: w("f/fd", "Fossil_wristwatch_with_white_background.jpg"),
    espresso: w("b/b6", "%28Zerdo%2C_Quito%29_%28espresso_machine_at_the_bar%29.jpg"),
    keyboard: w("7/7f", "Beautiful_Mechanical_Keyboard.jpg"),
    rav1: w("e/eb", "Toyota%2C_Paris_Motor_Show_2018%2C_Paris_%281Y7A1784%29.jpg"),
    rav2: w("e/e7", "Toyota_RAV4_Plug-in_Hybrid_GR_Sport_IMG_9896.jpg"),
    rav3: w("7/78", "Toyota_RAV4_%28XA10%29_IMG_1260.jpg"),
    sneaker: w("9/91", "NIKE_Court_Zoom_Lite_3_Hard_Court_Sneakers_For_Men.jpg"),
    skoda1: w("2/26", "Skoda_Octavia_IV_Combi_1X7A0209.jpg"),
    skoda2: w("2/2e", "Skoda_Octavia_IV_1X7A6024.jpg"),
    skoda3: w("8/8e", "%C5%A0koda_Octavia_IV_Combi_Facelift_IMG_9434.jpg"),
  };

  // p(id, title, price, cat, img, place, km, when, cond, extra)
  const p = (id, title, price, cat, img, place, km, when, cond, x = {}) => ({ id, title, price, cat, img: IMG[img], place, km, when, cond, ...x });

  const products = [
    p("ip1", "iPhone 13 Pro, 256 ГБ", 52900, "phones", "ipBack", "Хамовники", 0.8, "12 мин назад", "Отличное", { fair: "ok", delivery: true, verified: true, sub: "Альпийский зелёный · АКБ 91%" }),
    p("ip2", "iPhone 13 Pro, 128 ГБ", 46500, "phones", "ipRed1", "Арбат", 1.9, "1 час назад", "Хорошее", { fair: "low", delivery: true, sub: "Графит · АКБ 86%" }),
    p("ip3", "iPhone 13 Pro, 512 ГБ", 61000, "phones", "ipStudio", "Белорусская", 2.4, "сегодня, 09:12", "Как новый", { fair: "ok", verified: true, sub: "Графит · АКБ 97% · чек" }),
    p("ip4", "iPhone 13 Pro Max, 256 ГБ", 58700, "phones", "ipGold", "Пресня", 3.1, "сегодня, 08:40", "Отличное", { fair: "ok", delivery: true, sub: "Золотой · АКБ 89%" }),
    p("ip5", "iPhone 13 Pro, 256 ГБ", 49900, "phones", "ipRed2", "Таганка", 4.6, "вчера", "Хорошее", { fair: "low", sub: "Графит · АКБ 84%" }),
    p("ip6", "iPhone 13 Pro и Pro Max, пара", 104000, "phones", "ipPair", "Сокол", 7.2, "вчера", "Отличное", { fair: "high", delivery: true, verified: true, sub: "Оба с коробками" }),
    p("ip7", "iPhone 13 Pro, 128 ГБ", 44000, "phones", "ipRed3", "Дорогомилово", 2.9, "2 дня назад", "Среднее", { fair: "low", sub: "Графит · скол на рамке" }),
    p("head", "Наушники с шумоподавлением", 18900, "audio", "headStudio", "Тверская", 2.1, "2 дня назад", "Отличное", { fair: "ok", delivery: true }),

    p("mac1", "MacBook Air 13, 2020", 54000, "laptops", "macDesk", "Хамовники", 0.6, "25 мин назад", "Отличное", { fair: "ok", delivery: true, verified: true }),
    p("mac2", "MacBook Air 13, 8/256", 41500, "laptops", "macWhite", "Фили", 5.4, "вчера", "Хорошее", { fair: "low" }),
    p("chair1", "Кресло букле Cloud", 24500, "home", "chairStudio", "Хамовники", 0.4, "5 мин назад", "Как новое", { fair: "ok", verified: true }),
    p("chair2", "Кресло винтажное, дерево", 18000, "home", "armchair", "Замоскворечье", 2.7, "сегодня, 10:05", "Хорошее", { fair: "ok" }),
    p("sofa", "Диван серый трёхместный", 32000, "home", "sofa", "Якиманка", 1.6, "3 часа назад", "Отличное", { fair: "low", delivery: true }),
    p("plant", "Фикус в кашпо, 60 см", 1900, "home", "plant", "Хамовники", 0.3, "40 мин назад", "—", { fair: "ok" }),
    p("espresso", "Кофемашина рожковая", 27000, "home", "espresso", "Арбат", 1.8, "вчера", "Хорошее", { fair: "ok", delivery: true }),
    p("sony", "Наушники Sony, беспроводные", 8900, "audio", "sony", "Пресня", 3.3, "2 часа назад", "Отличное", { fair: "ok", delivery: true }),
    p("canon1", "Canon AE-1 + 50mm f/1.8", 21000, "photo", "canon1", "Китай-город", 3.0, "сегодня, 11:30", "Отличное", { fair: "ok", verified: true, delivery: true }),
    p("canon2", "Canon AE-1, серебро", 19500, "photo", "canon2", "Сокольники", 8.1, "вчера", "Хорошее", { fair: "low" }),
    p("cam", "Беззеркальная камера X-серии", 62000, "photo", "camStudio", "Арбат", 1.7, "3 дня назад", "Как новая", { fair: "ok", delivery: true }),
    p("canon3", "Canon Sure Shot, плёнка", 6500, "photo", "canon3", "Бауманская", 6.2, "3 дня назад", "Рабочее", { fair: "ok" }),
    p("bike", "Шоссейный велосипед, 54 см", 68000, "sport", "bike", "Лужники", 1.2, "1 час назад", "Отличное", { fair: "ok" }),
    p("guitar", "Акустическая гитара Fender", 23000, "hobby", "guitar", "Хамовники", 0.9, "сегодня, 07:50", "Отличное", { fair: "ok", delivery: true }),
    p("guitarEl", "Электрогитара + комбик", 47000, "hobby", "guitarEl", "Динамо", 6.0, "2 дня назад", "Хорошее", { fair: "ok" }),
    p("jacket", "Кожаная куртка, M", 9500, "fashion", "jacket", "Чистые пруды", 4.1, "вчера", "Хорошее", { fair: "low", delivery: true }),
    p("sneaker", "Кроссовки Nike Court, 43", 5400, "fashion", "sneaker", "Парк культуры", 0.7, "2 часа назад", "Новые", { fair: "ok", delivery: true }),
    p("watch1", "Часы Junghans Mega", 31000, "fashion", "watch1", "Тверская", 2.2, "4 дня назад", "Отличное", { fair: "ok", verified: true }),
    p("watch2", "Часы Fossil, хронограф", 7800, "fashion", "watch2", "Марьина Роща", 7.7, "неделю назад", "Хорошее", { fair: "ok", delivery: true }),
    p("ps5", "PlayStation 5 + геймпад", 39900, "games", "ps5", "Хамовники", 0.5, "18 мин назад", "Отличное", { fair: "ok", delivery: true, verified: true }),
    p("kbd", "Механическая клавиатура", 6900, "laptops", "keyboard", "Фрунзенская", 1.1, "вчера", "Отличное", { fair: "ok", delivery: true }),

    p("golf1", "Volkswagen Golf R, 2022", 4150000, "cars", "golf1", "Хамовники", 1.4, "сегодня, 10:20", "32 000 км", { fair: "ok", verified: true, sub: "2.0 AMT · 320 л.с. · полный привод" }),
    p("golf2", "Volkswagen Golf R, 2021", 3890000, "cars", "golf2", "Кунцево", 11.0, "вчера", "48 500 км", { fair: "low", sub: "2.0 AMT · 320 л.с. · 1 владелец" }),
    p("skoda1", "Škoda Octavia Combi, 2021", 2480000, "cars", "skoda1", "Раменки", 6.3, "2 часа назад", "61 000 км", { fair: "ok", verified: true, sub: "1.4 AT · 150 л.с. · универсал" }),
    p("skoda2", "Škoda Octavia, 2020", 2190000, "cars", "skoda2", "Митино", 17.5, "вчера", "84 000 км", { fair: "low", sub: "1.6 AT · 110 л.с. · лифтбек" }),
    p("skoda3", "Škoda Octavia Combi, 2024", 3350000, "cars", "skoda3", "Сокол", 7.9, "3 дня назад", "9 800 км", { fair: "high", sub: "2.0 AMT · 190 л.с. · универсал" }),
    p("rav1", "Toyota RAV4 Hybrid, 2019", 3270000, "cars", "rav1", "Пресня", 3.4, "сегодня, 08:15", "72 000 км", { fair: "ok", sub: "2.5 CVT · 222 л.с. · гибрид" }),
    p("rav2", "Toyota RAV4 GR Sport, 2023", 4690000, "cars", "rav2", "Химки", 19.0, "2 дня назад", "21 000 км", { fair: "ok", verified: true, sub: "2.5 CVT · 306 л.с. · плагин-гибрид" }),
    p("rav3", "Toyota RAV4, 1998", 520000, "cars", "rav3", "Люблино", 12.8, "4 дня назад", "243 000 км", { fair: "ok", sub: "2.0 MT · 128 л.с. · 3 двери" }),

    p("flat1", "2-комн., 54 м², 7/12 эт.", 21900000, "flats", "flat1", "Хамовники", 0.9, "сегодня, 09:00", "м. Спортивная, 6 мин", { fair: "ok", verified: true, sub: "Кирпичный дом · ремонт 2022" }),
    p("flat2", "3-комн., 82 м², 14/24 эт.", 38500000, "flats", "flat2", "Раменки", 6.8, "вчера", "м. Раменки, 9 мин", { fair: "ok", sub: "Монолит · панорамные окна" }),
    p("flat4", "1-комн., 38 м², 5/9 эт.", 14600000, "flats", "sofa", "Якиманка", 1.6, "3 часа назад", "м. Полянка, 7 мин", { fair: "ok", verified: true, sub: "Кирпичный дом · с мебелью" }),
    p("flat3", "Студия, 28 м², 3/9 эт.", 11200000, "flats", "flat3", "Сокол", 8.0, "2 дня назад", "м. Сокол, 4 мин", { fair: "low", sub: "Панель · кухня-гостиная" }),
  ];

  const categories = [
    { id: "electronics", name: "Электроника", hint: "Телефоны, ноутбуки, фото", count: 1204318, emoji: "📱", img: IMG.macDesk },
    { id: "transport", name: "Транспорт", hint: "Авто, мото, запчасти", count: 873004, emoji: "🚗", img: IMG.skoda1, schema: "cars" },
    { id: "realty", name: "Недвижимость", hint: "Квартиры, дома, аренда", count: 412760, emoji: "🏠", img: IMG.flat2, schema: "flats" },
    { id: "home", name: "Дом и сад", hint: "Мебель, техника, ремонт", count: 2310455, emoji: "🛋️", img: IMG.sofa },
    { id: "fashion", name: "Одежда и обувь", hint: "Одежда, обувь, часы", count: 3107220, emoji: "👟", img: IMG.jacket },
    { id: "hobby", name: "Хобби и спорт", hint: "Вело, музыка, игры", count: 954112, emoji: "🎸", img: IMG.guitar },
    { id: "kids", name: "Детям", hint: "Коляски, игрушки, одежда", count: 1480377, emoji: "🧸", img: IMG.plant },
    { id: "services", name: "Услуги", hint: "Ремонт, обучение, красота", count: 640900, emoji: "🛠️", img: IMG.espresso },
    { id: "jobs", name: "Работа", hint: "Вакансии и резюме", count: 298411, emoji: "💼", img: IMG.keyboard },
    { id: "pets", name: "Животные", hint: "Питомцы и товары для них", count: 187530, emoji: "🐾", img: IMG.plant },
  ];

  /* Схема категории → интерфейс.
     Каталог может содержать тысячи категорий и десятки характеристик,
     но шаблон один: показываем top-фильтры (3–4 самых используемых),
     остальное прячем под «Ещё N». Порядок top определяется статистикой, а не дизайнером. */
  const schemas = {
    phones: {
      name: "Смартфоны", parent: "Электроника", count: 286540, unit: "объявлений",
      subs: [["Apple", 96210], ["Samsung", 71455], ["Xiaomi", 58302], ["Google", 9120], ["Honor", 21870], ["Кнопочные", 6044], ["Аксессуары", 23539]],
      top: [
        { key: "brand", label: "Бренд", q: "Какой бренд?", options: ["Apple", "Samsung", "Xiaomi", "Google", "Honor"] },
        { key: "model", label: "Модель", q: "Какая модель?", options: ["iPhone 13 Pro", "iPhone 14", "iPhone 15 Pro", "Galaxy S23"] },
        { key: "memory", label: "Память", q: "Сколько памяти?", options: ["128 ГБ", "256 ГБ", "512 ГБ", "1 ТБ"] },
        { key: "cond", label: "Состояние", q: "В каком состоянии?", options: ["Новый", "Как новый", "Отличное", "Хорошее"] },
      ],
      rest: 14, restNames: "цвет, АКБ, SIM, гарантия, комплект…",
      items: ["ip1", "ip2", "ip3", "ip4", "ip5", "ip7", "ip6"],
    },
    cars: {
      name: "Автомобили", parent: "Транспорт", count: 512880, unit: "объявлений",
      subs: [["С пробегом", 431200], ["Новые", 81680], ["Škoda", 18344], ["Toyota", 39120], ["Volkswagen", 27455], ["Kia", 41003], ["Электромобили", 6210]],
      top: [
        { key: "brand", label: "Марка", q: "Какая марка?", options: ["Škoda", "Toyota", "Volkswagen", "Kia", "BMW"] },
        { key: "year", label: "Год", q: "Какого года?", options: ["от 2022", "2018–2021", "2012–2017", "до 2012"] },
        { key: "km", label: "Пробег", q: "Какой пробег?", options: ["до 30 тыс.", "до 80 тыс.", "до 150 тыс.", "любой"] },
        { key: "gear", label: "Коробка", q: "Какая коробка?", options: ["Автомат", "Робот", "Вариатор", "Механика"] },
      ],
      rest: 50, restNames: "кузов, привод, двигатель, владельцы, ПТС…",
      items: ["skoda1", "golf1", "rav1", "skoda2", "rav2", "golf2", "skoda3", "rav3"],
    },
    flats: {
      name: "Квартиры", parent: "Недвижимость", count: 198340, unit: "объявлений",
      subs: [["Купить", 121400], ["Снять надолго", 58310], ["Посуточно", 18630], ["Новостройки", 44120], ["Вторичка", 77280]],
      top: [
        { key: "rooms", label: "Комнаты", q: "Сколько комнат?", options: ["Студия", "1", "2", "3", "4+"] },
        { key: "area", label: "Площадь", q: "Какая площадь?", options: ["до 35 м²", "35–60 м²", "60–90 м²", "от 90 м²"] },
        { key: "metro", label: "До метро", q: "Как далеко от метро?", options: ["до 5 мин", "до 10 мин", "до 15 мин", "не важно"] },
        { key: "floor", label: "Этаж", q: "Какой этаж?", options: ["не первый", "не последний", "выше 5-го", "любой"] },
      ],
      rest: 31, restNames: "дом, ремонт, балкон, парковка, ипотека…",
      items: ["flat1", "flat4", "flat2", "flat3"],
    },
  };

  // Демо-запрос для экрана поиска
  const demoQuery = "айфон 13 про до 60 тысяч";

  window.DB = { products, categories, schemas, demoQuery, IMG, byId: (id) => products.find((x) => x.id === id) };
})();
