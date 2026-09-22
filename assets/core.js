/* Общее ядро прототипа: рендер экранов, разбор запроса, мелкие взаимодействия.
   Разметку экранов отдаёт concept-a.js через window.V.a. */
(function () {
  const params = new URLSearchParams(location.search);

  const SCREENS = { home: "Главная", category: "Категория", search: "Поиск", product: "Объявление", sell: "Подача", favorites: "Избранное", chats: "Чаты", profile: "Профиль", seller: "Продавец", checkout: "Оформление" };
  const THEMES = { lime: "Лайм", ruby: "Рубин", night: "Ночь", dock: "Док", apple: "Apple", google: "Google" };
  const BAR = ["home", "category", "search", "product", "sell", "favorites", "chats", "profile"]; // экраны в служебной панели

  /* ---------- состояние прототипа: избранное, чаты, город — живёт в localStorage, чтобы экраны были связаны ---------- */
  const mem = {};
  const state = {
    get(key, def) { try { const v = localStorage.getItem(`ruberi:${key}`); if (v !== null) return JSON.parse(v); } catch {} return key in mem ? mem[key] : def; },
    set(key, val) { mem[key] = val; try { localStorage.setItem(`ruberi:${key}`, JSON.stringify(val)); } catch {} return val; },
  };
  const screen = document.body.dataset.screen || "home";

  /* ---------- тема дизайна: одна разметка, три визуальных языка (themes.css) ---------- */
  let theme = params.get("theme") || state.get("theme", "lime"); if (!THEMES[theme]) theme = "lime";
  if (params.get("theme") && params.get("embed") !== "1") state.set("theme", theme); // статичные превью тему не запоминают
  document.documentElement.dataset.theme = theme;

  /* ---------- светлая / тёмная: отдельно от дизайна, у каждого дизайна своя тёмная палитра (themes-dark.css).
     «Как в системе» следит за настройкой ОС. «Ночь» тёмная по определению — переключатель там не нужен. ---------- */
  const MODES = ["light", "dark", "auto"];
  let mode = params.get("mode") || state.get("mode", "light"); if (!MODES.includes(mode)) mode = "light";
  if (params.get("mode") && params.get("embed") !== "1") state.set("mode", mode);
  const sysDark = matchMedia("(prefers-color-scheme: dark)");
  const isDark = () => theme === "night" || mode === "dark" || (mode === "auto" && sysDark.matches);
  function applyMode() {
    const dark = isDark(), fixed = theme === "night";
    document.documentElement.dataset.mode = dark ? "dark" : "light";
    document.querySelectorAll("[data-mode-btn]").forEach((b) => { b.setAttribute("aria-pressed", String(dark)); b.disabled = fixed; b.title = fixed ? "«Ночь» — всегда тёмная" : dark ? "Включить светлую тему" : "Включить тёмную тему"; });
    document.querySelectorAll("[data-mode-set]").forEach((b) => { b.setAttribute("aria-selected", String(!fixed && b.dataset.modeSet === mode)); b.disabled = fixed; });
    document.querySelectorAll("[data-mode-hint]").forEach((el) => { el.hidden = !fixed; });
  }
  const setMode = (m) => { mode = m; state.set("mode", m); applyMode(); };
  applyMode();
  sysDark.addEventListener("change", applyMode);
  addEventListener("storage", (e) => { if (e.key === "ruberi:mode") { try { mode = JSON.parse(e.newValue) || "light"; } catch {} applyMode(); } }); // рамки телефонов и превью меняются вместе с прототипом

  /* ---------- форматирование ---------- */
  const nf = new Intl.NumberFormat("ru-RU");
  const fmt = (n) => `${nf.format(n)} ₽`.replace(/\u00a0/g, " ");
  const fmtShort = (n) => n >= 1e6 ? `${String(+(n / 1e6).toFixed(n >= 1e7 ? 1 : 2)).replace(".", ",")} млн ₽` : fmt(n);
  const count = (n) => nf.format(n).replace(/\u00a0/g, " ");
  const countShort = (n) => n >= 1e6 ? `${String(+(n / 1e6).toFixed(1)).replace(".", ",")} млн` : n >= 1e3 ? `${Math.round(n / 1e3)} тыс.` : String(n);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const walk = (km) => km <= 1.5 ? `${Math.max(3, Math.round(km * 12))} мин пешком` : `${String(km).replace(".", ",")} км`;
  const kmText = (km) => `${String(km).replace(".", ",")} км`;

  /* ---------- картинки ---------- */
  const ASSET = (window.ASSET_BASE || "assets/");
  const photo = (p, cls = "") => {
    const im = p.img || p;
    const style = im && im.sprite
      ? `background-image:url('${ASSET}catalog-products.png');background-size:214% 214%;background-position:${im.pos}`
      : `background-image:url('${im}')`;
    return `<div class="ph ${cls}" style="${style}" role="img" aria-label="${esc(p.title || "")}"></div>`;
  };

  /* ---------- ссылки ---------- */
  const href = (scr, extra = {}) => {
    const q = new URLSearchParams(extra);
    if (params.get("embed") === "live") q.set("embed", "live"); // внутри витрины остаёмся без служебной панели
    const qs = q.toString(); return `${scr}.html${qs ? `?${qs}` : ""}`;
  };

  /* ---------- разбор запроса на «смысловые» фильтры ---------- */
  const L = "a-zа-яё0-9"; // \b и \w в JS не работают с кириллицей — границы слов задаём сами
  const word = (src) => new RegExp(`(?<![${L}])(?:${src})(?![${L}])`, "gi");
  const DICT = [[word("айфон[а-яё]*|iphone"), "iPhone"], [word("макбук[а-яё]*|macbook"), "MacBook"], [word("про|pro"), "Pro"], [word("макс|max"), "Max"], [word("эйр|air"), "Air"], [word("шкод[а-яё]*|skoda|škoda"), "Škoda"], [word("октави[а-яё]*"), "Octavia"], [word("тойот[а-яё]*"), "Toyota"], [word("гольф[а-яё]*"), "Golf"], [word("плейстейшн|playstation|ps ?5"), "PlayStation 5"]];
  function parse(raw) {
    let s = ` ${raw.toLowerCase()} `;
    const out = [];
    const take = (re, fn) => { s = s.replace(re, (...m) => { const t = fn(...m); if (t) { t.src = m[0].trim(); out.push(t); } return " "; }); };
    const money = (num, unit) => {
      let n = parseFloat(String(num).replace(/\s/g, "").replace(",", "."));
      if (/^(к|k|т|тыс)/.test(unit || "")) n *= 1e3;
      if (/^(м|млн)/.test(unit || "")) n *= 1e6;
      if (!unit && n < 1000) n *= 1e3;
      return n;
    };
    const UNIT = "(к|k|тыс[а-яё]*\\.?|т\\.?р\\.?|млн|м)?";
    take(new RegExp(`\\sдо\\s+(\\d[\\d\\s.,]*)\\s*${UNIT}(?:\\s*(?:руб[а-яё]*\\.?|р\\.?|₽))?(?=\\s)`, "i"), (_, n, u) => ({ type: "price", label: `до ${fmtShort(money(n, u))}`, max: money(n, u) }));
    take(new RegExp(`\\sот\\s+(\\d[\\d\\s.,]*)\\s*${UNIT}(?:\\s*(?:руб[а-яё]*\\.?|р\\.?|₽))?(?=\\s)`, "i"), (_, n, u) => ({ type: "price", label: `от ${fmtShort(money(n, u))}`, min: money(n, u) }));
    take(/\s(рядом|поблизости|недалеко|около дома|возле дома)(?=\s)/i, () => ({ type: "geo", label: "рядом · до 3 км", cycle: "рядом · до 1 км|рядом · до 3 км|рядом · до 5 км|рядом · до 10 км" }));
    take(/\s(?:в\s+)?(москв[аеу]|спб|питер[ае]?|санкт-петербург[ае]?|казан[ьи]|новосибирск[ае]?|екатеринбург[ае]?)(?=\s)/i, (_, c) => ({ type: "geo", label: /моск/.test(c) ? "Москва" : /спб|питер|санкт/.test(c) ? "Санкт-Петербург" : c[0].toUpperCase() + c.slice(1).replace(/[ие]$/, "ь") }));
    take(/\s(с доставкой|доставка|доставкой)(?=\s)/i, () => ({ type: "opt", label: "с доставкой" }));
    take(/\s(нов(ый|ая|ое|ые)|в упаковке|запечатан[а-яё]*)(?=\s)/i, () => ({ type: "opt", label: "новое" }));
    take(/\s(б\/у|бу|с пробегом)(?=\s)/i, () => ({ type: "opt", label: "б/у" }));
    take(/\s(сегодня|срочно)(?=\s)/i, () => ({ type: "opt", label: "можно забрать сегодня" }));
    take(/\s(\d{2,4})\s*(гб|gb|тб|tb)(?=\s)/i, (_, n, u) => ({ type: "attr", label: `${n} ${/т/i.test(u) ? "ТБ" : "ГБ"}` }));
    let what = s.replace(/\s+/g, " ").trim();
    const whatSrc = what;
    if (what) { what = what[0].toUpperCase() + what.slice(1); DICT.forEach(([re, to]) => { what = what.replace(re, to); }); out.unshift({ type: "what", label: what, src: whatSrc }); }
    return out;
  }

  /* ---------- поиск по демо-данным: запрос → чипы → отфильтрованный список ---------- */
  const CAT_WORDS = { phones: "смартфон телефон apple электроника", laptops: "ноутбук компьютер apple электроника", audio: "наушники аудио электроника", photo: "фото камера фотоаппарат электроника", games: "игры приставка консоль электроника", home: "дом сад мебель интерьер", fashion: "одежда обувь аксессуары", hobby: "хобби музыка спорт", sport: "спорт хобби вело", cars: "авто автомобиль автомобили машина транспорт пробегом", flats: "квартира квартиры недвижимость жильё купить" };
  const stem = (w) => w.length > 6 ? w.slice(0, -2) : w.length > 4 ? w.slice(0, -1) : w;
  function find(q) {
    const tokens = parse(q || "");
    const what = (tokens.find((t) => t.type === "what") || {}).label || "";
    const words = what.toLowerCase().split(/[\s,]+/).filter((w) => w.length > 1 && !["для", "или", "на", "по", "из"].includes(w)).map(stem);
    const hay = (p) => `${p.title} ${p.sub || ""} ${CAT_WORDS[p.cat] || ""}`.toLowerCase();
    let list = DB.products.map((p) => ({ p, score: words.filter((w) => hay(p).includes(w)).length }));
    const full = list.filter((x) => x.score === words.length);
    list = (words.length && !full.length ? list.filter((x) => x.score > 0).sort((a, b) => b.score - a.score) : full).map((x) => x.p);
    const price = tokens.filter((t) => t.type === "price");
    price.forEach((t) => { list = list.filter((p) => (t.max ? p.price <= t.max : true) && (t.min ? p.price >= t.min : true)); });
    if (tokens.some((t) => t.type === "geo" && /рядом/.test(t.label))) list = list.filter((p) => p.km <= 3);
    if (tokens.some((t) => t.label === "с доставкой")) list = list.filter((p) => p.delivery);
    if (tokens.some((t) => t.label === "новое")) list = list.filter((p) => /нов/i.test(p.cond));
    return { list, what, tokens };
  }

  /* ---------- продавцы, характеристики, цена к рынку ---------- */
  const SELLERS = [
    { id: "s1", name: "Анна К.", ini: "АК", rate: "4,9", deals: 38, since: 2021, reply: "~10 мин", dat: "Анне" },
    { id: "s2", name: "Тимур Р.", ini: "ТР", rate: "5,0", deals: 12, since: 2023, reply: "~25 мин", dat: "Тимуру" },
    { id: "s3", name: "Мария В.", ini: "МВ", rate: "4,8", deals: 104, since: 2019, reply: "~5 мин", dat: "Марии" },
  ];
  const seller = (p) => SELLERS[(p.id.charCodeAt(0) + p.id.length + p.price) % SELLERS.length];
  const FAIR = { ok: { label: "Цена в рынке", pos: 50 }, low: { label: "Ниже рынка", pos: 20 }, high: { label: "Выше рынка", pos: 84 } };
  const fair = (p) => { const f = FAIR[p.fair || "ok"]; const mid = p.price / (1 + (f.pos - 50) / 170); return { ...f, from: Math.round(mid * 0.86 / 100) * 100, to: Math.round(mid * 1.16 / 100) * 100, key: p.fair || "ok" }; };
  function specs(p) {
    if (p.cat === "phones") return { top: [["Память", (p.title.match(/\d+ ГБ/) || ["256 ГБ"])[0]], ["Состояние", p.cond], ["Аккумулятор", (p.sub || "").match(/АКБ (\d+%)/)?.[1] || "90%"], ["Цвет", (p.sub || "Графит").split(" · ")[0]], ["Комплект", "Коробка, кабель"], ["Гарантия", "Нет"]], rest: 12 };
    if (p.cat === "cars") { const s = (p.sub || "").split(" · "); return { top: [["Год", (p.title.match(/\d{4}/) || ["—"])[0]], ["Пробег", p.cond], ["Двигатель", s[0] || "—"], ["Мощность", s[1] || "—"], ["Кузов / привод", s[2] || "—"], ["Владельцев", "1"]], rest: 48 }; }
    if (p.cat === "flats") { const t = p.title.split(", "); return { top: [["Комнат", t[0]], ["Площадь", t[1]], ["Этаж", t[2]], ["До метро", p.cond], ["Дом", (p.sub || "").split(" · ")[0]], ["Ремонт", (p.sub || "").split(" · ")[1] || "—"]], rest: 29 }; }
    return { top: [["Состояние", p.cond], ["Размещено", p.when], ["Доставка", p.delivery ? "Есть" : "Только самовывоз"], ["Район", p.place]], rest: 6 };
  }
  const MORE = { phones: [["Экран", "6,1″ OLED, 120 Гц"], ["SIM", "nano-SIM + eSIM"], ["Год выпуска", "2021"], ["Ремонты", "Не было"], ["Face ID", "Работает"], ["Чек", "Есть"], ["Торг", "Небольшой"], ["Обмен", "Нет"]],
    cars: [["Руль", "Левый"], ["Цвет", "Красный"], ["ПТС", "Оригинал"], ["Растаможен", "Да"], ["Комплектация", "Style"], ["Резина", "Два комплекта"], ["Сервисная книжка", "Есть"], ["Торг", "У капота"], ["Обмен", "Нет"]],
    flats: [["Санузел", "Раздельный"], ["Балкон", "Есть"], ["Высота потолков", "2,7 м"], ["Лифт", "Пассажирский"], ["Парковка", "Во дворе"], ["Год постройки", "1998"], ["Ипотека", "Возможна"], ["Мебель", "Остаётся кухня"]] };
  const specsFull = (p) => { const s = specs(p); return { ...s, more: MORE[p.cat] || [["Торг", "Уместен"], ["Обмен", "Нет"], ["Причина продажи", "Не пользуюсь"]] }; };
  const describe = (p) => p.cat === "cars" ? "Машина в отличном состоянии, обслуживалась у официального дилера, все ТО по регламенту. Не бита, не крашена, два комплекта резины. Покажу в любой день, возможна проверка на сервисе покупателя."
    : p.cat === "flats" ? "Светлая квартира в тихом дворе. Сделан ремонт, остаётся кухня и встроенная мебель. Один взрослый собственник, свободная продажа, документы готовы. Показы по вечерам и в выходные."
    : "Пользовались аккуратно, всё работает как должно. Без ремонтов и скрытых дефектов, все мелкие следы использования видны на фото. Проверка при встрече — сколько нужно. Отдам с полным комплектом.";
  const related = (p, n = 4) => DB.products.filter((x) => x.cat === p.cat && x.id !== p.id).concat(DB.products.filter((x) => x.cat !== p.cat)).slice(0, n);

  /* ---------- панель «все фильтры» (красится CSS-переменными темы) ---------- */
  function filterSheet(schema, forSell = false) {
    const extra = { phones: ["Цвет", "Аккумулятор", "SIM", "Гарантия", "Комплект", "Год выпуска", "Экран", "Продавец", "Торг", "Обмен", "Рейтинг продавца", "Срок размещения", "Только с фото", "Безопасная сделка"],
      cars: ["Кузов", "Привод", "Двигатель", "Объём", "Мощность", "Владельцы", "ПТС", "Цвет", "Руль", "Состояние", "Растаможен", "Торг", "Обмен", "Продавец"],
      flats: ["Тип дома", "Ремонт", "Балкон", "Санузел", "Парковка", "Лифт", "Высота потолков", "Год постройки", "Ипотека", "Продавец", "Вид из окон", "Мебель", "Техника", "Торг"] };
    const key = Object.keys(DB.schemas).find((k) => DB.schemas[k] === schema) || "phones";
    const rows = schema.top.map((f) => `<details class="sheet-row" open><summary>${f.label}<i></i></summary><div class="sheet-opts">${f.options.map((o) => `<button type="button" data-toggle>${o}</button>`).join("")}</div></details>`).join("")
      + extra[key].map((n) => `<details class="sheet-row"><summary>${n}<i></i></summary><div class="sheet-opts"><button type="button" data-toggle>Любой</button><button type="button" data-toggle>Указать…</button></div></details>`).join("");
    return `<div class="sheet" data-sheet aria-hidden="true"><button class="sheet-scrim" type="button" data-sheet-close aria-label="Закрыть"></button>
      <aside class="sheet-panel" role="dialog" aria-modal="true" aria-label="Все фильтры">
        <header><strong>${forSell ? "Необязательные характеристики" : "Все фильтры"}</strong><button type="button" data-sheet-close aria-label="Закрыть">✕</button></header>
        <label class="sheet-find"><input type="search" placeholder="Найти фильтр: «привод», «балкон», «АКБ»…" data-sheet-find /></label>
        <p class="sheet-note">Сверху — то, чем пользуются чаще всего в «${schema.name}». Остальные ${schema.rest} характеристик свёрнуты и ищутся по названию.</p>
        <div class="sheet-list">${rows}</div>
        <footer><button type="button" class="sheet-reset" data-sheet-close>Сбросить</button><button type="button" class="sheet-apply" data-sheet-close>${forSell ? "Готово" : `Показать ${count(Math.round(schema.count / 9000))} объявлений`}</button></footer>
      </aside></div>`;
  }

  /* ---------- служебная панель прототипа: переходы между экранами ---------- */
  function conceptBar() {
    const bar = document.createElement("div");
    bar.className = "cbar";
    bar.innerHTML = `<a class="cbar-home" href="index.html" title="О прототипе">◆ RUBERI · прототип</a>
      <a href="mobile.html">Телефон</a><a href="system.html">Дизайн-система</a>
      <button type="button" class="cbar-mode" data-mode-btn aria-pressed="false"><i aria-hidden="true"></i>Тёмная</button>
      <div class="cbar-group" role="tablist" aria-label="Дизайн">${Object.entries(THEMES).map(([k, n]) => `<button type="button" role="tab" aria-selected="${k === theme}" data-theme-btn="${k}">${n}</button>`).join("")}</div>
      <nav class="cbar-screens" aria-label="Экран">${BAR.map((k) => [k, SCREENS[k]]).map(([k, n]) => `<a href="${k}.html" data-screen-link="${k}" ${k === screen ? 'aria-current="page"' : ""}>${n}</a>`).join("")}</nav>`;
    document.body.prepend(bar);
  }
  function syncBarLinks() {
    document.querySelectorAll("[data-screen-link]").forEach((a) => {
      const keep = new URLSearchParams(location.search); keep.delete("v");
      if (a.dataset.screenLink !== screen) { ["id", "q", "c", "kind", "demo"].forEach((k) => keep.delete(k)); }
      const qs = keep.toString(); a.href = `${a.dataset.screenLink}.html${qs ? `?${qs}` : ""}`;
    });
  }

  /* ---------- рендер ---------- */
  function render() {
    document.documentElement.dataset.variant = "a"; // стили прототипа заскоуплены под [data-variant="a"]
    const v = window.V.a;
    const ctx = { params, q: params.get("q") || DB.demoQuery, schemaKey: DB.schemas[params.get("c")] ? params.get("c") : "phones", product: DB.byId(params.get("id")) || DB.byId("ip1") };
    ctx.schema = DB.schemas[ctx.schemaKey];
    const app = document.getElementById("app"); app.innerHTML = v[screen](ctx);
    // панель «все фильтры» строится из схемы той категории, которая сейчас на экране
    const sheetSchema = screen === "category" ? ctx.schema : screen === "search" ? DB.schemas[app.querySelector("[data-schema]")?.dataset.schema || "phones"] : screen === "sell" ? DB.schemas[{ car: "cars", flat: "flats" }[params.get("kind")] || "phones"] : null;
    if (sheetSchema) app.insertAdjacentHTML("beforeend", filterSheet(sheetSchema, screen === "sell"));
    document.title = `${SCREENS[screen]} · RUBERI`;
    syncBarLinks();
    syncFavs();
    bindParsers();
    bindTyper();
    v.init?.(screen, ctx);
    window.scrollTo(0, 0);
  }

  /* живой разбор запроса: input[data-parse] → [data-parse-out] */
  function chipsHTML(tokens) {
    // data-key — устойчивый ключ чипа: «что ищем», цена и гео живут по типу (их текст меняется по мере набора), остальные — по значению
    const seen = {};
    return tokens.map((t) => {
      let key = ["what", "price", "geo"].includes(t.type) ? t.type : `${t.type}:${t.label}`;
      seen[key] = (seen[key] || 0) + 1; if (seen[key] > 1) key += `#${seen[key]}`;
      return `<span class="tok tok-${t.type}" data-tok data-key="${esc(key)}" data-label="${esc(t.label)}" data-src="${esc(t.src || "")}">${t.cycle ? `<button type="button" class="tok-cycle" data-cycle="${esc(t.cycle)}" title="Нажмите, чтобы изменить радиус">${esc(t.label)}</button>` : esc(t.label)}<button type="button" aria-label="Убрать" data-tok-x>×</button></span>`;
    }).join("");
  }
  /* Обновляем чипы точечно, а не через innerHTML: иначе на каждую букву все чипы пересоздаются
     и заново проигрывают анимацию появления (моргают). Анимируется только реально новый чип. */
  function reconcile(out, html) {
    const tpl = document.createElement("template"); tpl.innerHTML = html;
    const want = [...tpl.content.children];
    const have = new Map([...out.children].map((el) => [el.dataset.key, el]));
    let cursor = out.firstElementChild;
    want.forEach((next) => {
      const old = have.get(next.dataset.key);
      if (old) {
        have.delete(next.dataset.key);
        if (old.dataset.label !== next.dataset.label) { old.innerHTML = next.innerHTML; old.dataset.label = next.dataset.label || ""; }
        if (next.dataset.src !== undefined) old.dataset.src = next.dataset.src;
        if (old === cursor) cursor = cursor.nextElementSibling; else out.insertBefore(old, cursor);
      } else out.insertBefore(next, cursor);
    });
    have.forEach((el) => el.remove());
  }
  function addHTML(tokens) {
    const has = (type, re) => tokens.some((t) => t.type === type && (!re || re.test(t.label)));
    const add = [];
    if (!has("price")) add.push(["цена", " до "]);
    if (!has("geo")) add.push(["рядом", " рядом"]);
    if (!has("opt", /достав/)) add.push(["с доставкой", " с доставкой"]);
    if (!has("opt", /нов|б\/у/)) add.push(["только новое", " новый"]);
    return add.map(([label, text]) => `<button type="button" class="tok-add" data-key="add:${label}" data-label="${label}" data-append="${esc(text)}">+ ${label}</button>`).join("");
  }
  function bindParsers() {
    document.querySelectorAll("[data-parse]").forEach((input) => {
      const out = document.querySelector(input.dataset.parse);
      const upd = () => { const t = parse(input.value); reconcile(out, chipsHTML(t) + (input.type !== "hidden" && t.some((x) => x.type === "what") ? addHTML(t) : "")); out.closest("[data-parse-wrap]")?.classList.toggle("has-tokens", t.length > 0); };
      input.addEventListener("input", upd); upd();
    });
  }

  /* «печатающая» строка: пока человек не тронул поле, показываем на примерах, как писать запрос */
  let typerTimer;
  function bindTyper() {
    clearTimeout(typerTimer);
    const input = document.querySelector("[data-typer]"); if (!input) return;
    const samples = input.dataset.typer.split("|"); let i = 0, n = 0, dir = 1, stopped = false;
    const fire = () => input.dispatchEvent(new Event("input", { bubbles: true }));
    const stop = () => { if (stopped) return; stopped = true; clearTimeout(typerTimer); input.value = ""; fire(); };
    input.addEventListener("focus", stop, { once: true });
    const tick = () => {
      if (stopped || !input.isConnected) return;
      const s = samples[i]; n += dir; input.value = s.slice(0, n); fire();
      let wait = dir > 0 ? 55 : 18;
      if (n === s.length) { dir = -1; wait = 2600; } else if (n === 0) { dir = 1; i = (i + 1) % samples.length; wait = 500; }
      typerTimer = setTimeout(tick, wait);
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || embed) { input.value = samples[0]; fire(); return; }
    typerTimer = setTimeout(tick, 600);
  }

  const FAVS0 = ["canon1", "bike", "ip3"]; // стартовый набор, чтобы «Избранное» не было пустым при первом заходе
  function syncFavs() { const favs = state.get("favs", FAVS0); document.querySelectorAll("[data-fav]").forEach((b) => { if (b.dataset.fav) b.classList.toggle("on", favs.includes(b.dataset.fav)); }); }

  let toastTimer;
  function toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.append(t); }
    t.textContent = msg; t.classList.add("on"); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("on"), 2200);
  }

  document.addEventListener("click", (e) => {
    const mb = e.target.closest("[data-mode-btn]"); if (mb) { setMode(isDark() ? "light" : "dark"); return; }
    const ms = e.target.closest("[data-mode-set]"); if (ms) { setMode(ms.dataset.modeSet); return; }
    const tb = e.target.closest("[data-theme-btn]"); if (tb) {
      const LAYOUTS = ["dock", "apple", "google"]; const relayout = LAYOUTS.includes(theme) || LAYOUTS.includes(tb.dataset.themeBtn); // у этих дизайнов своя разметка
      theme = tb.dataset.themeBtn; state.set("theme", theme); document.documentElement.dataset.theme = theme; if (relayout) render();
      document.querySelectorAll("[data-theme-btn]").forEach((b) => b.setAttribute("aria-selected", String(b === tb))); applyMode();
      const q = new URLSearchParams(location.search); if (q.has("theme")) { q.delete("theme"); const qs = q.toString(); history.replaceState(null, "", qs ? `?${qs}` : location.pathname); }
      return;
    }
    const fav = e.target.closest("[data-fav]"); if (fav) {
      e.preventDefault(); const id = fav.dataset.fav; const on = !fav.classList.contains("on");
      if (id) { const favs = state.get("favs", FAVS0).filter((x) => x !== id); if (on) favs.unshift(id); state.set("favs", favs); syncFavs(); document.dispatchEvent(new CustomEvent("favs-changed")); } else fav.classList.toggle("on");
      return toast(on ? "В избранном" : "Убрано из избранного");
    }
    const tx = e.target.closest("[data-tok-x]"); if (tx) {
      e.preventDefault(); const tok = tx.closest("[data-tok]"); const input = tok.closest("[data-parse-wrap]")?.querySelector("[data-parse]");
      if (input && tok.dataset.src) {
        // слова токена могут стоять в запросе не подряд («айфон до 60к про») — убираем по одному
        let v = ` ${input.value.toLowerCase()} `; tok.dataset.src.split(" ").forEach((w) => { v = v.replace(` ${w} `, " "); });
        input.value = v.replace(/\s+/g, " ").trim(); input.dispatchEvent(new Event("input", { bubbles: true }));
      } else tok.remove();
      return;
    }
    const cyc = e.target.closest("[data-cycle]"); if (cyc) { const opts = cyc.dataset.cycle.split("|"); cyc.textContent = opts[(opts.indexOf(cyc.textContent) + 1) % opts.length]; return; }
    const ap = e.target.closest("[data-append]"); if (ap) { const input = ap.closest("[data-parse-wrap]").querySelector("[data-parse]"); input.focus(); input.value = input.value.trimEnd() + ap.dataset.append; input.dispatchEvent(new Event("input", { bubbles: true })); return; }
    const tg = e.target.closest("[data-toggle]"); if (tg) { const grp = tg.closest("[data-single]"); if (grp) grp.querySelectorAll("[data-toggle]").forEach((b) => b !== tg && b.classList.remove("on")); return tg.classList.toggle("on"); }
    const so = e.target.closest("[data-sheet-open]"); if (so) { const s = document.querySelector("[data-sheet]"); s.classList.add("open"); s.setAttribute("aria-hidden", "false"); return; }
    const sc = e.target.closest("[data-sheet-close]"); if (sc) { const s = document.querySelector("[data-sheet]"); s.classList.remove("open"); s.setAttribute("aria-hidden", "true"); return; }
    const th = e.target.closest("[data-thumb]"); if (th) { const main = document.querySelector("[data-main-photo]"); main.style.cssText = th.querySelector(".ph").style.cssText; document.querySelectorAll("[data-thumb]").forEach((b) => b.classList.toggle("on", b === th)); return; }
    const pop = e.target.closest("[data-pop]"); document.querySelectorAll("[data-pop].open").forEach((x) => x !== pop && x.classList.remove("open"));
    if (pop && !e.target.closest("[data-pop-body]")) pop.classList.toggle("open");
    const opt = e.target.closest("[data-pop-opt]"); if (opt) { const host = opt.closest("[data-pop]"); host.querySelector("[data-pop-val]").textContent = opt.textContent; host.classList.add("set"); host.classList.remove("open"); }
    const fill = e.target.closest("[data-fill]"); if (fill) { const input = document.querySelector("[data-parse]"); input.focus(); input.value = fill.dataset.fill; input.dispatchEvent(new Event("input", { bubbles: true })); return; }
    const ts = e.target.closest("[data-toast]"); if (ts) toast(ts.dataset.toast);
  });
  document.addEventListener("input", (e) => {
    if (e.target.matches("[data-sheet-find]")) { const q = e.target.value.trim().toLowerCase(); document.querySelectorAll(".sheet-row").forEach((r) => { r.hidden = q && !r.querySelector("summary").textContent.toLowerCase().includes(q); }); }
    if (e.target.matches("[data-radius]")) { const steps = [1, 3, 5, 10, 25]; const v = steps[e.target.value]; document.querySelectorAll("[data-radius-out]").forEach((o) => { o.textContent = `${v} км`; }); }
  });
  document.addEventListener("submit", (e) => {
    const f = e.target.closest("[data-search]"); if (!f) return;
    e.preventDefault(); const q = f.querySelector("input").value.trim();
    location.href = href("search", q ? { q } : {});
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.querySelector("[data-sheet].open [data-sheet-close]")?.click(); });

  window.UI = { fmt, fmtShort, count, countShort, esc, walk, kmText, photo, href, parse, find, chipsHTML, seller, SELLERS, fair, specs: specsFull, describe, related, toast, state, FAVS0, screen, params, mode: () => mode, applyMode };
  window.V = window.V || {};
  const embed = params.has("embed"); // режим превью для обзорной страницы: без служебной панели
  window.addEventListener("DOMContentLoaded", () => { if (embed) document.documentElement.classList.add("embed", params.get("embed") === "live" ? "embed-live" : "embed-static"); else conceptBar(); render(); applyMode(); });
})();
