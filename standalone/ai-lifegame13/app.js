const characters = {
  adventurer: { name: "冒険者レオ", short: "レオ", icon: "🗡️", world: "冒険の世界", stages: ["はじまりの森", "ひみつの小道", "まよいの谷", "なかよしの丘", "ゴールの城"], image: "./assets/world-adventure.jpeg", color: "#55b96d" },
  wizard: { name: "魔法使いミア", short: "ミア", icon: "🪄", world: "魔法の世界", stages: ["魔法の入口", "きらめきの森", "ふしぎな湖", "知恵の塔", "魔法の城"], image: "./assets/world-magic.jpeg", color: "#9b6ee8" },
  pirate: { name: "海賊ルビー", short: "ルビー", icon: "🏴‍☠️", world: "海賊の世界", stages: ["海賊の港", "宝の小島", "波の洞くつ", "海の灯台", "大海賊の城"], image: "./assets/world-pirate.jpeg", color: "#e45d4e" },
  astronaut: { name: "宇宙飛行士ソラ", short: "ソラ", icon: "🚀", world: "宇宙の世界", stages: ["宇宙ステーション", "月のクレーター", "星くずの道", "未知の惑星", "銀河の城"], image: "./assets/world-space.jpeg", color: "#3e86e8" },
  angel: { name: "天使ヒカリ", short: "ヒカリ", icon: "🪽", world: "天空の世界", stages: ["雲の入口", "風の塔", "空の迷路", "星の橋", "天空の城"], image: "./assets/world-sky.jpeg", color: "#e6a93f" }
};

