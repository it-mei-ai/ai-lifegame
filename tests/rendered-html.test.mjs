import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function renderPath(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the AI life game landing state", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>AI時代の失敗体験型ライフゲーム<\/title>/i);
  assert.match(html, /AI時代の失敗体験型ライフゲーム/);
  assert.match(html, /そのAI、本当に信じて大丈夫/);
  assert.match(html, /教育用シミュレーション/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("keeps safety and scenario content in source", async () => {
  const source = await readFile(new URL("../app/LifeGame.tsx", import.meta.url), "utf8");
  assert.match(source, /AI課題提出/);
  assert.match(source, /SNSなりすましDM/);
  assert.match(source, /友人関係とSNS投稿/);
  assert.match(source, /怪しいURL/);
  assert.match(source, /報連相ミス/);
  assert.match(source, /実在企業名、実URL、個人情報入力は使いません/);
  assert.doesNotMatch(source, /password|credit card|カード番号/i);
});

test("also serves the planned public path", async () => {
  const response = await renderPath("/ai-lifegame");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /AI時代の失敗体験型ライフゲーム/);
});
