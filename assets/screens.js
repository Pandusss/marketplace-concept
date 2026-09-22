/* Остальные экраны RUBERI: избранное, чаты, профиль, продавец, оформление с доставкой,
   плюс общие модальные окна (город и радиус, выбор значения). Стиль и блоки — те же, что в concept-a.js. */
(function () {
  const U = () => window.UI;
  const A = () => window.V.a._;
  const S = (k, d) => U().state.get(k, d);
  const now = () => new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  /* ---------- стартовые данные ---------- */
  window.SEARCHES0 = [
    { q: "айфон 13 про до 60 тысяч рядом", fresh: 2, notify: true },
    { q: "шкода октавия до 2.5 млн в москве", fresh: 1, notify: false },
  ];
  const CHATS0 = [
    { id: "c1", pid: "ip1", unread: 1, msgs: [{ me: 1, t: "Здравствуйте! Ещё продаёте?", at: "12:04" }, { me: 0, t: "Да, продаю. Могу показать сегодня после 18:00 у метро Спортивная.", at: "12:11" }] },
    { id: "c2", pid: "chair1", unread: 0, msgs: [{ me: 1, t: "Добрый день, кресло ещё актуально?", at: "вчера" }, { me: 0, t: "Да, забирать из Хамовников. Помогу вынести.", at: "вчера" }, { me: 1, t: "Отлично, напишу в субботу утром.", at: "вчера" }] },
    { id: "c3", pid: "guitar", mine: true, who: { name: "Олег Д.", ini: "ОД" }, unread: 1, msgs: [{ me: 0, t: "Добрый день! Торг уместен? Заберу сегодня.", at: "10:40" }] },
  ];
  const chats = () => S("chats", CHATS0);
  window.CHATS = { unread: () => chats().reduce((n, c) => n + (c.unread || 0), 0) };
  const ME = { name: "Константин", ini: "К", rate: "4,9", deals: 14, since: 2022 };
  const MY = { active: [["guitar", 412, 9, 12], ["kbd", 96, 3, 2], ["sneaker", 58, 1, 1]], sold: [["watch2", "12 сентября"], ["canon3", "30 августа"]] };

  const peer = (c) => (c.mine ? c.who : U().seller(DB.byId(c.pid)));
  const REPLIES = [[/торг|скидк|дешевле/i, "Немного уступлю при встрече, если всё устроит."], [/сегодня|когда|завтра/i, "Сегодня после 18:00 удобно. Подойдёт?"], [/ещё прода|актуальн/i, "Да, ещё продаю."], [/где|адрес|встрет/i, "Удобнее всего у метро, точное место напишу ближе ко времени."], [/достав/i, "Да, могу отправить доставкой — оформляйте прямо здесь, через безопасную сделку."]];
  const replyTo = (t) => (REPLIES.find(([re]) => re.test(t)) || [0, "Хорошо, договорились. Пишите, если будут вопросы."])[1];

  /* =========================== ИЗБРАННОЕ =========================== */
  function favorites(ctx) {
    const tab = ctx.params.get("tab") === "searches" ? "searches" : "items";
    const favs = S("favs", U().FAVS0).map(DB.byId).filter(Boolean);
    const searches = S("searches", window.SEARCHES0);
    const chips = (q) => U().parse(q).map((t) => `<span class="tok tok-${t.type}">${U().esc(t.label)}</span>`).join("");
    return `${A().header()}
    <main class="a-main">
      <section class="a-page-head"><h1>Избранное</h1>
        <div class="a-kind" role="tablist"><a href="${U().href("favorites")}" role="tab" aria-selected="${tab === "items"}">Объявления <small>${favs.length}</small></a><a href="${U().href("favorites", { tab: "searches" })}" role="tab" aria-selected="${tab === "searches"}">Слежу за поиском <small>${searches.length}</small></a></div>
      </section>
      ${tab === "items" ? (favs.length ? `<div class="a-grid a-grid-5" data-favs-grid>${favs.map(A().card).join("")}</div>` : empty("Здесь будут объявления, к которым хочется вернуться", "Нажмите ♡ на любой карточке — и она появится тут. Если цена снизится, мы подскажем.", "Смотреть объявления", U().href("home")))
        : `<p class="a-watch-about">Сохраните поиск — и мы будем следить за ним вместо вас: как только появится подходящее объявление, пришлём уведомление. Заходить и проверять самому не нужно.</p>` + (searches.length ? `<ul class="a-watches">${searches.map((s, i) => {
          const found = U().find(s.q).list; const fresh = Math.min(s.fresh || 0, found.length); const link = U().href("search", { q: s.q });
          return `<li class="a-watch" data-search-row="${i}">
            <a class="a-watch-main" href="${link}">
              <div class="a-tokens">${chips(s.q)}</div>
              <p>${fresh ? `<b class="a-tag">${fresh} ${fresh === 1 ? "новое" : "новых"}</b> с вашего прошлого визита · всего в продаже ${found.length}` : found.length ? `Новых пока нет · сейчас в продаже ${found.length}` : "Пока ничего нет — сообщим о первом же объявлении"}</p>
            </a>
            <a class="a-watch-thumbs" href="${link}" aria-label="Открыть результаты">${found.slice(0, 4).map((p, k) => `<span class="${k < fresh ? "new" : ""}">${U().photo(p)}</span>`).join("")}</a>
            <div class="a-watch-side">
              <a class="${fresh ? "a-cta" : "a-cta2"} a-cta-auto" href="${link}">${fresh ? `Смотреть ${fresh} ${fresh === 1 ? "новое" : "новых"}` : "Открыть поиск"}</a>
              <label class="a-switch"><input type="checkbox" ${s.notify ? "checked" : ""} data-search-notify="${i}" /><i></i><span data-notify-label>${s.notify ? "Уведомления включены" : "Уведомления выключены"}</span></label>
              <button type="button" class="a-watch-del" data-search-del="${i}">Перестать следить</button>
            </div>
          </li>`; }).join("")}</ul>` : `<section class="a-empty a-empty-sm"><h1>Пока ни за чем не следим</h1>
            <ol class="a-how"><li><b>Найдите, что нужно</b>Например, «диван до 30 тысяч рядом».</li><li><b>Нажмите «Сообщать о новых»</b>Кнопка — над результатами поиска.</li><li><b>Получите уведомление</b>Как только появится подходящее объявление.</li></ol>
            <div class="a-empty-actions"><a class="a-cta" href="${U().href("search")}">Перейти к поиску</a></div></section>`)}
    </main>${A().footer()}`;
  }
  const empty = (h, p, cta, href) => `<section class="a-empty a-empty-sm"><h1>${h}</h1><p>${p}</p><div class="a-empty-actions"><a class="a-cta" href="${href}">${cta}</a></div></section>`;

  /* =========================== ЧАТЫ =========================== */
  function ensureChat(pid) {
    const list = chats(); let c = list.find((x) => x.pid === pid && !x.mine);
    if (!c) { c = { id: `c${Date.now()}`, pid, unread: 0, msgs: [] }; list.unshift(c); U().state.set("chats", list); }
    return c.id;
  }
  function chatsScreen(ctx) {
    // переход из объявления: ?to=<id объявления>&msg=<быстрый вопрос>
    const to = ctx.params.get("to"); let openId = ctx.params.get("t");
    if (to && DB.byId(to)) {
      openId = ensureChat(to); const msg = ctx.params.get("msg");
      if (msg) { const list = chats(); const c = list.find((x) => x.id === openId); c.msgs.push({ me: 1, t: msg, at: now() }); c.pending = msg; U().state.set("chats", list); }
      const q = new URLSearchParams(location.search); q.delete("to"); q.delete("msg"); q.set("t", openId); history.replaceState(null, "", `?${q}`);
    }
    const list = chats(); const explicit = !!openId; const cur = list.find((c) => c.id === openId) || list[0];
    const row = (c) => { const p = DB.byId(c.pid), who = peer(c), last = c.msgs[c.msgs.length - 1]; return `
      <a class="a-chatrow ${cur && c.id === cur.id ? "on" : ""}" href="${U().href("chats", { t: c.id })}">
        ${U().photo(p)}<span><b>${who.name}${c.mine ? " <i>покупатель</i>" : ""}</b><em>${p.title}</em><small>${last ? (last.me ? "Вы: " : "") + U().esc(last.t) : "Напишите первым"}</small></span>
        <time>${last ? last.at : ""}${c.unread ? `<sup>${c.unread}</sup>` : ""}</time></a>`; };
    return `${A().header()}
    <main class="a-main a-chatpage ${explicit ? "a-thread-open" : ""}">
      <aside class="a-chatlist"><h1>Чаты</h1>${list.length ? list.map(row).join("") : `<p class="a-muted">Пока нет переписок. Напишите продавцу из любого объявления.</p>`}</aside>
      ${cur ? thread(cur) : ""}
    </main>${A().footer()}`;
  }
  function thread(c) {
    const p = DB.byId(c.pid), who = peer(c);
    const quick = c.mine ? ["Да, ещё продаю", "Могу показать сегодня", "Торг небольшой"] : ["Можно сегодня?", "Торг уместен?", "Где встретимся?"];
    return `<section class="a-thread" data-thread="${c.id}">
      <header class="a-thread-head">
        <a class="a-back" href="${U().href("chats")}" aria-label="К списку чатов">←</a>
        <a class="a-thread-item" href="${U().href("product", { id: p.id })}">${U().photo(p)}<span><b>${p.title}</b><small>${U().fmt(p.price)} · ${c.mine ? "ваше объявление" : p.place}</small></span></a>
        ${c.mine ? `<div class="a-thread-who"><span class="a-ava">${who.ini}</span><span><b>${who.name}</b><small>покупатель · 6 сделок</small></span></div>` : `<a class="a-thread-who" href="${U().href("seller", { id: who.id })}"><span class="a-ava">${who.ini}</span><span><b>${who.name}</b><small>отвечает ${who.reply}</small></span></a>`}
      </header>
      <p class="a-thread-safe">Не переводите предоплату в обход RUBERI: деньги защищены, только когда оплата проходит здесь.${!c.mine && p.delivery ? ` <a href="${U().href("checkout", { id: p.id })}">Купить с доставкой →</a>` : ""}</p>
      <div class="a-msgs" data-msgs>${c.msgs.map(bubble).join("") || `<p class="a-muted a-msgs-empty">Начните с короткого вопроса — кнопки ниже отправляют его в один тап.</p>`}</div>
      <div class="a-thread-quick">${quick.map((t) => `<button type="button" data-say="${U().esc(t)}">${t}</button>`).join("")}</div>
      <form class="a-say" data-say-form><input placeholder="Сообщение" autocomplete="off" aria-label="Сообщение" /><button type="submit" aria-label="Отправить">→</button></form>
    </section>`;
  }
  const bubble = (m) => `<div class="a-msg ${m.me ? "me" : ""}"><p>${U().esc(m.t)}</p><time>${m.at}</time></div>`;

  function initChats() {
    const box = document.querySelector("[data-thread]"); if (!box) return;
    const id = box.dataset.thread; const msgs = box.querySelector("[data-msgs]");
    const save = (fn) => { const list = chats(); const c = list.find((x) => x.id === id); fn(c); U().state.set("chats", list); };
    const scroll = () => { msgs.scrollTop = msgs.scrollHeight; };
    const answer = (text) => {
      const typing = document.createElement("div"); typing.className = "a-msg a-typing"; typing.innerHTML = "<p><i></i><i></i><i></i></p>";
      setTimeout(() => { msgs.append(typing); scroll(); }, 500);
      setTimeout(() => { typing.remove(); const m = { me: 0, t: replyTo(text), at: now() }; save((c) => { c.msgs.push(m); delete c.pending; }); msgs.insertAdjacentHTML("beforeend", bubble(m)); scroll(); }, 1900);
    };
    const say = (text) => {
      if (!text.trim()) return; const m = { me: 1, t: text.trim(), at: now() };
      save((c) => c.msgs.push(m)); msgs.querySelector(".a-msgs-empty")?.remove(); msgs.insertAdjacentHTML("beforeend", bubble(m)); scroll();
      if (!chats().find((x) => x.id === id).mine) answer(text);
    };
    box.querySelector("[data-say-form]").addEventListener("submit", (e) => { e.preventDefault(); const i = e.target.querySelector("input"); say(i.value); i.value = ""; });
    box.querySelectorAll("[data-say]").forEach((b) => b.addEventListener("click", () => say(b.dataset.say)));
    // открыли переписку — она прочитана; сообщение, пришедшее из объявления, ждёт ответа
    const cur = chats().find((x) => x.id === id);
    if (cur.unread) {
      save((c) => { c.unread = 0; }); document.querySelector(".a-chatrow.on sup")?.remove();
      const left = window.CHATS.unread(); document.querySelectorAll(".a-head-nav sup, .a-tabbar sup").forEach((s) => { if (left) s.textContent = left; else s.remove(); });
    }
    if (cur.pending) answer(cur.pending);
    scroll();
  }

  /* =========================== ПРОФИЛЬ =========================== */
  function profile(ctx) {
    const tab = ["drafts", "sold"].includes(ctx.params.get("tab")) ? ctx.params.get("tab") : "active";
    const drafts = S("drafts", [{ title: "Кофемашина рожковая", price: "27 000" }]);
    const verified = S("verified", false);
    const item = ([id, views, favs, days]) => { const p = DB.byId(id); const slow = days >= 10; return `
      <li class="a-row a-myitem" data-my="${id}">
        <a class="a-myitem-ph" href="${U().href("product", { id })}">${U().photo(p)}</a>
        <a class="a-row-main" href="${U().href("product", { id })}"><b>${p.title}</b><strong data-my-price>${U().fmt(p.price)}</strong><small>${views} просмотров · ${favs} в избранном · ${days} дн. в продаже</small></a>
        <div class="a-row-actions"><a href="${U().href("sell", { demo: 1 })}">Изменить</a><button type="button" data-my-off>Снять</button></div>
        ${slow ? `<div class="a-hintrow"><span>${days} дней без новых сообщений. Похожие гитары сейчас продаются около ${U().fmt(21000)}.</span><button type="button" data-my-drop="21000">Снизить до ${U().fmt(21000)}</button></div>` : ""}
      </li>`; };
    return `${A().header()}
    <main class="a-main">
      <section class="a-me-head">
        <span class="a-ava a-ava-lg">${ME.ini}</span>
        <div><h1>${ME.name}</h1><p>★ ${ME.rate} · ${ME.deals} сделок · на RUBERI с ${ME.since} года · <a href="${U().href("seller", { id: "me" })}">как меня видят покупатели</a></p></div>
        <a class="a-cta a-cta-auto" href="${U().href("sell")}">Продать</a>
      </section>

      <div class="a-attr-ask a-verify ${verified ? "done" : ""}" data-verify>
        <small>${verified ? "Личность подтверждена" : "Один шаг до метки «проверен»"}</small>
        <p>${verified ? "Покупатели видят метку «проверен» рядом с вашим именем." : "Подтвердите личность через Госуслуги — покупатели увидят метку «проверен» рядом с вашим именем. Паспортные данные остаются у Госуслуг."}</p>
        ${verified ? "" : `<button type="button" data-verify-go>Подтвердить</button>`}
      </div>

      <section class="a-page-head a-page-head-sm"><h2>Мои объявления</h2>
        <div class="a-kind" role="tablist">${[["active", "Активные", MY.active.length], ["drafts", "Черновики", drafts.length], ["sold", "Проданные", MY.sold.length]].map(([k, n, c]) => `<a href="${U().href("profile", k === "active" ? {} : { tab: k })}" role="tab" aria-selected="${tab === k}">${n} <small>${c}</small></a>`).join("")}</div>
      </section>
      <ul class="a-rows">${tab === "active" ? MY.active.map(item).join("")
        : tab === "drafts" ? (drafts.map((d, i) => `<li class="a-row"><a class="a-row-main" href="${U().href("sell", { demo: 1 })}"><b>${U().esc(d.title)}</b><strong>${U().esc(d.price)} ₽</strong><small>черновик · не опубликован</small></a><div class="a-row-actions"><a href="${U().href("sell", { demo: 1 })}">Продолжить</a><button type="button" data-draft-del="${i}">Удалить</button></div></li>`).join("") || `<li class="a-muted">Черновиков нет.</li>`)
        : MY.sold.map(([id, when]) => { const p = DB.byId(id); return `<li class="a-row a-myitem is-off"><span class="a-myitem-ph">${U().photo(p)}</span><span class="a-row-main"><b>${p.title}</b><strong>${U().fmt(p.price)}</strong><small>продано ${when}</small></span><div class="a-row-actions"><a href="${U().href("sell", { demo: 1 })}">Продать похожее</a></div></li>`; }).join("")}</ul>

      <section class="a-page-head a-page-head-sm"><h2>Настройки</h2></section>
      <ul class="a-rows a-settings">
        <li class="a-row a-row-mode"><span class="a-row-main"><b>Оформление</b><small>тёмная тема — вечером и ночью глазам спокойнее</small><small data-mode-hint hidden>в дизайне «Ночь» тема всегда тёмная</small></span><div class="a-kind a-mode" role="tablist" aria-label="Оформление">${[["light", "Светлая"], ["dark", "Тёмная"], ["auto", "Как в системе"]].map(([k, n]) => `<button type="button" role="tab" data-mode-set="${k}" aria-selected="${U().mode() === k}">${n}</button>`).join("")}</div></li>
        <li class="a-row"><span class="a-row-main"><b>Уведомления о сообщениях</b><small>пуш и почта</small></span><label class="a-switch"><input type="checkbox" checked /><i></i></label></li>
        <li class="a-row"><span class="a-row-main"><b>Снижение цены в избранном</b><small>сообщать, когда сохранённое подешевело</small></span><label class="a-switch"><input type="checkbox" checked /><i></i></label></li>
        <li class="a-row"><button type="button" class="a-row-main" data-pick="Адрес для доставки|Хамовники, пункт выдачи на Усачёва, 29|Курьером: ул. Ефремова, 12|Добавить адрес…"><b>Адрес для доставки</b><small data-pick-val>Хамовники, пункт выдачи на Усачёва, 29</small></button><span class="a-chev">→</span></li>
        <li class="a-row"><button type="button" class="a-row-main" data-pick="Куда получать деньги|Карта •• 4412|СБП по номеру телефона|Добавить карту…"><b>Выплаты за продажи</b><small data-pick-val>Карта •• 4412</small></button><span class="a-chev">→</span></li>
        <li class="a-row"><button type="button" class="a-row-main" data-geo-open><b>Город и радиус поиска</b><small data-geo-label></small></button><span class="a-chev">→</span></li>
      </ul>
    </main>${A().footer()}`;
  }
  function initProfile() {
    document.querySelector("[data-verify-go]")?.addEventListener("click", () => { U().state.set("verified", true); U().toast("Личность подтверждена"); setTimeout(() => location.reload(), 600); });
    document.querySelectorAll("[data-my-off]").forEach((b) => b.addEventListener("click", () => { const li = b.closest("[data-my]"); const off = li.classList.toggle("is-off"); b.textContent = off ? "Вернуть" : "Снять"; U().toast(off ? "Объявление снято с публикации" : "Объявление снова в поиске"); }));
    document.querySelectorAll("[data-my-drop]").forEach((b) => b.addEventListener("click", () => { const li = b.closest("[data-my]"); li.querySelector("[data-my-price]").textContent = U().fmt(Number(b.dataset.myDrop)); b.closest(".a-hintrow").remove(); U().toast("Цена снижена — сообщим тем, у кого объявление в избранном"); }));
    document.querySelectorAll("[data-draft-del]").forEach((b) => b.addEventListener("click", () => { const d = S("drafts", [{ title: "Кофемашина рожковая", price: "27 000" }]); d.splice(Number(b.dataset.draftDel), 1); U().state.set("drafts", d); location.reload(); }));
  }

  /* =========================== ПРОДАВЕЦ =========================== */
  function seller(ctx) {
    const id = ctx.params.get("id"); const isMe = id === "me";
    const s = isMe ? { ...ME, reply: "~15 мин", dat: "мне" } : U().SELLERS.find((x) => x.id === id) || U().SELLERS[0];
    const items = isMe ? MY.active.map(([pid]) => DB.byId(pid)) : DB.products.filter((p) => U().seller(p).id === s.id).slice(0, 10);
    const reviews = [["Ирина", "Всё как в описании, встретились вовремя. Спасибо!", "2 недели назад"], ["Павел", "Товар в отличном состоянии, продавец на связи. Рекомендую.", "месяц назад"], ["Света", "Быстро ответили, дали всё проверить без спешки.", "2 месяца назад"]];
    return `${A().header()}
    <main class="a-main">
      <nav class="a-crumbs"><a href="${U().href("home")}" data-back>← Назад</a></nav>
      <section class="a-me-head">
        <span class="a-ava a-ava-lg">${s.ini}</span>
        <div><h1>${s.name}${isMe ? "" : ' <i class="a-tag">проверен</i>'}</h1><p>★ ${s.rate} · ${s.deals} сделок · на RUBERI с ${s.since} года · обычно отвечает за ${s.reply}</p></div>
        ${isMe ? `<a class="a-cta2 a-cta-auto" href="${U().href("profile")}">Вернуться в профиль</a>` : items[0] ? `<a class="a-cta a-cta-auto" href="${U().href("chats", { to: items[0].id })}">Написать</a>` : ""}
      </section>
      <ul class="a-stats"><li><small>Сделок</small><strong>${s.deals}</strong></li><li><small>Оценка</small><strong>${s.rate}</strong></li><li><small>Споров</small><strong>0</strong></li><li><small>Объявлений</small><strong>${items.length}</strong></li></ul>

      <section class="a-block"><div class="a-block-head"><h2>Объявления продавца</h2><span>${items.length} в продаже</span></div><div class="a-grid a-grid-5">${items.map(A().card).join("")}</div></section>
      <section class="a-block"><div class="a-block-head"><h2>Отзывы</h2><span>только после завершённых сделок</span></div>
        <ul class="a-reviews">${reviews.map(([n, t, w]) => `<li><b>${n} <span>★★★★★</span></b><p>${t}</p><small>${w}</small></li>`).join("")}</ul></section>
    </main>${A().footer()}`;
  }

  /* =========================== ОФОРМЛЕНИЕ =========================== */
  function checkout(ctx) {
    const p = ctx.product; const s = U().seller(p);
    return `${A().header()}
    <main class="a-main">
      <nav class="a-crumbs"><a href="${U().href("product", { id: p.id })}">← К объявлению</a></nav>
      <h1 class="a-checkout-h" data-checkout-h>Покупка с доставкой</h1>
      <div class="a-checkout" data-checkout data-price="${p.price}">
        <form class="a-form" data-pay-form>
          <div class="a-field"><span>Как получить</span><div class="a-options">
            <button type="button" class="on" data-ship="390"><b>Пункт выдачи</b><small>2–3 дня · проверка при получении</small><em>390 ₽</em></button>
            <button type="button" data-ship="590"><b>Курьером до двери</b><small>1–2 дня · проверка при курьере</small><em>590 ₽</em></button>
            <button type="button" data-ship="0"><b>Заберу сам у продавца</b><small>${p.place} · оплата при встрече не защищена</small><em>0 ₽</em></button>
          </div></div>
          <div class="a-field" data-where><span>Куда</span><div class="a-attrs"><button type="button" class="ok" data-pick="Пункт выдачи|Усачёва, 29 — 6 мин пешком|Комсомольский пр-т, 14 — 9 мин пешком|Фрунзенская наб., 30 — 14 мин пешком"><small>Пункт выдачи</small><span data-pick-val>Усачёва, 29 — 6 мин пешком</span></button></div></div>
          <div class="a-field"><span>Чем платить</span><div class="a-options a-options-row" data-single><button type="button" data-toggle class="on"><b>Карта •• 4412</b></button><button type="button" data-toggle><b>СБП</b></button><button type="button" data-toggle><b>Новая карта</b></button></div></div>
          <ol class="a-safe"><li><b>Вы платите</b>Деньги замораживаются на счёте RUBERI — продавец их пока не получает.</li><li><b>Продавец отправляет</b>У него 2 дня. Не отправит — деньги вернутся автоматически.</li><li><b>Вы проверяете</b>Осмотрите вещь при получении. Не то — отказываетесь, деньги возвращаются.</li><li><b>Продавец получает деньги</b>Только после вашего «всё в порядке».</li></ol>
          <button type="submit" class="a-cta">Оплатить <span data-total></span></button>
        </form>
        <aside class="a-order">
          <a class="a-order-item" href="${U().href("product", { id: p.id })}">${U().photo(p)}<span><b>${p.title}</b><small>${s.name} · ★ ${s.rate}</small></span></a>
          <dl><div><dt>Товар</dt><dd>${U().fmt(p.price)}</dd></div><div><dt>Доставка</dt><dd data-ship-out>390 ₽</dd></div><div><dt>Защита сделки</dt><dd>0 ₽</dd></div><div class="a-order-total"><dt>Итого</dt><dd data-total></dd></div></dl>
        </aside>
      </div>
      <section class="a-done" data-paid hidden>
        <i>✓</i><h1>Оплачено. Деньги под защитой.</h1>
        <p>${s.name} получит их только после того, как вы заберёте и проверите «${p.title}». Срок отправки — до 2 дней, трек-номер придёт в чат.</p>
        <div class="a-empty-actions"><a class="a-cta" href="${U().href("chats", { to: p.id, msg: "Оплатил через безопасную сделку, жду отправки." })}">Написать продавцу</a><a class="a-cta2" href="${U().href("home")}">На главную</a></div>
      </section>
    </main>${A().footer()}`;
  }
  function initCheckout() {
    const root = document.querySelector("[data-checkout]"); const price = Number(root.dataset.price);
    const sync = () => { const ship = Number(root.querySelector("[data-ship].on")?.dataset.ship || 0); root.querySelector("[data-where]").hidden = ship === 0; root.querySelector("[data-ship-out]").textContent = U().fmt(ship); root.querySelectorAll("[data-total]").forEach((el) => { el.textContent = U().fmt(price + ship); }); };
    root.querySelectorAll("[data-ship]").forEach((b) => b.addEventListener("click", () => { root.querySelectorAll("[data-ship]").forEach((x) => x.classList.toggle("on", x === b)); sync(); }));
    root.querySelector("[data-pay-form]").addEventListener("submit", (e) => { e.preventDefault(); root.hidden = true; document.querySelector("[data-checkout-h]").hidden = true; document.querySelector("[data-paid]").hidden = false; window.scrollTo(0, 0); });
    sync();
  }

  /* =========================== МОДАЛЬНЫЕ ОКНА =========================== */
  function modal(html) {
    document.querySelector(".a-modal")?.remove();
    const m = document.createElement("div"); m.className = "a-modal"; m.innerHTML = `<button type="button" class="a-modal-scrim" data-modal-close aria-label="Закрыть"></button><div class="a-modal-box" role="dialog" aria-modal="true">${html}</div>`;
    document.getElementById("app").append(m); requestAnimationFrame(() => m.classList.add("open")); return m;
  }
  const closeModal = () => { const m = document.querySelector(".a-modal"); if (!m) return; m.classList.remove("open"); setTimeout(() => m.remove(), 200); };
  const geoText = () => { const g = S("geo", { city: "Москва", radius: "весь город" }); return g.radius === "весь город" ? g.city : `${g.city} · ${g.radius}`; };
  const syncGeo = () => document.querySelectorAll("[data-geo-label]").forEach((el) => { el.textContent = geoText(); });

  function openGeo() {
    const g = S("geo", { city: "Москва", radius: "весь город" });
    const m = modal(`<header><h2>Где искать</h2><button type="button" data-modal-close aria-label="Закрыть">✕</button></header>
      <div class="a-field"><span>Город</span><div class="a-modal-opts" data-single data-geo-city>${["Москва", "Санкт-Петербург", "Казань", "Новосибирск", "Екатеринбург", "Вся Россия"].map((c) => `<button type="button" data-toggle class="${c === g.city ? "on" : ""}">${c}</button>`).join("")}</div></div>
      <div class="a-field"><span>Радиус от меня</span><div class="a-modal-opts" data-single data-geo-radius>${["до 1 км", "до 3 км", "до 5 км", "до 10 км", "до 25 км", "весь город"].map((r) => `<button type="button" data-toggle class="${r === g.radius ? "on" : ""}">${r}</button>`).join("")}</div></div>
      <p class="a-muted">В большом городе «рядом» — это пара километров, в небольшом — весь город. Радиус можно менять прямо в запросе: «диван рядом».</p>
      <button type="button" class="a-cta" data-geo-apply>Показать объявления</button>`);
    m.querySelector("[data-geo-apply]").addEventListener("click", () => {
      U().state.set("geo", { city: m.querySelector("[data-geo-city] .on")?.textContent || g.city, radius: m.querySelector("[data-geo-radius] .on")?.textContent || g.radius });
      syncGeo(); closeModal(); U().toast(`Ищем: ${geoText()}`);
    });
  }
  function openPick(btn) {
    const [title, ...opts] = btn.dataset.pick.split("|"); const target = btn.dataset.pickTarget ? document.querySelector(btn.dataset.pickTarget) : btn.querySelector("[data-pick-val]");
    const cur = target ? target.textContent.trim() : "";
    const m = modal(`<header><h2>${title}</h2><button type="button" data-modal-close aria-label="Закрыть">✕</button></header><div class="a-modal-list">${[...new Set(opts)].map((o) => `<button type="button" data-pick-opt class="${o === cur ? "on" : ""}">${o}</button>`).join("")}</div>`);
    m.querySelectorAll("[data-pick-opt]").forEach((o) => o.addEventListener("click", () => {
      if (/…$/.test(o.textContent)) { U().toast("В продукте здесь откроется ввод своего значения"); return closeModal(); }
      if (target) target.textContent = o.textContent; closeModal();
    }));
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-modal-close]")) return closeModal();
    const geo = e.target.closest("[data-geo-open]"); if (geo) return openGeo();
    const pick = e.target.closest("[data-pick]"); if (pick) return openPick(pick);
    const back = e.target.closest("[data-back]"); if (back && history.length > 1 && document.referrer.startsWith(location.origin)) { e.preventDefault(); return history.back(); }
    const ph = e.target.closest("[data-phone]"); if (ph) { ph.textContent = "+7 916 ••• 48 12 · позвонить"; ph.classList.add("on"); return U().toast("Номер защищён: звонок пройдёт через RUBERI"); }
    const more = e.target.closest("[data-specs-more]"); if (more) { const rows = document.querySelectorAll("[data-spec-more]"); const open = rows[0]?.hidden; rows.forEach((r) => { r.hidden = !open; }); const t = more.textContent; more.textContent = more.dataset.less; more.dataset.less = t; return; }
    const lm = e.target.closest("[data-more]"); if (lm) { document.querySelectorAll("[data-results] [hidden]").forEach((c) => { c.hidden = false; }); return lm.remove(); }
    const sv = e.target.closest("[data-save-search]"); if (sv) {
      const q = sv.dataset.saveSearch; let list = S("searches", window.SEARCHES0); const has = list.some((x) => x.q === q);
      list = has ? list.filter((x) => x.q !== q) : [{ q, fresh: 0, notify: true }].concat(list); U().state.set("searches", list);
      if (sv.classList.contains("a-save")) { sv.classList.toggle("on", !has); sv.textContent = has ? "Сообщать о новых" : "Сообщим о новых"; }
      return U().toast(has ? "Больше не следим за этим поиском" : "Готово: пришлём уведомление о новых. Поиск — в «Избранном»");
    }
    const sd = e.target.closest("[data-search-del]"); if (sd) { const list = S("searches", window.SEARCHES0); list.splice(Number(sd.dataset.searchDel), 1); U().state.set("searches", list); return location.reload(); }
    const so = e.target.closest("[data-sort]"); if (so) {
      const grid = document.querySelector("[data-results]"); const key = { "дешевле": (a, b) => a.dataset.price - b.dataset.price, "ближе": (a, b) => a.dataset.km - b.dataset.km, "новые": (a, b) => a.dataset.i - b.dataset.i, "подходящие": (a, b) => a.dataset.i - b.dataset.i }[so.dataset.sort];
      [...grid.children].sort(key).forEach((c, i) => { c.hidden = i >= 8 && !!document.querySelector("[data-more]"); grid.append(c); });
    }
  });
  document.addEventListener("change", (e) => {
    const n = e.target.closest("[data-search-notify]"); if (n) { const list = S("searches", window.SEARCHES0); list[Number(n.dataset.searchNotify)].notify = n.checked; U().state.set("searches", list); const lab = n.closest("label").querySelector("[data-notify-label]"); if (lab) lab.textContent = n.checked ? "Уведомления включены" : "Уведомления выключены"; U().toast(n.checked ? "Будем присылать новые объявления" : "Не беспокоим: новые будут ждать здесь"); }
  });
  document.addEventListener("favs-changed", () => { const grid = document.querySelector("[data-favs-grid]"); if (grid) grid.querySelectorAll(".a-fav:not(.on)").forEach((b) => { const c = b.closest(".a-card"); c.style.opacity = ".35"; }); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) { const i = document.querySelector(".a-ask input, .a-head-search input"); if (i) { e.preventDefault(); i.focus(); } } });

  Object.assign(window.V.a, { favorites, chats: chatsScreen, profile, seller, checkout });
  const prevInit = window.V.a.init;
  window.V.a.init = (screen, ctx) => { prevInit(screen, ctx); ({ chats: initChats, profile: initProfile, checkout: initCheckout }[screen] || (() => {}))(); syncGeo(); };
})();