const questions = {
  adventurer: [
    ["レオがAIに森の近道を聞くと、見たことのない道を教えられました。どうする？", ["地図や案内板でも確かめる", "AIだけを信じて進む", "友だちにも同じ道を教える", "暗くなってから試す"], 0, "AIは、もっともらしい間違いを言うことがあります。別の情報でも確かめよう。"],
    ["レオは宝箱の合言葉をAIに考えてもらいます。入れてはいけないものは？", ["好きな動物", "本当の名前と住所", "好きな色", "架空の言葉"], 1, "名前や住所などの個人情報はAIに入れないようにしよう。"],
    ["AIが作ったモンスターの絵が、有名な作品にそっくりです。レオはどうする？", ["自分の作品として売る", "そのまま発表する", "似ていないか確認して作り直す", "作者名を消す"], 2, "誰かの作品に似すぎていないか確認し、まねにならない工夫をしよう。"],
    ["AIが『この木の実は食べられる』と答えました。レオはどうする？", ["すぐ食べる", "少しだけ食べる", "友だちに先に食べてもらう", "大人や図鑑で確かめる"], 3, "命や健康に関わることは、AIだけで決めず、詳しい大人に確認しよう。"],
    ["レオがAIで作った冒険日記を発表します。大切なことは？", ["自分で読み直し、AIを使ったと伝える", "読まずに提出する", "全部自分で書いたと言う", "間違いがあっても隠す"], 0, "最後は自分で見直し、AIをどう使ったか正直に伝えよう。"]
  ],
  wizard: [
    ["ミアがAIに新しい魔法の作り方を聞くと、危ない材料が出てきました。どうする？", ["すぐ混ぜる", "先生に安全か確かめる", "弟に試してもらう", "こっそり作る"], 1, "危険がある内容は試さず、必ず信頼できる大人に確認しよう。"],
    ["AIが友だちの秘密を当てる魔法を提案しました。ミアはどうする？", ["みんなに見せる", "面白いので試す", "秘密を入力せず使わない", "名前だけ入力する"], 2, "自分や友だちの秘密をAIに入力してはいけません。"],
    ["AIが『明日は学校が休み』と言いました。ミアはどうする？", ["学校のお知らせで確かめる", "そのまま信じる", "クラス全員に広める", "目覚ましを止める"], 0, "大事なお知らせは、学校など元の情報で確認しよう。"],
    ["ミアがAIで物語を作ると、好きな本と同じ文章が出ました。どうする？", ["作者名を消す", "そのまま応募する", "少しだけ変える", "自分の言葉で大きく作り直す"], 3, "他の人の表現をそのまま使わず、自分のアイデアと言葉にしよう。"],
    ["AIが一人の友だちを『魔法が下手』と決めつけました。ミアはどう考える？", ["AIなら正しい", "一度の答えで人を決めつけない", "みんなに教える", "その子を仲間から外す"], 1, "AIの答えにも偏りがあります。人を決めつけず、自分でよく考えよう。"]
  ],
  pirate: [
    ["ルビーがAIに宝島の場所を聞くと、地図にない島を教えられました。どうする？", ["海図や船長にも確かめる", "AIを信じて出航する", "夜にこっそり行く", "全員に本物だと言う"], 0, "AIは存在しない場所を答えることがあります。信頼できる情報と比べよう。"],
    ["AIから『宝をあげるから船の合言葉を教えて』と言われました。ルビーは？", ["仲間だけに教える", "一文字だけ教える", "教えず、大人に相談する", "宝と交換する"], 2, "パスワードや合言葉は、どんな理由でもAIや知らない相手に教えないでね。"],
    ["ルビーが仲間の変な顔の写真をAIで加工したいときは？", ["本人に使ってよいか聞く", "黙って公開する", "海賊だけに送る", "すぐ消すから使う"], 0, "写真を使う前に、写っている人の許可をもらおう。"],
    ["AIが『嵐でも絶対安全な航路』を出しました。ルビーはどうする？", ["AIが絶対と言うなら進む", "小さい船で試す", "天気と海の専門家に確認する", "仲間には秘密にする"], 2, "安全に関わる判断はAIに任せきりにせず、人が責任を持って決めよう。"],
    ["AIで作った海賊旗が、別の海賊団の旗とそっくりです。どうする？", ["先に使えば勝ち", "色だけ変える", "相手の印を消す", "自分たちだけのデザインに直す"], 3, "他の作品を尊重して、まねではない自分たちの表現にしよう。"]
  ],
  astronaut: [
    ["ソラがAIに宇宙服の直し方を聞きました。どうする？", ["一人ですぐ直す", "手順書と専門家に確認する", "宇宙空間で試す", "AIの答えだけを保存する"], 1, "命に関わる作業は、正式な手順と専門家の確認が必要です。"],
    ["AIが未知の星の写真を『宇宙人だ』と答えました。ソラは？", ["ニュースにする", "証拠を調べて専門家に聞く", "本物だと友だちに送る", "画像をさらに加工する"], 1, "びっくりする情報ほど、証拠と出どころを確かめよう。"],
    ["宇宙船のメンバー表をAIに入れるとき、入れてはいけない情報は？", ["好きな星", "係の名前", "本名・住所・連絡先", "架空のチーム名"], 2, "本名、住所、連絡先などは大切な個人情報です。入力しないようにしよう。"],
    ["AIが作った研究レポートをソラが提出します。どうする？", ["数字や出典を自分で確かめる", "そのまま提出する", "AIを使ったことを隠す", "難しい部分は読まない"], 0, "AIの文章も、数字や情報源まで自分で確認する責任があります。"],
    ["AIが『ある星の人はみんな同じ性格』と答えました。ソラは？", ["星ごとに決めつける", "名札に性格を書く", "AIの答えを広める", "一人ひとり違うと考える"], 3, "グループだけで性格や能力を決めつけないことが大切です。"]
  ],
  angel: [
    ["ヒカリがAIに明日の天気を聞くと『必ず晴れ』と答えました。どうする？", ["傘を捨てる", "公式の天気予報も見る", "みんなに絶対晴れと伝える", "予定を全部変える"], 1, "AIの答えだけでなく、信頼できる最新情報も確認しよう。"],
    ["AIが友だちを元気にする文章を作りました。ヒカリは送る前に？", ["気持ちを考えて自分で読み直す", "長いまま全部送る", "名前を間違えても送る", "AIに全部任せる"], 0, "受け取る人の気持ちを考え、最後は自分で言葉を選ぼう。"],
    ["ヒカリが雲の上で撮った友だちの写真を公開したいときは？", ["顔を大きくする", "本人の許可をもらう", "場所もくわしく書く", "AIが選べば公開する"], 1, "写真や場所の情報は、本人に確認してから使おう。"],
    ["AIが作った歌が、有名な歌とほとんど同じでした。ヒカリは？", ["自分の名前で発表する", "少し速くする", "新しいメロディーに作り直す", "作者を隠す"], 2, "他の人の作品に似すぎていないか確かめ、自分らしく作り直そう。"],
    ["AIが一人だけ仲間に入れない案を出しました。ヒカリは？", ["理由を確かめ、公平な案を考える", "AIの案だから従う", "本人にだけ秘密にする", "同じ案を毎回使う"], 0, "AIの提案が公平か、人を傷つけないかを人が考えることが大切です。"]
  ]
};

