/* RUBERI — «Строка».
   Идея: одна умная строка вместо дерева каталога. Пишешь как думаешь —
   интерфейс сам раскладывает запрос на фильтры. Моно, плотная сетка, один акцент. */
(function () {
  const U = () => window.UI;

  const geoLabel = () => { const g = U().state.get("geo", { city: "Москва", radius: "весь город" }); return g.radius === "весь город" ? g.city : `${g.city} · ${g.radius}`; };
  const unread = () => (window.CHATS ? window.CHATS.unread() : 2);

  const layout = () => [window.DOCK, window.GLASS, window.MATERIAL].find((l) => l && l.on()); // дизайны со своей компоновкой
  const dockOn = () => !!layout();
  const header = (q = "") => (dockOn() ? layout().top() : headerA(q));
  const headerA = (q = "") => `
    <header class="a-head">
      <a class="a-logo" href="${U().href("home")}">RUBERI<i>.</i></a>
      <form class="a-head-search" data-search><input name="q" value="${U().esc(q)}" placeholder="Что ищете?" autocomplete="off" aria-label="Поиск" /><kbd>/</kbd></form>
      <a class="a-head-find" href="${U().href("search")}" aria-label="Поиск">⌕</a>
      <nav class="a-head-nav">
        <button type="button" class="a-geo" data-geo-open><span data-geo-label>${geoLabel()}</span></button>
        <a href="${U().href("favorites")}" ${U().screen === "favorites" ? 'aria-current="page"' : ""}>Избранное</a>
        <a href="${U().href("chats")}" ${U().screen === "chats" ? 'aria-current="page"' : ""}>Чаты${unread() ? `<sup>${unread()}</sup>` : ""}</a>
        <a href="${U().href("profile")}" class="a-me" ${U().screen === "profile" ? 'aria-current="page"' : ""} aria-label="Профиль">К</a>
        <a class="a-sell" href="${U().href("sell")}">Продать</a>
      </nav>
    </header>`;

  const card = (p) => (dockOn() ? layout().card(p) : cardA(p));
  const cardA = (p) => `
    <a class="a-card" href="${U().href("product", { id: p.id })}">
      <div class="a-card-img">${U().photo(p)}<button type="button" class="a-fav" data-fav="${p.id}" aria-label="В избранное">♡</button></div>
      <div class="a-card-row"><strong>${U().fmtShort(p.price)}</strong>${p.fair === "low" ? '<em class="a-tag">ниже рынка</em>' : ""}</div>
      <h3>${p.title}</h3>
      <p><b>${U().walk(p.km)}</b> · ${p.place} · ${p.when}</p>
    </a>`;

  const pills = (schema) => `
    <div class="a-pills">
      <div class="a-pill" data-pop><button type="button"><span>Цена</span><b data-pop-val></b></button><div class="a-pop" data-pop-body>${["до 30 000 ₽", "до 60 000 ₽", "до 100 000 ₽", "Любая"].map((o) => `<button type="button" data-pop-opt>${o}</button>`).join("")}</div></div>
      ${schema.top.map((f) => `<div class="a-pill" data-pop><button type="button"><span>${f.label}</span><b data-pop-val></b></button><div class="a-pop" data-pop-body>${f.options.map((o) => `<button type="button" data-pop-opt>${o}</button>`).join("")}</div></div>`).join("")}
      <button type="button" class="a-pill-more" data-sheet-open>Ещё ${schema.rest}</button>
    </div>`;

  const EXAMPLES = ["айфон 13 про до 60 тысяч рядом с доставкой", "диван до 30 тысяч срочно", "шкода октавия до 2.5 млн в москве"];

  const tabbar = () => `<nav class="a-tabbar" aria-label="Основная навигация">
      ${[["home", "⌂", "Главная"], ["favorites", "♡", "Избранное"], ["sell", "+", "Продать"], ["chats", "✉", "Чаты"], ["profile", "◔", "Профиль"]].map(([s, ic, n]) => `<a href="${U().href(s)}" class="${s === "sell" ? "a-tab-sell" : ""}" ${U().screen === s ? 'aria-current="page"' : ""}><i>${ic}</i><span>${n}</span>${s === "chats" && unread() ? `<sup>${unread()}</sup>` : ""}</a>`).join("")}
    </nav>`;

  const footer = () => (dockOn() ? layout().dock() : footerA());
  const footerA = () => tabbar() + `<footer class="a-foot"><span>RUBERI<i>.</i> — прототип</span><span>Безопасная сделка · Доставка · Помощь</span></footer>`;

  window.V.a = {
    _: { header: (q) => header(q), footer: () => footer(), card: (p) => card(p), pills: (s) => pills(s) }, // общие блоки для остальных экранов (screens.js)

    home() {
      const fresh = ["chair1", "ps5", "mac1", "ip1", "sneaker", "bike", "guitar", "canon1", "skoda1", "flat1", "sofa", "sony", "watch1", "plant", "kbd"].map(DB.byId);
      return `${header()}
      <main class="a-main">
        <section class="a-hero" data-parse-wrap>
          <h1>Что ищете?</h1>
          <form class="a-ask" data-search>
            <input name="q" data-parse="#a-tokens" data-typer="${U().esc(EXAMPLES.join("|"))}" placeholder="Например: айфон 13 про до 60 тысяч рядом" autocomplete="off" aria-label="Поисковый запрос" />
            <button type="submit" aria-label="Найти">→</button>
          </form>
          <div class="a-understood"><span>Понимаю так</span><div class="a-tokens" id="a-tokens"></div></div>
          <p class="a-hint">Пишите как в мессенджере: цена, район, состояние, доставка — всё превратится в фильтры. Категорию выбирать не нужно.</p>
          <div class="a-try"><span>Попробуйте</span>${EXAMPLES.slice(1).concat("новый макбук эйр 256 гб от 50к").map((q) => `<button type="button" data-fill="${U().esc(q)}">${q}</button>`).join("")}</div>
        </section>

        <nav class="a-cats" aria-label="Категории">
          ${DB.categories.map((c) => `<a href="${c.schema ? U().href("category", { c: c.schema }) : c.id === "electronics" ? U().href("category") : U().href("search", { q: c.name })}"><span>${c.name}</span><small>${U().countShort(c.count)}</small></a>`).join("")}
        </nav>

        <section class="a-block">
          <div class="a-block-head"><h2>Свежее рядом</h2><button type="button" class="a-block-geo" data-geo-open>Хамовники · до 3 км</button></div>
          <div class="a-grid a-grid-5">${fresh.map(card).join("")}</div>
        </section>
      </main>${footer()}`;
    },

    search(ctx) {
      const { list, what } = U().find(ctx.q);
      const n = list.length; const avg = n ? Math.round(list.reduce((a, p) => a + p.price, 0) / n / 100) * 100 : 0;
      const min = n ? Math.min(...list.map((p) => p.price)) : 0, max = n ? Math.max(...list.map((p) => p.price)) : 0;
      const bins = Array(9).fill(0); list.forEach((p) => { bins[max === min ? 4 : Math.min(8, Math.floor(((p.price - min) / (max - min)) * 9))]++; }); const top = Math.max(1, ...bins);
      const schemaKey = list.some((p) => p.cat === "cars") && list.every((p) => p.cat === "cars") ? "cars" : list.length && list.every((p) => p.cat === "flats") ? "flats" : "phones";
      const plural = (k) => (k % 10 === 1 && k % 100 !== 11 ? "объявление" : [2, 3, 4].includes(k % 10) && ![12, 13, 14].includes(k % 100) ? "объявления" : "объявлений");
      const watched = U().state.get("searches", window.SEARCHES0 || []); const saved = watched.some((x) => x.q === ctx.q);
      if (saved && watched.find((x) => x.q === ctx.q).fresh) { watched.find((x) => x.q === ctx.q).fresh = 0; U().state.set("searches", watched); }
      return `${header(ctx.q)}
      <main class="a-main" data-schema="${schemaKey}">
        <section class="a-query" data-parse-wrap>
          <form class="a-ask a-ask-sm" data-search><input name="q" data-parse="#a-tokens" value="${U().esc(ctx.q)}" autocomplete="off" aria-label="Поисковый запрос" /><button type="submit" aria-label="Найти">→</button></form>
          <div class="a-understood"><span>Понимаю так</span><div class="a-tokens" id="a-tokens"></div></div>
        </section>
        ${n ? `
        <section class="a-market">
          <div><small>Найдено</small><strong>${n}</strong><span>${plural(n)}</span></div>
          <div><small>Средняя цена</small><strong>${U().fmtShort(avg)}</strong><span>по найденным</span></div>
          <div class="a-hist" aria-label="Распределение цен">${bins.map((h) => `<i style="height:${Math.max(6, (h / top) * 84)}%" class="${h ? "in" : ""}"></i>`).join("")}<span>${U().fmtShort(min).replace(" ₽", "")}</span><span></span><span>${U().fmtShort(max)}</span></div>
          <div><small>С доставкой</small><strong>${list.filter((p) => p.delivery).length}</strong><span>из ${n}</span></div>
        </section>

        <div class="a-toolbar">${pills(DB.schemas[schemaKey])}
          <div class="a-toolbar-r"><button type="button" class="a-save ${saved ? "on" : ""}" data-save-search="${U().esc(ctx.q)}">${saved ? "Сообщим о новых" : "Сообщать о новых"}</button>
          <div class="a-sort" data-pop><button type="button"><span>Сначала</span><b data-pop-val>подходящие</b></button><div class="a-pop a-pop-r" data-pop-body>${["подходящие", "дешевле", "новые", "ближе"].map((o) => `<button type="button" data-pop-opt data-sort="${o}">${o}</button>`).join("")}</div></div></div>
        </div>

        <div class="a-grid a-grid-4" data-results>${list.map((p, i) => card(p).replace('<a class="a-card"', `<a class="a-card" data-price="${p.price}" data-km="${p.km}" data-i="${i}"${i >= 8 ? " hidden" : ""}`)).join("")}</div>
        ${n > 8 ? `<button type="button" class="a-more" data-more>Показать ещё ${n - 8}</button>` : ""}` : `
        <section class="a-empty">
          <h1>По запросу «${U().esc(what || ctx.q)}» пока ничего нет</h1>
          <p>В прототипе — несколько десятков демо-объявлений. В продукте здесь будет то же самое для редких запросов: честно сказать, что пусто, и предложить следующий шаг.</p>
          <div class="a-empty-actions">
            <button type="button" class="a-cta" data-save-search="${U().esc(ctx.q)}">Сообщить, когда появится</button>
            <a class="a-cta2" href="${U().href("search", { q: what || "" })}">Убрать условия и искать шире</a>
          </div>
          <div class="a-try"><span>Или посмотрите</span>${["айфон 13 про", "диван", "шкода октавия", "квартира", "canon"].map((x) => `<a href="${U().href("search", { q: x })}">${x}</a>`).join("")}</div>
        </section>`}
      </main>${footer()}`;
    },

    category(ctx) {
      const s = ctx.schema; const list = s.items.map(DB.byId);
      return `${header()}
      <main class="a-main">
        <nav class="a-crumbs"><a href="${U().href("home")}">Главная</a><span>/</span><a href="${U().href("search", { q: s.parent })}">${s.parent}</a><span>/</span><b>${s.name}</b></nav>
        <section class="a-cat-head">
          <h1>${s.name}<sup>${U().countShort(s.count)}</sup></h1>
          <form class="a-ask a-ask-sm" data-search><input name="q" placeholder="Искать в «${s.name}»: модель, цена, район…" autocomplete="off" aria-label="Поиск в категории" /><button type="submit" aria-label="Найти">→</button></form>
        </section>

        <ul class="a-subs">${s.subs.map(([n, c]) => `<li><a href="${U().href("search", { q: n })}"><span>${n}</span><small>${U().countShort(c)}</small></a></li>`).join("")}</ul>

        <div class="a-toolbar">${pills(s)}</div>

        <aside class="a-proof">
          <div><b>Один шаблон — любая категория.</b> Фильтры приходят из схемы каталога: наверху 4 самых используемых, остальные ${s.rest} (${s.restNames}) — за кнопкой и с поиском по названию.</div>
          <div class="a-proof-tabs" role="tablist">${Object.entries(DB.schemas).map(([k, v]) => `<a href="${U().href("category", { c: k })}" role="tab" aria-selected="${k === ctx.schemaKey}">${v.name}</a>`).join("")}</div>
        </aside>

        <div class="a-grid a-grid-4">${list.slice(0, list.length >= 8 ? 8 : 4).map(card).join("")}</div>
      </main>${footer()}`;
    },

    sell(ctx) {
      const kind = ["car", "flat"].includes(ctx.params.get("kind")) ? ctx.params.get("kind") : "item";
      const K = {
        item: { schema: DB.schemas.phones, product: DB.byId("ip1"), title: "iPhone 13 Pro, 256 ГБ", price: 52900, presets: [48900, 52900, 57500],
          hero: "Снимите вещь. Название, категорию, характеристики и цену заполним сами — останется проверить и нажать «Опубликовать».",
          log: ["Смотрю на фото…", "Это смартфон → <b>Электроника / Смартфоны</b>", "Модель: <b>iPhone 13 Pro</b>, цвет — альпийский зелёный", "Сверяю цены: 214 похожих за 30 дней"],
          guessed: [["Бренд", "Apple"], ["Модель", "iPhone 13 Pro"], ["Память", "256 ГБ"], ["Цвет", "Альпийский зелёный"]],
          ask: `<small>Состояние — по фото не видно, выберите</small><div data-single>${["Как новый", "Отличное", "Хорошее", "Есть дефекты"].map((o) => `<button type="button" data-toggle>${o}</button>`).join("")}</div>`,
          tip: "Снимите экран и боковые грани: покупатели спрашивают про них чаще всего",
          text: "iPhone 13 Pro на 256 ГБ в цвете «альпийский зелёный». Состояние и комплект уточню при встрече, проверка — сколько нужно.",
          how: [["Район", "Хамовники"], ["Доставка", "Включена · безопасная сделка"]] },
        car: { schema: DB.schemas.cars, product: DB.byId("skoda1"), title: "Škoda Octavia Combi, 2021", price: 2480000, presets: [2350000, 2480000, 2620000],
          hero: "Сфотографируйте машину и укажите госномер. Марку, модель, год, двигатель и коробку подтянем сами — вместо полусотни полей останется два вопроса.",
          log: ["Смотрю на фото…", "Это автомобиль → <b>Транспорт / Автомобили</b>", "По номеру: <b>Škoda Octavia Combi, 2021</b> · 1.4 AT · 150 л.с.", "История: 1 владелец, ДТП и ограничений не найдено", "Сверяю цены: 96 похожих за 30 дней"],
          guessed: [["Марка", "Škoda"], ["Модель", "Octavia Combi"], ["Год", "2021"], ["Двигатель", "1.4 бензин · 150 л.с."], ["Коробка", "Автомат"], ["Привод", "Передний"], ["Кузов", "Универсал"], ["Цвет", "Красный"]],
          ask: `<small>Пробег — по фото и номеру не узнать</small><div class="a-ask-input"><input inputmode="numeric" placeholder="Например, 61 000" aria-label="Пробег, км" /><b>км</b></div><small style="margin-top:14px">Состояние</small><div data-single>${["Не бит, не крашен", "Есть окрасы", "После ДТП", "Требует ремонта"].map((o) => `<button type="button" data-toggle>${o}</button>`).join("")}</div>`,
          tip: "Добавьте салон, приборную панель с пробегом и багажник — по ним решают, ехать ли смотреть",
          text: "Škoda Octavia Combi 2021 года, 1.4 с автоматом. Один владелец, обслуживалась по регламенту. Покажу в любой день, возможна проверка на сервисе покупателя.",
          how: [["Осмотр", "Раменки"], ["Госномер на фото", "Скрыт автоматически"], ["Отчёт об истории", "Приложен к объявлению"]] },
        flat: { schema: DB.schemas.flats, product: DB.byId("flat1"), title: "2-комн. квартира, 54 м², 7/12 эт.", price: 21900000, presets: [20900000, 21900000, 22900000],
          hero: "Сфотографируйте комнаты и укажите адрес. Дом, этажность, год постройки и расстояние до метро подтянем сами — останется площадь и пара вопросов.",
          log: ["Смотрю на фото…", "Это жилая комната → <b>Недвижимость / Квартиры</b>", "По адресу: <b>кирпичный дом, 12 этажей</b>, м. Спортивная — 6 мин", "Сверяю цены: 41 похожая квартира в районе"],
          guessed: [["Сделка", "Продажа"], ["Дом", "Кирпичный, 12 этажей"], ["До метро", "м. Спортивная, 6 мин"], ["Ремонт", "Косметический — по фото"], ["Санузел", "Раздельный"], ["Балкон", "Есть"]],
          ask: `<small>Комнаты и площадь — по фото не определить</small><div data-single>${["Студия", "1", "2", "3", "4+"].map((o) => `<button type="button" data-toggle>${o}</button>`).join("")}</div><div class="a-ask-input" style="margin-top:10px"><input inputmode="numeric" placeholder="Например, 54" aria-label="Площадь, м²" /><b>м²</b></div><small style="margin-top:14px">Этаж</small><div class="a-ask-input"><input inputmode="numeric" placeholder="Например, 7" aria-label="Этаж" /><b>эт.</b></div>`,
          tip: "Добавьте кухню, санузел, вид из окна и планировку — без них объявления о квартирах пролистывают",
          text: "Светлая двухкомнатная квартира в кирпичном доме, тихий двор. Один взрослый собственник, свободная продажа, документы готовы. Показы по вечерам и в выходные.",
          how: [["Адрес", "Хамовники, точный — после звонка"], ["Собственник", "Подтвердить через Госуслуги"], ["Показы", "По договорённости"]] },
      }[kind];
      const s = K.schema; const f = U().fair(K.product);
      return `${header()}
      <main class="a-main" data-sell-kind="${kind}" data-sell-img="${typeof K.product.img === "string" ? K.product.img : ""}">
        <section class="a-sell-hero" data-sell-step="1">
          <div class="a-kind" role="tablist"><a href="${U().href("sell")}" role="tab" aria-selected="${kind === "item"}">Вещь</a><a href="${U().href("sell", { kind: "car" })}" role="tab" aria-selected="${kind === "car"}">Автомобиль</a><a href="${U().href("sell", { kind: "flat" })}" role="tab" aria-selected="${kind === "flat"}">Квартира</a></div>
          <h1>Продать — это одно фото.</h1>
          <p>${K.hero}</p>
          <label class="a-drop"><input type="file" accept="image/*" multiple data-sell-file /><i>+</i><b>Перетащите фото или выберите</b><span>до ${kind === "item" ? 10 : 30} штук · первое станет обложкой</span></label>
          ${kind === "flat" ? `<label class="a-plate a-plate-text"><span>Адрес — по нему подтянем дом, этажность и метро</span><input placeholder="Улица, дом" autocomplete="off" aria-label="Адрес" /></label>` : ""}
          ${kind === "car" ? `<label class="a-plate"><span>Госномер или VIN — необязательно, но сэкономит 40+ полей</span><input placeholder="А 123 ВС 77" autocomplete="off" aria-label="Госномер или VIN" /></label>` : ""}
          <button type="button" class="a-link" data-sell-demo>Нет фото под рукой — показать на примере</button>
        </section>

        <section class="a-scan" data-sell-step="2" hidden>
          <div class="a-scan-photo ph" data-sell-photo></div>
          <ul class="a-scan-log">${K.log.map((l) => `<li>${l}</li>`).join("")}</ul>
        </section>

        <section class="a-draft" data-sell-step="3" hidden>
          <div class="a-draft-photos"><div class="a-draft-main ph" data-sell-photo></div><div class="a-draft-more"><label class="a-addphoto"><input type="file" accept="image/*" multiple data-sell-more />+ фото</label><span>${K.tip}</span></div><div class="a-draft-thumbs" data-sell-thumbs></div></div>
          <form class="a-form" data-sell-form>
            <p class="a-form-status"><i></i>Заполнено автоматически · проверьте выделенное<em>Демо: распознавание в прототипе сымитировано</em></p>
            <label class="a-field"><span>Название</span><input value="${K.title}" /></label>
            <div class="a-field"><span>Категория</span><div class="a-field-cat"><b data-cat-label>${s.parent} / ${s.name}</b><button type="button" data-pick="Категория|${s.parent} / ${s.name}|Электроника / Смартфоны|Электроника / Ноутбуки|Транспорт / Автомобили|Недвижимость / Квартиры|Дом и сад / Мебель|Одежда и обувь" data-pick-target="[data-cat-label]">изменить</button></div></div>
            <div class="a-field"><span>Характеристики</span><div class="a-attrs">
              ${K.guessed.map(([k, v]) => `<button type="button" class="ok" data-pick="${U().esc([k, v].concat(((s.top.find((f) => f.label === k) || {}).options || { "Сделка": ["Аренда надолго", "Посуточно"], "Коробка": ["Робот", "Вариатор", "Механика"], "Привод": ["Полный", "Задний"], "Цвет": ["Чёрный", "Белый", "Серый"], "Балкон": ["Нет", "Лоджия"], "Санузел": ["Совмещённый"] }[k] || []).filter((o) => o !== v), "Указать вручную…").join("|"))}"><small>${k}</small><span data-pick-val>${v}</span></button>`).join("")}
              <div class="a-attr-ask">${K.ask}</div>
              <button type="button" class="a-pill-more" data-sheet-open>Ещё ${s.rest - (kind === "car" ? 6 : 0)} необязательных</button>
            </div></div>
            <div class="a-field"><span>Цена</span>
              <div class="a-price-row"><input inputmode="numeric" value="${U().fmt(K.price).replace(" ₽", "")}" data-sell-price data-from="${f.from}" data-to="${f.to}" aria-label="Цена" /><b>₽</b></div>
              <div class="a-fair"><div class="a-fair-bar"><i style="left:50%" data-sell-dot></i></div><div class="a-fair-legend"><span>${U().fmtShort(f.from)}</span><b data-sell-verdict>Цена в рынке</b><span>${U().fmtShort(f.to)}</span></div></div>
              <div class="a-presets" data-single>${["Быстрее", "В рынке", "Не спешу"].map((n, i) => `<button type="button" data-toggle data-sell-preset="${K.presets[i]}" class="${i === 1 ? "on" : ""}"><small>${n}</small>${U().fmtShort(K.presets[i])}</button>`).join("")}</div>
            </div>
            <label class="a-field"><span>Описание</span><textarea rows="4">${K.text}</textarea></label>
            <div class="a-field"><span>Где и как</span><div class="a-attrs">${K.how.map(([k, v]) => `<button type="button" class="ok" data-pick="${U().esc([k, v, "Изменить…", "Отключить"].join("|"))}"><small>${k}</small><span data-pick-val>${v}</span></button>`).join("")}</div></div>
            <div class="a-form-actions"><button type="submit" class="a-cta">Опубликовать</button><button type="button" class="a-cta2" data-sell-draft>В черновики</button></div>
          </form>
        </section>

        <section class="a-done" data-sell-step="4" hidden>
          <i>✓</i>
          <h1>Опубликовано.</h1>
          <p>Объявление «<b data-done-title>${K.title}</b>» уже в поиске. Когда кто-нибудь напишет или добавит его в избранное, мы пришлём уведомление.</p>
          <div class="a-done-card"><div class="ph" data-sell-photo></div><div><b data-done-title>${K.title}</b><strong data-done-price>${U().fmt(K.price)}</strong><small>Хамовники · только что</small></div></div>
          <div class="a-empty-actions"><a class="a-cta" href="${U().href("product", { id: K.product.id })}">Посмотреть объявление</a><a class="a-cta2" href="${U().href("profile")}">Мои объявления</a><a class="a-cta2" href="${U().href("sell")}">Продать ещё</a></div>
        </section>
      </main>${footer()}`;
    },

    init(screen) {
      if (screen !== "sell") return;
      const root = document.querySelector("[data-sell-kind]");
      const demoBg = root.dataset.sellImg ? `url('${root.dataset.sellImg}')` : "";
      const step = (n) => document.querySelectorAll("[data-sell-step]").forEach((el) => { el.hidden = el.dataset.sellStep !== String(n); });
      const paint = (bg) => document.querySelectorAll("[data-sell-photo]").forEach((el) => { el.style.backgroundImage = bg; });
      const start = (bg) => {
        paint(bg); step(2); window.scrollTo(0, 0);
        const lines = [...document.querySelectorAll(".a-scan-log li")]; lines.forEach((l) => l.classList.remove("on"));
        lines.forEach((l, i) => setTimeout(() => l.classList.add("on"), 250 + i * 480));
        setTimeout(() => step(3), 250 + lines.length * 480 + 500);
      };
      // ?demo — сразу показать готовый черновик (для превью и скриншотов)
      if (new URLSearchParams(location.search).has("demo")) { paint(demoBg); step(3); }
      document.querySelector("[data-sell-demo]").addEventListener("click", () => start(demoBg));
      document.querySelector("[data-sell-file]").addEventListener("change", (e) => { const file = e.target.files[0]; if (file) start(`url('${URL.createObjectURL(file)}')`); });
      const price = document.querySelector("[data-sell-price]"), dot = document.querySelector("[data-sell-dot]"), verdict = document.querySelector("[data-sell-verdict]");
      const from = Number(price.dataset.from), to = Number(price.dataset.to);
      const sync = () => {
        const n = Number(price.value.replace(/\D/g, "")) || 0; const pos = Math.max(4, Math.min(96, ((n - from) / (to - from)) * 100));
        dot.style.left = `${pos}%`;
        verdict.textContent = !n ? "Укажите цену" : pos < 33 ? "Ниже рынка — уйдёт быстрее" : pos < 67 ? "Цена в рынке" : "Выше рынка — может продаваться дольше";
      };
      price.addEventListener("input", () => { document.querySelectorAll("[data-sell-preset]").forEach((b) => b.classList.remove("on")); sync(); });
      document.querySelectorAll("[data-sell-preset]").forEach((b) => b.addEventListener("click", () => { price.value = U().fmt(Number(b.dataset.sellPreset)).replace(" ₽", ""); sync(); }));
      document.querySelector("[data-sell-form]").addEventListener("submit", (e) => {
        e.preventDefault(); const title = e.target.querySelector("input").value;
        document.querySelectorAll("[data-done-title]").forEach((el) => { el.textContent = title; }); document.querySelector("[data-done-price]").textContent = `${price.value} ₽`;
        step(4); window.scrollTo(0, 0);
      });
      document.querySelector("[data-sell-draft]").addEventListener("click", () => { const d = U().state.get("drafts", []); d.unshift({ title: document.querySelector(".a-form input").value, price: price.value }); U().state.set("drafts", d); U().toast("Черновик сохранён — он в профиле"); });
      document.querySelector("[data-sell-more]").addEventListener("change", (e) => { const box = document.querySelector("[data-sell-thumbs]"); [...e.target.files].slice(0, 8).forEach((f) => { const t = document.createElement("div"); t.className = "ph"; t.style.backgroundImage = `url('${URL.createObjectURL(f)}')`; box.append(t); }); });
      sync();
    },

    product(ctx) {
      const p = ctx.product; const s = U().seller(p); const f = U().fair(p); const sp = U().specs(p);
      const thumbs = [p].concat(DB.products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 3));
      return `${header()}
      <main class="a-main">
        <nav class="a-crumbs"><a href="${U().href("search")}" data-back>← Назад</a><span>/</span><b>№ 482 103 · ${p.when}</b></nav>
        <div class="a-pdp">
          <section class="a-gallery">
            <div class="a-gallery-main">${U().photo(p, "").replace('class="ph "', 'class="ph" data-main-photo')}<button type="button" class="a-fav" data-fav="${p.id}" aria-label="В избранное">♡</button></div>
            <div class="a-thumbs">${thumbs.map((t, i) => `<button type="button" data-thumb class="${i ? "" : "on"}">${U().photo(t)}</button>`).join("")}</div>
          </section>

          <aside class="a-buy">
            <h1>${p.title}</h1>
            ${p.sub ? `<p class="a-sub">${p.sub}</p>` : ""}
            <div class="a-price"><strong>${U().fmt(p.price)}</strong></div>
            <div class="a-fair a-fair-${f.key}"><div class="a-fair-bar"><i style="left:${f.pos}%"></i></div><div class="a-fair-legend"><span>${U().fmtShort(f.from)}</span><b>${f.label}</b><span>${U().fmtShort(f.to)}</span></div></div>
            <a class="a-cta" href="${U().href("chats", { to: p.id })}">Написать ${s.dat}</a>
            <div class="a-quick"><span>Обычно отвечает за ${s.reply} · спросить в один тап</span>${["Ещё продаёте?", "Можно сегодня?", "Торг уместен?"].map((t) => `<a href="${U().href("chats", { to: p.id, msg: t })}">${t}</a>`).join("")}</div>
            ${p.delivery ? `<a class="a-cta2" href="${U().href("checkout", { id: p.id })}">Купить с доставкой · от 390 ₽</a>` : ""}
            <button type="button" class="a-cta2 a-phone" data-phone>Показать телефон</button>
            <ul class="a-facts">
              <li><small>Где</small><span>${p.place} · ${U().walk(p.km)}</span></li>
              <li><small>Состояние</small><span>${p.cond}</span></li>
              <li><small>Сделка</small><span>${p.delivery ? "Деньги продавцу — после проверки" : "Личная встреча"}</span></li>
            </ul>
            <a class="a-seller" href="${U().href("seller", { id: s.id })}"><span class="a-ava">${s.ini}</span><span><b>${s.name}${p.verified ? " <i>проверен</i>" : ""}</b><small>★ ${s.rate} · ${s.deals} сделок · на площадке с ${s.since}</small></span><span>→</span></a>
          </aside>
        </div>

        <div class="a-info">
          <section><h2>Описание</h2><p>${U().describe(p)}</p></section>
          <section><h2>Характеристики</h2>
            <dl class="a-specs">${sp.top.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}${(sp.more || []).map(([k, v]) => `<div hidden data-spec-more><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
            <button type="button" class="a-link" data-specs-more data-less="Свернуть">Ещё ${(sp.more || []).length} характеристик</button>
          </section>
        </div>

        <section class="a-block"><div class="a-block-head"><h2>Похожие</h2><span>та же модель, ближе и дешевле</span></div><div class="a-grid a-grid-5">${U().related(p, 5).map(card).join("")}</div></section>
      </main>${footer()}
      <div class="a-sticky" ${dockOn() ? "hidden" : ""}><strong>${U().fmtShort(p.price)}</strong><a class="a-cta" href="${U().href("chats", { to: p.id })}">Написать</a></div>`;
    },
  };
})();
