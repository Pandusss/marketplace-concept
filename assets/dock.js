/* Дизайн «Док» — не тема, а другая компоновка.
   Идея: продукт — это одна строка, поэтому она живёт не в шапке, а в плавающем доке внизу экрана,
   под большим пальцем. Док заменяет шапку с поиском и таббар и всегда держит главное действие экрана:
   на главной и в поиске — строку с чипами «Понимаю так», на объявлении — цену и «Написать».
   Главная — бенто-плитки и лента-мозаика; поиск — список + превью справа; объявление — фото-мозаика и колонка для чтения.
   Остальные экраны берут разметку из concept-a.js / screens.js и просто живут в новой оболочке. */
(function () {
  const U = () => window.UI;
  const on = () => document.documentElement.dataset.theme === "dock";
  const unread = () => (window.CHATS ? window.CHATS.unread() : 0);
  const isFav = (id) => U().state.get("favs", U().FAVS0).includes(id);
  const EXAMPLES = ["айфон 13 про до 60 тысяч рядом с доставкой", "диван до 30 тысяч срочно", "шкода октавия до 2.5 млн в москве"];

  /* ---------- оболочка: тонкая верхняя полоса + док ---------- */
  const top = () => `<div class="d-wrap" data-parse-wrap>
    <header class="d-top">
      <a class="d-logo" href="${U().href("home")}">RUBERI<i>.</i></a>
      <button type="button" class="d-geo" data-geo-open><span data-geo-label></span></button>
      <a class="d-me" href="${U().href("profile")}" aria-label="Профиль" ${U().screen === "profile" ? 'aria-current="page"' : ""}>К</a>
    </header>`;

  function dock() {
    const screen = U().screen; const q = screen === "search" ? (U().params.get("q") || DB.demoQuery) : "";
    const p = screen === "product" ? (DB.byId(U().params.get("id")) || DB.byId("ip1")) : null;
    const s = p && U().seller(p); const f = p && U().fair(p);
    const cur = (name) => (screen === name ? 'aria-current="page"' : "");
    const say = screen === "chats" ? `<div class="d-dock-row d-dock-action">
        <a class="d-ic d-say-back" href="${U().href("chats")}" aria-label="К списку чатов">←</a>
        <form class="d-dock-search" data-dock-say><input placeholder="Сообщение" autocomplete="off" aria-label="Сообщение" /><button type="submit" aria-label="Отправить">→</button></form>
        <button type="button" class="d-ic" data-dock-toggle aria-label="Поиск">⌕</button>
      </div>` : "";
    const action = say || (p ? `<div class="d-dock-row d-dock-action">
        <a class="d-ic" href="${U().href("search")}" data-back aria-label="Назад">←</a>
        <div class="d-dock-price"><strong>${U().fmtShort(p.price)}</strong><small class="d-fair-${f.key}">${f.label}</small></div>
        <button type="button" class="d-ic a-fav ${isFav(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="В избранное">♡</button>
        ${p.delivery ? `<a class="d-dock-btn d-dock-btn2" href="${U().href("checkout", { id: p.id })}">Купить с доставкой</a>` : ""}
        <a class="d-dock-btn" href="${U().href("chats", { to: p.id })}">Написать ${s.dat}</a>
        <button type="button" class="d-ic" data-dock-toggle aria-label="Поиск">⌕</button>
      </div>` : "");
    return `<div class="d-dock ${action ? "has-action" : ""} ${say ? "has-say" : ""} ${screen === "home" || screen === "search" ? "show-tokens" : ""}" data-dock tabindex="-1">
        <div class="d-dock-tokens"><span>Понимаю так</span><div class="a-tokens" id="d-tokens"></div></div>
        ${action}
        <div class="d-dock-row d-dock-search-row">
          <a class="d-ic" href="${U().href("home")}" aria-label="Главная" ${cur("home")}>⌂</a>
          <form class="d-dock-search" data-search><input name="q" data-parse="#d-tokens" ${screen === "home" ? `data-typer="${U().esc(EXAMPLES.join("|"))}"` : ""} value="${U().esc(q)}" placeholder="Что ищете? Например: диван до 30 тысяч рядом" autocomplete="off" aria-label="Поиск" /><button type="submit" aria-label="Найти">→</button></form>
          <nav class="d-dock-nav" aria-label="Разделы">
            <a class="d-ic" href="${U().href("favorites")}" aria-label="Избранное" ${cur("favorites")}>♡</a>
            <a class="d-ic" href="${U().href("chats")}" aria-label="Чаты" ${cur("chats")}>✉${unread() ? `<sup>${unread()}</sup>` : ""}</a>
            <a class="d-dock-sell" href="${U().href("sell")}" ${cur("sell")}><b>+</b><span>Продать</span></a>
            ${action ? `<button type="button" class="d-ic" data-dock-toggle aria-label="Вернуться">×</button>` : ""}
          </nav>
        </div>
      </div>
    </div>`;
  }

  /* ---------- карточка ленты: цена — на фото ---------- */
  const card = (p) => `
    <a class="d-card" href="${U().href("product", { id: p.id })}">
      <div class="d-card-img">${U().photo(p)}<span class="d-price">${U().fmtShort(p.price)}</span><button type="button" class="a-fav d-fav" data-fav="${p.id}" aria-label="В избранное">♡</button></div>
      <h3>${p.title}</h3>
      <p><b>${U().walk(p.km)}</b> · ${p.place}${p.fair === "low" ? ' <em class="a-tag">ниже рынка</em>' : ""}</p>
    </a>`;

  /* ---------- главная ---------- */
  function home() {
    const c = Object.fromEntries(DB.categories.map((x) => [x.id, x]));
    const link = (x) => (x.schema ? U().href("category", { c: x.schema }) : x.id === "electronics" ? U().href("category") : U().href("search", { q: x.name }));
    const tile = (id, cls) => `<a class="d-tile ${cls}" href="${link(c[id])}"><div class="ph" style="background-image:url('${c[id].img}')"></div><span><b>${c[id].name}</b><small>${c[id].hint}</small></span><em>${U().countShort(c[id].count)}</em></a>`;
    const fresh = ["chair1", "skoda1", "ps5", "mac1", "flat1", "ip1", "sneaker", "bike", "guitar", "canon1", "sofa", "sony", "watch1", "plant", "kbd", "golf1", "jacket", "espresso", "flat2", "cam"].map(DB.byId);
    return `${top()}
      <main class="d-main">
        <section class="d-hero">
          <h1>Что ищете<i>?</i></h1>
          <p>Напишите как в мессенджере — цена, район, состояние, доставка сами станут фильтрами. Строка поиска всегда внизу, на любом экране.</p>
          <div class="a-try d-try"><span>Например</span>${EXAMPLES.slice(1).concat("новый макбук эйр 256 гб от 50к").map((q) => `<button type="button" data-fill="${U().esc(q)}">${q}</button>`).join("")}</div>
        </section>

        <section class="d-bento" aria-label="Категории">
          ${tile("transport", "d-tile-xl")}${tile("realty", "d-tile-wide")}${tile("electronics", "")}${tile("home", "")}${tile("fashion", "")}${tile("hobby", "")}
          <div class="d-tile d-tile-wide d-tile-more"><b>Ещё</b><nav>${["kids", "services", "jobs", "pets"].map((id) => `<a href="${link(c[id])}">${c[id].name}<small>${U().countShort(c[id].count)}</small></a>`).join("")}</nav></div>
        </section>

        <section class="d-feed">
          <div class="d-head"><h2>Свежее рядом</h2><button type="button" class="a-block-geo" data-geo-open>Хамовники · до 3 км</button></div>
          <div class="d-grid">${fresh.map(card).join("")}</div>
        </section>
      </main>${dock()}`;
  }

  /* ---------- поиск: список + превью ---------- */
  const row = (p, i) => `
    <a class="d-row ${i ? "" : "on"}" href="${U().href("product", { id: p.id })}" data-row="${p.id}" data-price="${p.price}" data-km="${p.km}" data-i="${i}">
      ${U().photo(p)}
      <span class="d-row-main"><b>${p.title}</b><em>${p.sub || p.cond}</em><small><i>${U().walk(p.km)}</i> · ${p.place} · ${p.when}</small></span>
      <span class="d-row-side"><strong>${U().fmtShort(p.price)}</strong>${p.fair === "low" ? '<em class="a-tag">ниже рынка</em>' : ""}${p.delivery ? "<small>доставка</small>" : ""}</span>
    </a>`;

  function preview(p) {
    const s = U().seller(p), f = U().fair(p);
    const thumbs = [p].concat(DB.products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 3));
    return `<div class="d-prev-gal">${U().photo(p, "").replace('class="ph "', 'class="ph" data-main-photo')}<button type="button" class="a-fav d-fav ${isFav(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="В избранное">♡</button></div>
      <div class="a-thumbs d-prev-thumbs">${thumbs.map((t, i) => `<button type="button" data-thumb class="${i ? "" : "on"}">${U().photo(t)}</button>`).join("")}</div>
      <h2>${p.title}</h2>${p.sub ? `<p class="d-prev-sub">${p.sub}</p>` : ""}
      <div class="d-prev-price"><strong>${U().fmt(p.price)}</strong><div class="a-fair"><div class="a-fair-bar"><i style="left:${f.pos}%"></i></div><div class="a-fair-legend"><span>${U().fmtShort(f.from)}</span><b>${f.label}</b><span>${U().fmtShort(f.to)}</span></div></div></div>
      <div class="d-prev-cta"><a class="a-cta" href="${U().href("chats", { to: p.id })}">Написать ${s.dat}</a>${p.delivery ? `<a class="a-cta2" href="${U().href("checkout", { id: p.id })}">Купить с доставкой</a>` : ""}</div>
      <ul class="d-facts"><li><small>Где</small>${p.place} · ${U().walk(p.km)}</li><li><small>Состояние</small>${p.cond}</li><li><small>Продавец</small><a href="${U().href("seller", { id: s.id })}">${s.name} · ★ ${s.rate}</a></li></ul>
      <p class="d-prev-desc">${U().describe(p)}</p>
      <a class="a-link" href="${U().href("product", { id: p.id })}">Открыть объявление целиком →</a>`;
  }

  function search(ctx, base) {
    const { list, what } = U().find(ctx.q); const n = list.length;
    if (!n) return base(ctx); // пустое состояние — общее
    const avg = Math.round(list.reduce((a, p) => a + p.price, 0) / n / 100) * 100;
    const schemaKey = list.every((p) => p.cat === "cars") ? "cars" : list.every((p) => p.cat === "flats") ? "flats" : "phones";
    const plural = (k) => (k % 10 === 1 && k % 100 !== 11 ? "объявление" : [2, 3, 4].includes(k % 10) && ![12, 13, 14].includes(k % 100) ? "объявления" : "объявлений");
    const watched = U().state.get("searches", window.SEARCHES0 || []); const saved = watched.some((x) => x.q === ctx.q);
    if (saved && watched.find((x) => x.q === ctx.q).fresh) { watched.find((x) => x.q === ctx.q).fresh = 0; U().state.set("searches", watched); }
    return `${top()}
      <main class="d-main" data-schema="${schemaKey}">
        <section class="d-shead">
          <h1>${U().esc(what || "Все объявления")}</h1>
          <p class="d-sum"><b>${n}</b> ${plural(n)} · в среднем <b>${U().fmtShort(avg)}</b> · с доставкой <b>${list.filter((p) => p.delivery).length}</b></p>
        </section>
        <div class="a-toolbar d-toolbar">${window.V.a._.pills(DB.schemas[schemaKey])}
          <div class="a-toolbar-r"><button type="button" class="a-save ${saved ? "on" : ""}" data-save-search="${U().esc(ctx.q)}">${saved ? "Сообщим о новых" : "Сообщать о новых"}</button>
          <div class="a-sort" data-pop><button type="button"><span>Сначала</span><b data-pop-val>подходящие</b></button><div class="a-pop a-pop-r" data-pop-body>${["подходящие", "дешевле", "новые", "ближе"].map((o) => `<button type="button" data-pop-opt data-sort="${o}">${o}</button>`).join("")}</div></div></div>
        </div>
        <div class="d-split">
          <div class="d-list" data-results>${list.map(row).join("")}</div>
          <aside class="d-preview" data-preview aria-live="polite">${preview(list[0])}</aside>
        </div>
      </main>${dock()}`;
  }

  /* ---------- объявление ---------- */
  function product(ctx) {
    const p = ctx.product, s = U().seller(p), f = U().fair(p), sp = U().specs(p);
    const shots = [p].concat(DB.products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 3));
    return `${top()}
      <main class="d-main d-pdp">
        <section class="d-mosaic d-mosaic-${shots.length}">
          <div class="d-mosaic-main">${U().photo(p, "").replace('class="ph "', 'class="ph" data-main-photo')}</div>
          ${shots.slice(1).map((t) => `<button type="button" data-thumb>${U().photo(t)}</button>`).join("")}
          <span class="d-mosaic-n">${shots.length} фото</span>
        </section>

        <article class="d-read">
          <p class="d-kicker">№ 482 103 · ${p.when} · ${p.place}</p>
          <h1>${p.title}</h1>
          ${p.sub ? `<p class="d-lede">${p.sub}</p>` : ""}

          <div class="d-tiles">
            <div class="d-t d-t-price"><small>Цена</small><strong>${U().fmt(p.price)}</strong><div class="a-fair"><div class="a-fair-bar"><i style="left:${f.pos}%"></i></div><div class="a-fair-legend"><span>${U().fmtShort(f.from)}</span><b>${f.label}</b><span>${U().fmtShort(f.to)}</span></div></div></div>
            <div class="d-t"><small>Где</small><b>${p.place}</b><span>${U().walk(p.km)} от вас</span></div>
            <div class="d-t"><small>Состояние</small><b>${p.cond}</b><span>${p.delivery ? "можно с доставкой" : "только встреча"}</span></div>
            <a class="d-t d-t-seller" href="${U().href("seller", { id: s.id })}"><small>Продавец</small><b>${s.name}${p.verified ? ' <i class="a-tag">проверен</i>' : ""}</b><span>★ ${s.rate} · ${s.deals} сделок · отвечает ${s.reply}</span></a>
          </div>

          <div class="a-quick d-quick"><span>Спросить в один тап</span>${["Ещё продаёте?", "Можно сегодня?", "Торг уместен?"].map((t) => `<a href="${U().href("chats", { to: p.id, msg: t })}">${t}</a>`).join("")}<button type="button" class="a-phone" data-phone>Показать телефон</button></div>

          <h2>Описание</h2>
          <p class="d-text">${U().describe(p)}</p>

          <h2>Характеристики</h2>
          <dl class="a-specs d-specs">${sp.top.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}${(sp.more || []).map(([k, v]) => `<div hidden data-spec-more><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
          <button type="button" class="a-link" data-specs-more data-less="Свернуть">Ещё ${(sp.more || []).length} характеристик</button>
        </article>

        <section class="d-feed"><div class="d-head"><h2>Похожие</h2></div><div class="d-grid">${U().related(p, 10).map(card).join("")}</div></section>
      </main>${dock()}`;
  }

  /* ---------- подключение: тем же экранам — другая оболочка и три своих компоновки ---------- */
  window.DOCK = { on, top, dock, card };
  const A = window.V.a; const base = { home: A.home, search: A.search, product: A.product, init: A.init };
  A.home = (ctx) => (on() ? home(ctx) : base.home(ctx));
  A.search = (ctx) => (on() ? search(ctx, base.search) : base.search(ctx));
  A.product = (ctx) => (on() ? product(ctx) : base.product(ctx));
  A.init = (screen, ctx) => { base.init(screen, ctx); if (on()) document.body.classList.toggle("d-thread", screen === "chats"); else document.body.classList.remove("d-thread"); };

  // строка сообщения в доке — прокси к форме переписки (логика чата остаётся в screens.js)
  document.addEventListener("submit", (e) => {
    const f = e.target.closest("[data-dock-say]"); if (!f) return; e.preventDefault();
    const src = f.querySelector("input"), form = document.querySelector("[data-say-form]"); if (!form || !src.value.trim()) return;
    form.querySelector("input").value = src.value; src.value = ""; form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  });

  const wide = matchMedia("(min-width: 1100px)");
  document.addEventListener("click", (e) => {
    if (!on()) return;
    const tg = e.target.closest("[data-dock-toggle]"); if (tg) { const d = document.querySelector("[data-dock]"); const toSearch = d.classList.toggle("search-mode"); if (toSearch) d.querySelector(".d-dock-search-row input").focus(); return; }
    const r = e.target.closest("[data-row]");
    if (r && wide.matches && !e.target.closest("[data-fav]")) {
      e.preventDefault(); document.querySelectorAll("[data-row]").forEach((x) => x.classList.toggle("on", x === r));
      const pane = document.querySelector("[data-preview]"); pane.innerHTML = preview(DB.byId(r.dataset.row)); pane.scrollTop = 0; return;
    }
    // в поиске чипы применяются сразу: убрали условие или добавили готовое — выдача обновилась
    if (U().screen === "search") {
      const chip = e.target.closest("[data-tok-x], [data-append]");
      if (chip && !(chip.dataset.append || "").endsWith(" ")) setTimeout(() => { const q = document.querySelector("[data-dock] input").value.trim(); location.href = U().href("search", q ? { q } : {}); }, 60);
    }
  });
})();