let state = { screen: "select", character: null, current: 0, score: 1000, mistakes: 0, feedback: null };
const app = document.querySelector("#app");

function esc(value) { return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function theme(c) { return `style="--accent:${c.color};--world-image:url('${c.image}')"`; }

function choose(id) {
  state = { screen: "map", character: id, current: 0, score: 1000, mistakes: 0, feedback: null };
  render();
}

function answer(index) {
  const q = questions[state.character][state.current];
  if (index === q[2]) {
    state.score += 200;
    state.feedback = { ok: true, text: q[3] };
  } else {
    state.score = Math.max(0, state.score - 100);
    state.mistakes += 1;
    state.feedback = { ok: false, text: "おしい！もう一度考えてみよう。" };
  }
  render();
}

function next() {
  if (!state.feedback?.ok) { state.feedback = null; render(); return; }
  if (state.current === 4) state.screen = "finish";
  else { state.current += 1; state.screen = "map"; state.feedback = null; }
  render();
}

function renderSelect() {
  return `<section class="select-screen"><div class="select-inner"><span class="ribbon">AIと安全に冒険しよう！</span><h1>相棒をえらんで<br><em>冒険スタート！</em></h1><p>キャラクターをタップすると、その世界の5つのステージへ出発するよ。</p><div class="character-grid">${Object.entries(characters).map(([id,c]) => `<button class="character-card" onclick="choose('${id}')" style="--accent:${c.color}"><span class="character-icon">${c.icon}</span><b>${c.name}</b><small>${c.world}</small><strong>この相棒で出発 →</strong></button>`).join("")}</div></div></section>`;
}

function renderHeader(c) {
  return `<header class="game-header"><button onclick="state.screen='select';render()">← キャラクターを変える</button><div><span>${c.icon}</span><b>${c.name}</b></div><strong>${state.score} PT</strong></header>`;
}

function renderMap(c) {
  return `<section class="world" ${theme(c)}>${renderHeader(c)}<div class="world-content"><div class="world-title"><span>STAGE ${state.current + 1} / 5</span><h1>${c.world}</h1><p>${c.short}と5つの旗を集めよう！</p></div><div class="map-path">${c.stages.map((name,i) => `<div class="stage ${i < state.current ? "done" : i === state.current ? "active" : "locked"}"><span>${i < state.current ? "✓" : i + 1}</span><b>${name}</b></div>`).join("")}</div><button class="primary" onclick="state.screen='quiz';render()">${c.stages[state.current]}へ挑戦！</button></div></section>`;
}

function renderQuiz(c) {
  const q = questions[state.character][state.current];
  return `<section class="world" ${theme(c)}>${renderHeader(c)}<div class="quiz-wrap"><article class="quiz-card"><div class="quiz-top"><span>問題 ${state.current + 1}</span><b>${c.icon} ${c.stages[state.current]}</b></div><h1>${esc(q[0])}</h1><div class="choices">${q[1].map((x,i) => `<button onclick="answer(${i})" ${state.feedback ? "disabled" : ""}><span>${String.fromCharCode(65+i)}</span>${esc(x)}</button>`).join("")}</div>${state.feedback ? `<div class="feedback ${state.feedback.ok ? "ok" : "ng"}"><h2>${state.feedback.ok ? "クリア！ 🎉" : "もう一回！"}</h2><p>${esc(state.feedback.text)}</p><button class="primary" onclick="next()">${state.feedback.ok ? (state.current === 4 ? "結果を見る" : "次のステージへ") : "もう一度考える"}</button></div>` : ""}</article></div></section>`;
}

function renderFinish(c) {
  const perfect = state.mistakes === 0;
  return `<section class="world finish" ${theme(c)}>${renderHeader(c)}<div class="finish-card"><span class="trophy">🏆</span><span class="ribbon">ALL CLEAR!</span><h1>${c.name}と<br>冒険クリア！</h1><p>${perfect ? "5問ぜんぶ一発正解！すごすぎる！" : "AIを安全に使う5つの知恵を手に入れた！"}</p><div class="score">${state.score}<small>きらめきPT</small></div><button class="primary" onclick="choose('${state.character}')">もう一度あそぶ</button><button class="secondary" onclick="state.screen='select';render()">別のキャラクターをえらぶ</button></div></section>`;
}

function render() {
  const c = state.character ? characters[state.character] : null;
  app.innerHTML = state.screen === "select" ? renderSelect() : state.screen === "map" ? renderMap(c) : state.screen === "quiz" ? renderQuiz(c) : renderFinish(c);
  window.scrollTo(0, 0);
}
render();
