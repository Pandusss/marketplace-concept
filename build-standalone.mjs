// Собирает самодостаточные версии четырёх экранов (CSS и JS внутри файла) в ./standalone.
// Запуск: node build-standalone.mjs. Фото по-прежнему грузятся из сети, локальный спрайт — из ../assets.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
mkdirSync(new URL("./standalone/", import.meta.url), { recursive: true });
for (const screen of ["home", "category", "search", "product", "sell", "favorites", "chats", "profile", "seller", "checkout"]) {
  let html = read(`./${screen}.html`);
  html = html.replace(/\s*<link rel="stylesheet" href="(assets\/[^"]+)" \/>/g, (_, p) => `\n  <style>\n${read("./" + p)}\n  </style>`);
  html = html.replace(/\s*<script src="(assets\/[^"]+)"><\/script>/g, (_, p) => `\n  <script>\n${read("./" + p).replace(/<\/script/g, "<\/script")}\n  </script>`);
  html = html.replace('<div id="app"></div>', '<div id="app"></div>\n  <script>window.ASSET_BASE = "../assets/";</script>');
  html = html.replace('href="index.html"', 'href="../index.html"');
  writeFileSync(new URL(`./standalone/${screen}.html`, import.meta.url), html);
}
console.log("standalone: 10 screens");
