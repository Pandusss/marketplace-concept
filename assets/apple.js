/* Дизайн «Apple · Liquid Glass» — своя компоновка поверх той же логики.
   Плавающая стеклянная навигация сверху, стеклянный tab bar-капсула снизу с отдельной кнопкой «Продать»,
   главная — коллаж фото со стеклянной панелью поиска (как Spotlight), категории — «иконки приложений»,
   объявление — фото во весь экран и стеклянный лист снизу. Остальные экраны берут разметку A. */
(function () {
  const U = () => window.UI;
  const on = () => document.documentElement.dataset.theme === "apple";
  const unread = () => (window.CHATS ? window.CHATS.unread() : 0);
  const EX = ["айфон 13 про до 60 тысяч рядом с доставкой", "диван до 30 тысяч срочно", "шкода октавия до 2.5 млн в москве"];
  const svg = (d, w = 22) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const I = {
    home: svg('<path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z"/>', 24),
    heart: svg('<path d="M12 20.5s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.7-7.5 10.3-7.5 10.3z"/>', 24),
    chat: svg('<path d="M20 11.5c0 4.1-3.6 7.5-8 7.5-1.2 0-2.3-.2-3.3-.6L4 20l1.3-3.6A7.2 7.2 0 0 1 4 11.5C4 7.4 7.6 4 12 4s8 3.4 8 7.5z"/>', 24),
    person: svg('<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>', 24),
    plus: svg('<path d="M12 5v14M5 12h14"/>', 24),
    search: svg('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>', 20),
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 22),
    back: svg('<path d="m14.5 5-7 7 7 7"/>', 22),
    share: svg('<path d="M12 3.5v12M7.5 8 12 3.5 16.5 8M6 12.5V20h12v-7.5"/>', 21),
    pin: svg('<path d="M12 21s-6.5-6-6.5-11.5a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/>', 17),
  };

  /* ---------- оболочка ---------- */
  function top() {
    const s = U().screen; const hideSearch = s === "home" || s === "search";
    return `<div class="g-wrap" data-parse-wrap>
      <div class="g-bg" aria-hidden="true"></div>
      <header class="g-nav glass">
        <a class="g-logo" href="${U().href("home")}">RUBERI</a>
        ${hideSearch ? "" : `<form class="g-nav-search" data-search>${I.search}<input name="q" placeholder="Поиск" autocomplete="off" aria-label="Поиск" /></form>`}
        <button type="button" class="g-geo" data-geo-open>${I.pin}<span data-geo-label></span></button>
        <a class="g-ic g-ic-desk" href="${U().href("favorites")}" aria-label="Избранное">${I.heart}</a>
        <a class="g-ic g-ic-desk" href="${U().href("chats")}" aria-label="Чаты">${I.chat}${unread() ? `<sup>${unread()}</sup>` : ""}</a>
        <a class="g-me" href="${U().href("profile")}" aria-label="Профиль">К</a>
      </header>`;
  }

  function dock() {
    const s = U().screen;
    if (s === "chats") return "</div>";
    if (s === "product") {
      const p = DB.byId(U().params.get("id")) || DB.byId("ip1"); const sl = U().seller(p); const f = U().fair(p);
      return `<div class="g-actionbar glass">
          <div class="g-bar-price"><strong>${U().fmtShort(p.price)}</strong><small class="g-fair-${f.key}">${f.label}</small></div>
          ${p.delivery ? `<a class="g-btn g-btn-clear" href="${U().href("checkout", { id: p.id })}">Купить</a>` : ""}
          <a class="g-btn g-btn-tint" href="${U().href("chats", { to: p.id })}">Написать ${sl.dat}</a>
        </div></div>`;
    }
    const cur = (n) => (s === n ? 'aria-current="page"' : "");
    return `<nav class="g-tabbar-wrap" aria-label="Разделы">
        <div class="g-tabbar glass">${[["home", I.home, "Главная"], ["favorites", I.heart, "Избранное"], ["chats", I.chat, "Чаты"], ["profile", I.person, "Профиль"]].map(([k, ic, n]) => `<a href="${U().href(k)}" ${cur(k)}>${ic}<span>${n}</span>${k === "chats" && unread() ? `<sup>${unread()}</sup>` : ""}</a>`).join("")}</div>
        <a class="g-fab" href="${U().href("sell")}" ${cur("sell")} aria-label="Продать">${I.plus}<span>Продать</span></a>
      </nav></div>`;
  }

  const card = (p) => `
    <a class="g-card" href="${U().href("product", { id: p.id })}" data-price="${p.price}" data-km="${p.km}">
      <div class="g-card-img">${U().photo(p)}<button type="button" class="g-fav glass" data-fav="${p.id}" aria-label="В избранное">${I.heart}</button><span class="g-price glass">${U().fmtShort(p.price)}</span></div>
      <h3>${p.title}</h3>
      <p>${U().walk(p.km)} · ${p.place}${p.fair === "low" ? ' <em class="g-good">ниже рынка</em>' : ""}</p>
    </a>`;

  const spot = (q, typer) => `
    <form class="g-field" data-search>${I.search}<input name="q" data-parse="#g-tokens" ${typer ? `data-typer="${U().esc(EX.join("|"))}"` : ""} value="${U().esc(q)}" placeholder="Например: диван до 30 тысяч рядом" autocomplete="off" aria-label="Поисковый запрос" /><button type="submit" aria-label="Найти">${I.arrow}</button></form>
    <div class="g-understood"><span>Понимаю так</span><div class="a-tokens" id="g-tokens"></div></div>`;

  /* ---------- главная ---------- */
  function home() {
    const art = ["chair1", "skoda1", "ip1", "guitar", "flat2", "canon1"].map(DB.byId);
    const link = (x) => (x.schema ? U().href("category", { c: x.schema }) : x.id === "electronics" ? U().href("category") : U().href("search", { q: x.name }));
    const fresh = ["chair1", "ps5", "mac1", "ip1", "sneaker", "bike", "guitar", "canon1", "skoda1", "flat1", "sofa", "sony", "watch1", "plant", "kbd", "golf1"].map(DB.byId);
    return `${top()}
      <main class="g-main">
        <section class="g-hero">
          <div class="g-hero-art" aria-hidden="true">${art.map((p) => U().photo(p)).join("")}</div>
          <div class="g-spot glass">
            <h1>Что ищете?</h1>
            ${spot("", true)}
            <div class="g-try">${EX.slice(1).concat("новый макбук эйр 256 гб от 50к").map((q) => `<button type="button" data-fill="${U().esc(q)}">${q}</button>`).join("")}</div>
          </div>
        </section>

        <section class="g-sec">
          <div class="g-sec-head"><h2>Категории</h2></div>
          <div class="g-apps">${DB.categories.map((c) => `<a class="g-app" href="${link(c)}"><span class="g-app-icon">${U().photo(c)}</span><b>${c.name}</b><small>${U().countShort(c.count)}</small></a>`).join("")}</div>
        </section>

        <section class="g-sec">
          <div class="g-sec-head"><h2>Рядом с вами</h2><button type="button" class="g-link" data-geo-open>Хамовники · до 3 км ›</button></div>
          <div class="g-grid">${fresh.map(card).join("")}</div>
        </section>
      </main>${dock()}`;
  }

  /* ---------- поиск ---------- */
  function search(ctx, base) {
    const { list, what } = U().find(ctx.q); const n = list.length;
    if (!n) return base(ctx);
    const avg = Math.round(list.reduce((a, p) => a + p.price, 0) / n / 100) * 100;
    const schemaKey = list.every((p) => p.cat === "cars") ? "cars" : list.every((p) => p.cat === "flats") ? "flats" : "phones";
    const plural = (k) => (k % 10 === 1 && k % 100 !== 11 ? "объявление" : [2, 3, 4].includes(k % 10) && ![12, 13, 14].includes(k % 100) ? "объявления" : "объявлений");
    const watched = U().state.get("searches", window.SEARCHES0 || []); const saved = watched.some((x) => x.q === ctx.q);
    if (saved && watched.find((x) => x.q === ctx.q).fresh) { watched.find((x) => x.q === ctx.q).fresh = 0; U().state.set("searches", watched); }
    return `${top()}
      <main class="g-main" data-schema="${schemaKey}">
        <section class="g-shead"><p class="g-kicker">Поиск</p><h1>${U().esc(what || "Все объявления")}</h1><p class="g-sub">${n} ${plural(n)} · в среднем ${U().fmtShort(avg)} · с доставкой ${list.filter((p) => p.delivery).length}</p></section>
        <div class="g-query glass">${spot(ctx.q, false)}</div>
        <div class="g-filters">${window.V.a._.pills(DB.schemas[schemaKey])}
          <div class="a-toolbar-r"><button type="button" class="a-save ${saved ? "on" : ""}" data-save-search="${U().esc(ctx.q)}">${saved ? "Сообщим о новых" : "Сообщать о новых"}</button>
          <div class="a-sort" data-pop><button type="button"><span>Сначала</span><b data-pop-val>подходящие</b></button><div class="a-pop a-pop-r" data-pop-body>${["подходящие", "дешевле", "новые", "ближе"].map((o) => `<button type="button" data-pop-opt data-sort="${o}">${o}</button>`).join("")}</div></div></div>
        </div>
        <div class="g-grid" data-results>${list.map((p, i) => card(p).replace('<a class="g-card"', `<a class="g-card" data-i="${i}"${i >= 8 ? " hidden" : ""}`)).join("")}</div>
        ${n > 8 ? `<button type="button" class="g-more glass" data-more>Показать ещё ${n - 8}</button>` : ""}
      </main>${dock()}`;
  }

  /* ---------- объявление ---------- */
  function product(ctx) {
    const p = ctx.product, s = U().seller(p), f = U().fair(p), sp = U().specs(p);
    const shots = [p].concat(DB.products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 3));
    return `${top()}
      <main class="g-pdp">
        <section class="g-stage">
          <div class="g-stage-photo">${U().photo(p, "").replace('class="ph "', 'class="ph" data-main-photo')}</div>
          <div class="g-stage-tools">
            <a class="g-circle glass" href="${U().href("search")}" data-back aria-label="Назад">${I.back}</a><span></span>
            <button type="button" class="g-circle glass" data-toast="Ссылка скопирована" aria-label="Поделиться">${I.share}</button>
            <button type="button" class="g-circle g-fav-big glass" data-fav="${p.id}" aria-label="В избранное">${I.heart}</button>
          </div>
          <div class="g-stage-thumbs glass">${shots.map((t, i) => `<button type="button" data-thumb class="${i ? "" : "on"}" aria-label="Фото ${i + 1}">${U().photo(t)}</button>`).join("")}</div>
        </section>

        <section class="g-sheet">
          <div class="g-sheet-grid">
            <article class="g-article">
              <p class="g-kicker">${p.when} · ${p.place}</p>
              <h1>${p.title}</h1>
              ${p.sub ? `<p class="g-lede">${p.sub}</p>` : ""}
              <div class="g-group"><h2 class="g-group-h">Описание</h2><p class="g-cell">${U().describe(p)}</p></div>
              <div class="g-group"><h2 class="g-group-h">Характеристики</h2>
                <dl class="g-list">${sp.top.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}${(sp.more || []).map(([k, v]) => `<div hidden data-spec-more><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
                <button type="button" class="g-link g-link-pad" data-specs-more data-less="Свернуть">Ещё ${(sp.more || []).length} характеристик</button></div>
            </article>

            <aside class="g-side">
              <div class="g-pricecard glass">
                <strong>${U().fmt(p.price)}</strong>
                <div class="a-fair"><div class="a-fair-bar"><i style="left:${f.pos}%"></i></div><div class="a-fair-legend"><span>${U().fmtShort(f.from)}</span><b>${f.label}</b><span>${U().fmtShort(f.to)}</span></div></div>
                <a class="g-btn g-btn-tint g-btn-block" href="${U().href("chats", { to: p.id })}">Написать ${s.dat}</a>
                ${p.delivery ? `<a class="g-btn g-btn-gray g-btn-block" href="${U().href("checkout", { id: p.id })}">Купить с доставкой · от 390 ₽</a>` : ""}
                <button type="button" class="g-btn g-btn-gray g-btn-block" data-phone>Показать телефон</button>
                <div class="g-quick"><span>Спросить в один тап</span>${["Ещё продаёте?", "Можно сегодня?", "Торг уместен?"].map((t) => `<a href="${U().href("chats", { to: p.id, msg: t })}">${t}</a>`).join("")}</div>
              </div>
              <a class="g-seller g-list" href="${U().href("seller", { id: s.id })}"><span class="a-ava">${s.ini}</span><span><b>${s.name}${p.verified ? ' <i class="g-check">✓</i>' : ""}</b><small>★ ${s.rate} · ${s.deals} сделок · отвечает ${s.reply}</small></span><em>›</em></a>
              <dl class="g-list"><div><dt>Где</dt><dd>${p.place} · ${U().walk(p.km)}</dd></div><div><dt>Состояние</dt><dd>${p.cond}</dd></div><div><dt>Сделка</dt><dd>${p.delivery ? "Оплата под защитой" : "Личная встреча"}</dd></div></dl>
            </aside>
          </div>
          <div class="g-sec g-sheet-more"><div class="g-sec-head"><h2>Похожие</h2></div><div class="g-grid">${U().related(p, 8).map(card).join("")}</div></div>
        </section>
      </main>${dock()}`;
  }

  window.GLASS = { on, top, dock, card };
  const A = window.V.a; const base = { home: A.home, search: A.search, product: A.product };
  A.home = (ctx) => (on() ? home(ctx) : base.home(ctx));
  A.search = (ctx) => (on() ? search(ctx, base.search) : base.search(ctx));
  A.product = (ctx) => (on() ? product(ctx) : base.product(ctx));
})();
