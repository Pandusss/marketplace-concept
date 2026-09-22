/* Дизайн «Google · Material 3 Expressive» — своя компоновка поверх той же логики.
   Язык Android 16 / Pixel 2025, а не Gmail: фото в фирменных формах (печенье, клевер, арка), крупная выразительная типографика,
   плавающая панель навигации (на десктопе — вертикальная слева, на телефоне — снизу) и отдельный FAB «Продать».
   Все фото квадратные — ничего не растягивается и не режется в полоски. Остальные экраны берут разметку A и перекрашены в theme-google.css. */
(function () {
  const U = () => window.UI;
  const on = () => document.documentElement.dataset.theme === "google";
  const unread = () => (window.CHATS ? window.CHATS.unread() : 0);
  const ic = (n, cls = "") => `<span class="msi ${cls}" aria-hidden="true">${n}</span>`;
  const EX = ["айфон 13 про до 60 тысяч рядом с доставкой", "диван до 30 тысяч срочно", "шкода октавия до 2.5 млн в москве"];
  const CAT_IC = { electronics: "devices", transport: "directions_car", realty: "home_work", home: "chair", fashion: "checkroom", hobby: "sports_esports", kids: "child_care", services: "handyman", jobs: "work", pets: "pets" };
  const SHAPES = ["cookie9", "clover", "arch", "sunny", "flower", "circle", "cookie6", "burst", "arch", "clover"];
  const DEST = [["home", "home", "Главная"], ["search", "search", "Поиск"], ["favorites", "favorite", "Избранное"], ["chats", "chat", "Чаты"], ["profile", "person", "Профиль"]];

  const searchbar = (q, parse, typer, xl) => `
    <form class="m-searchbar ${xl ? "m-searchbar-xl" : ""}" data-search>${ic("search")}
      <input name="q" ${parse ? 'data-parse="#m-tokens"' : ""} ${typer ? `data-typer="${U().esc(EX.join("|"))}"` : ""} value="${U().esc(q)}" placeholder="Поиск объявлений" autocomplete="off" aria-label="Поиск" />
      <button type="button" class="m-icbtn" data-toast="Голосовой поиск появится в следующей версии" aria-label="Голосовой поиск">${ic("mic")}</button>
      ${xl ? `<button type="submit" class="m-go" aria-label="Найти">${ic("arrow_forward")}</button>` : ""}
    </form>`;

  /* ---------- оболочка ---------- */
  function top() {
    const s = U().screen; const bigSearch = s === "home" || s === "search";
    return `<div class="m-shell" data-parse-wrap>
      <div class="m-body">
        <header class="m-top">
          <a class="m-brand" href="${U().href("home")}"><span class="m-brand-mark m-s-cookie9"></span>RUBERI</a>
          ${bigSearch ? '<span class="m-top-fill"></span>' : searchbar("", false, false, false)}
          <button type="button" class="m-chip m-chip-geo" data-geo-open>${ic("location_on")}<span data-geo-label></span></button>
          <a class="m-avatar" href="${U().href("profile")}" aria-label="Профиль">К</a>
        </header>`;
  }

  /* плавающая панель + FAB; закрывает .m-body и .m-shell */
  function dock() {
    const s = U().screen; const cur = (k) => (s === k ? 'aria-current="page"' : "");
    const p = s === "product" ? DB.byId(U().params.get("id")) || DB.byId("ip1") : null;
    const dest = (k, i, n) => `<a class="m-dest m-dest-${k}" href="${U().href(k)}" ${cur(k)} title="${n}"><span class="m-ind">${ic(i)}${k === "chats" && unread() ? `<sup>${unread()}</sup>` : ""}</span><span class="m-dest-l">${n}</span></a>`;
    return `<div class="m-dockzone ${p ? "m-dockzone-pdp" : ""} ${s === "chats" ? "m-dockzone-chats" : ""}">
        <a class="m-fab" href="${U().href("sell")}" ${cur("sell")}>${ic("photo_camera")}<span>Продать</span></a>
        ${p ? `<a class="m-fab m-fab-chat" href="${U().href("chats", { to: p.id })}">${ic("chat")}<span>Написать</span></a>` : ""}
        <nav class="m-ftb" aria-label="Разделы">${DEST.map(([k, i, n]) => dest(k, i, n)).join("")}</nav>
      </div>
      </div></div>`;
  }

  const card = (p) => `
    <a class="m-card" href="${U().href("product", { id: p.id })}" data-price="${p.price}" data-km="${p.km}">
      <div class="m-card-media">${U().photo(p)}<button type="button" class="m-fav" data-fav="${p.id}" aria-label="В избранное">${ic("favorite")}</button>${p.fair === "low" ? `<span class="m-badge">${ic("trending_down")}Ниже рынка</span>` : ""}</div>
      <div class="m-card-body"><strong>${U().fmtShort(p.price)}</strong><h3>${p.title}</h3><p>${U().walk(p.km)} · ${p.place}</p></div>
    </a>`;

  const understood = () => `<div class="m-understood"><span>Понимаю так</span><div class="a-tokens" id="m-tokens"></div></div>`;

  /* ---------- главная ---------- */
  function home() {
    const link = (x) => (x.schema ? U().href("category", { c: x.schema }) : x.id === "electronics" ? U().href("category") : U().href("search", { q: x.name }));
    const fresh = ["chair1", "ps5", "mac1", "ip1", "sneaker", "bike", "guitar", "canon1", "skoda1", "flat1", "sofa", "sony"].map(DB.byId).filter(Boolean);
    const col = [["ip1", "sunny", "a"], ["chair1", "arch", "b"], ["bike", "clover", "c"], ["sneaker", "circle", "d"]].map(([id, sh, pos]) => [DB.byId(id), sh, pos]).filter(([p]) => p);
    return `${top()}
      <main class="m-pane">
        <section class="m-hero">
          <div class="m-hero-l">
            <span class="m-overline">${ic("auto_awesome")}Пишите как человеку — поймём</span>
            <h1>Найдётся <em>всё.</em><br />И рядом.</h1>
            ${searchbar("", true, true, true)}
            ${understood()}
            <div class="m-assists">${EX.slice(1).concat("новый макбук эйр 256 гб от 50к").map((q) => `<button type="button" class="m-chip m-chip-sugg" data-fill="${U().esc(q)}">${q}</button>`).join("")}</div>
          </div>
          <div class="m-collage">
            ${col.map(([p, sh, pos]) => `<a class="m-shape m-s-${sh} m-pos-${pos}" href="${U().href("product", { id: p.id })}" aria-label="${U().esc(p.title)} · ${U().fmtShort(p.price)}">${U().photo(p)}</a>`).join("")}
            <span class="m-sticker m-s-burst"><b>−14%</b><small>ниже рынка</small></span>
          </div>
        </section>

        <section class="m-sec">
          <div class="m-cats">${DB.categories.map((c, i) => `<a class="m-cat" href="${link(c)}"><span class="m-cat-ic m-s-${SHAPES[i % SHAPES.length]} m-tone-${i % 6}">${ic(CAT_IC[c.id] || "category")}</span><b>${c.name}</b><small>${U().countShort(c.count)}</small></a>`).join("")}</div>
        </section>

        <section class="m-sec">
          <div class="m-sec-head"><h2>Рядом с вами</h2><button type="button" class="m-chip" data-geo-open>${ic("near_me")}Хамовники · до 3 км</button></div>
          <div class="m-grid">${fresh.slice(0, 8).map(card).join("")}</div>
        </section>

        <section class="m-promo">
          <span class="m-promo-shape m-s-cookie6">${ic("photo_camera")}</span>
          <div><h2>Продать — это одно фото</h2><p>Снимите вещь, а название, категорию, характеристики и цену мы заполним сами. Останется проверить.</p></div>
          <div class="m-promo-act"><a class="m-filled m-btn-l" href="${U().href("sell")}">${ic("add_a_photo")}Продать вещь</a><a class="m-textbtn" href="${U().href("sell", { kind: "car", demo: 1 })}">Посмотреть на примере</a></div>
        </section>

        <section class="m-sec">
          <div class="m-sec-head"><h2>Свежее</h2></div>
          <div class="m-grid">${fresh.slice(8).map(card).join("")}</div>
        </section>
      </main>${dock()}`;
  }

  /* ---------- поиск ---------- */
  function search(ctx, base) {
    const { list, what } = U().find(ctx.q); const n = list.length;
    if (!n) return base(ctx);
    const prices = list.map((p) => p.price); const min = Math.min(...prices), max = Math.max(...prices);
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / n / 100) * 100;
    const best = list.reduce((a, b) => (a.price <= b.price ? a : b));
    const pos = (v) => (max === min ? 50 : 3 + ((v - min) / (max - min)) * 94);
    const schemaKey = list.every((p) => p.cat === "cars") ? "cars" : list.every((p) => p.cat === "flats") ? "flats" : "phones";
    const plural = (k) => (k % 10 === 1 && k % 100 !== 11 ? "объявление" : [2, 3, 4].includes(k % 10) && ![12, 13, 14].includes(k % 100) ? "объявления" : "объявлений");
    const watched = U().state.get("searches", window.SEARCHES0 || []); const saved = watched.some((x) => x.q === ctx.q);
    if (saved && watched.find((x) => x.q === ctx.q).fresh) { watched.find((x) => x.q === ctx.q).fresh = 0; U().state.set("searches", watched); }
    return `${top()}
      <main class="m-pane" data-schema="${schemaKey}">
        <section class="m-shead">
          ${searchbar(ctx.q, true, false, true)}
          ${understood()}
        </section>
        <div class="m-chiprow">${window.V.a._.pills(DB.schemas[schemaKey])}
          <div class="a-toolbar-r"><button type="button" class="a-save ${saved ? "on" : ""}" data-save-search="${U().esc(ctx.q)}">${saved ? "Сообщим о новых" : "Сообщать о новых"}</button>
          <div class="a-sort" data-pop><button type="button"><span>Сначала</span><b data-pop-val>подходящие</b></button><div class="a-pop a-pop-r" data-pop-body>${["подходящие", "дешевле", "новые", "ближе"].map((o) => `<button type="button" data-pop-opt data-sort="${o}">${o}</button>`).join("")}</div></div></div>
        </div>

        <section class="m-insight">
          <div class="m-insight-num"><small>${U().esc(what || "По запросу")} · в среднем</small><strong>${U().fmtShort(avg)}</strong><span>${n} ${plural(n)} · каждое — точка на шкале</span></div>
          <div class="m-range"><div class="m-range-track">${list.map((p) => `<a href="${U().href("product", { id: p.id })}" style="left:${pos(p.price)}%" class="${p === best ? "best" : ""}" title="${U().esc(p.title)} · ${U().fmtShort(p.price)}"></a>`).join("")}</div>
            <div class="m-range-legend"><span>${U().fmtShort(min)}</span><span>${U().fmtShort(max)}</span></div></div>
          <a class="m-insight-best" href="${U().href("product", { id: best.id })}"><span class="m-best-ph m-s-clover">${U().photo(best)}</span><span><small>Самое выгодное</small><b>${U().fmtShort(best.price)}</b>${best.title}</span>${ic("chevron_right")}</a>
        </section>

        <div class="m-grid" data-results>${list.map((p, i) => card(p).replace('<a class="m-card"', `<a class="m-card" data-i="${i}"${i >= 8 ? " hidden" : ""}`)).join("")}</div>
        ${n > 8 ? `<button type="button" class="m-tonal m-more" data-more>Показать ещё ${n - 8}</button>` : ""}
      </main>${dock()}`;
  }

  /* ---------- объявление ---------- */
  function product(ctx) {
    const p = ctx.product, s = U().seller(p), f = U().fair(p), sp = U().specs(p);
    const shots = [p].concat(DB.products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 3));
    return `${top()}
      <main class="m-pane m-pdp">
        <nav class="m-crumbs"><a class="m-icbtn m-icbtn-tonal" href="${U().href("search")}" data-back aria-label="Назад">${ic("arrow_back")}</a><span>${p.place} · ${p.when}</span>
          <button type="button" class="m-icbtn m-icbtn-tonal" data-toast="Ссылка скопирована" aria-label="Поделиться">${ic("share")}</button>
          <button type="button" class="m-icbtn m-icbtn-tonal m-fav-top" data-fav="${p.id}" aria-label="В избранное">${ic("favorite")}</button></nav>

        <div class="m-pdp-grid">
          <section class="m-gallery">
            <div class="m-gal-main">${U().photo(p, "").replace('class="ph "', 'class="ph" data-main-photo')}</div>
            <div class="m-gal-thumbs">${shots.map((t, i) => `<button type="button" data-thumb class="m-thumb ${i ? "" : "on"}" aria-label="Фото ${i + 1}"><span class="m-s-cookie9">${U().photo(t)}</span></button>`).join("")}</div>
          </section>

          <aside class="m-support">
            <h1>${p.title}</h1>
            ${p.sub ? `<p class="m-sub">${p.sub}</p>` : ""}
            <div class="m-pricerow"><strong>${U().fmt(p.price)}</strong>${p.fair === "low" ? `<span class="m-badge m-badge-inline">${ic("trending_down")}Ниже рынка</span>` : ""}</div>
            <div class="m-actions">
              <a class="m-filled m-btn-l" href="${U().href("chats", { to: p.id })}">${ic("chat")}Написать ${s.dat}</a>
              <div class="m-btngroup">
                ${p.delivery ? `<a class="m-tonal" href="${U().href("checkout", { id: p.id })}">${ic("local_shipping")}С доставкой</a>` : ""}
                <button type="button" class="m-tonal m-tonal-2" data-phone>${ic("call")}Телефон</button>
              </div>
            </div>
            <a class="m-seller" href="${U().href("seller", { id: s.id })}"><span class="m-avatar m-avatar-lg m-s-cookie6">${s.ini}</span><span><b>${s.name}${p.verified ? ` ${ic("verified", "m-verified")}` : ""}</b><small>★ ${s.rate} · ${s.deals} сделок · отвечает ${s.reply}</small></span>${ic("chevron_right")}</a>
            <ul class="m-facts">
              <li><span class="m-fact-ic">${ic("location_on")}</span><span><small>Где</small>${p.place} · ${U().walk(p.km)}</span></li>
              <li><span class="m-fact-ic">${ic("inventory_2")}</span><span><small>Состояние</small>${p.cond}</span></li>
              <li><span class="m-fact-ic">${ic("verified_user")}</span><span><small>Сделка</small>${p.delivery ? "Оплата под защитой" : "Личная встреча"}</span></li>
            </ul>
          </aside>

          <article class="m-details">
            <section class="m-fairbox">
              <div class="m-fair-top"><span><small>Похожие продают за</small><b>${U().fmtShort(f.from)} – ${U().fmtShort(f.to)}</b></span><span class="m-fair-label">${f.label}</span></div>
              <div class="a-fair"><div class="a-fair-bar"><i style="left:${f.pos}%"></i></div><div class="a-fair-legend"><span>${U().fmtShort(f.from)}</span><b>${f.label}</b><span>${U().fmtShort(f.to)}</span></div></div>
            </section>
            <div class="m-assists"><span class="m-label">Спросить в один тап</span>${["Ещё продаёте?", "Можно сегодня?", "Торг уместен?"].map((t) => `<a class="m-chip m-chip-sugg" href="${U().href("chats", { to: p.id, msg: t })}">${t}</a>`).join("")}</div>
            <h2 class="m-h2">Описание</h2>
            <p class="m-text">${U().describe(p)}</p>
            <h2 class="m-h2">Характеристики</h2>
            <dl class="m-list">${sp.top.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}${(sp.more || []).map(([k, v]) => `<div hidden data-spec-more><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
            ${(sp.more || []).length ? `<button type="button" class="m-textbtn" data-specs-more data-less="Свернуть">${ic("expand_more")}Ещё ${sp.more.length} характеристик</button>` : ""}
          </article>
        </div>

        <section class="m-sec"><div class="m-sec-head"><h2>Похожие</h2></div><div class="m-grid">${U().related(p, 8).map(card).join("")}</div></section>
      </main>${dock()}`;
  }

  window.MATERIAL = { on, top, dock, card };
  const A = window.V.a; const base = { home: A.home, search: A.search, product: A.product };
  A.home = (ctx) => (on() ? home(ctx) : base.home(ctx));
  A.search = (ctx) => (on() ? search(ctx, base.search) : base.search(ctx));
  A.product = (ctx) => (on() ? product(ctx) : base.product(ctx));
})();
