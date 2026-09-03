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
  assert.match(html, /<title>AI時代を進むライフゲーム<\/title>/i);
  assert.match(html, /AI時代を進むライフゲーム/);
  assert.match(html, /教えられる前に、まず選ぶ/);
  assert.match(html, /実証プロトタイプ/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("keeps safety and scenario content in source", async () => {
  const source = await readFile(new URL("../app/LifeGame.tsx", import.meta.url), "utf8");
  assert.match(source, /親友から突然のSOS/);
  assert.match(source, /学校公式アカウントからDM/);
  assert.match(source, /AIで課題、10分で終わった/);
  assert.match(source, /このコード、AIに直してもらおう/);
  assert.match(source, /AIで文化祭ポスター完成/);
  assert.match(source, /実証アンケート項目案/);
  assert.match(source, /実在URL、パスワード、個人情報の入力は使いません/);
  assert.doesNotMatch(source, /password|credit card|カード番号/i);
});

test("also serves the planned public path", async () => {
  const response = await renderPath("/ai-lifegame12");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /AI時代を進むライフゲーム/);
});
