"use client";

import { useMemo, useState } from "react";

type Audience = "高校生" | "教員" | "新入社員" | "行政職員" | "高齢者";
type ScoreKey = "aiTrust" | "factCheck" | "privacy" | "consultation" | "responsibility";
type ChoiceType = "safe" | "mixed" | "risky";

type Choice = {
  label: string;
  log: string;
  type: ChoiceType;
  score: Partial<Record<ScoreKey, number>>;
};

type Quest = {
  id: string;
  no: string;
  title: string;
  stage: string;
  scene: string;
  prompt: string;
  facts: string[];
  choices: Choice[];
  incident: string;
  analysis: string;
  source: string;
};

const audiences: Audience[] = ["高校生", "教員", "新入社員", "行政職員", "高齢者"];

const initialScore: Record<ScoreKey, number> = {
  aiTrust: 4,
  factCheck: 4,
  privacy: 4,
  consultation: 4,
  responsibility: 4,
};

const scoreLabels: Record<ScoreKey, string> = {
  aiTrust: "AIをうのみにしない力",
  factCheck: "たしかめる力",
  privacy: "情報を守る力",
  consultation: "相談する力",
  responsibility: "人が決める力",
};

const quests: Quest[] = [
  {
    id: "friend-sos",
    no: "QUEST 01",
    title: "親友から突然のSOS",
    stage: "放課後",
    scene:
      "放課後、親友のユウキから電話がかかってきた。声はユウキに聞こえる。「スマホ落として、知らない人のスマホ借りてる。帰りの電車代がなくて、5,000円だけ送って。早くして！」と言っている。",
    prompt: "あなたはどう動く？",
    facts: ["声はユウキに聞こえる", "かなり急がされている", "いつもの連絡先ではない"],
    choices: [
      { label: "すぐ送る", log: "声と急ぎの言葉を信じて、すぐ送ることにした。", type: "risky", score: { aiTrust: -1, factCheck: -2, consultation: -1 } },
      { label: "本人しか知らないことを聞く", log: "本人だけが答えられることを聞いてみた。", type: "mixed", score: { factCheck: 1 } },
      { label: "いつものLINEに確認する", log: "電話はいったん切らず、いつものLINEにも確認を送った。", type: "safe", score: { factCheck: 2, consultation: 1 } },
      { label: "共通の友だちに聞く", log: "共通の友だちに、ユウキの様子を聞いた。", type: "safe", score: { consultation: 2, factCheck: 1 } },
    ],
    incident: "翌日、ユウキ本人はスマホをなくしていなかったと分かった。声をまねた電話だった可能性が出てきた。",
    analysis: "声が似ていること、親友が困っていること、少額に見えることを手がかりに判断していたかもしれません。AIで声を似せられる時代は、別の連絡方法で本人確認することが大切です。",
    source: "警察庁・IPAの特殊詐欺、フィッシング、本人確認に関する注意喚起",
  },
  {
    id: "school-dm",
    no: "QUEST 02",
    title: "学校公式アカウントからDM",
    stage: "SNS",
    scene:
      "Instagramに「学校 生徒会【公式】」からDMが来た。「文化祭アンケート。回答者20名にギフトカード3,000円。本日23:59まで」と書かれている。アイコンも学校名も本物っぽい。",
    prompt: "リンクを開く前にどうする？",
    facts: ["学校名と公式っぽい表示がある", "今日までと書かれている", "外部ページへのリンクがある"],
    choices: [
      { label: "リンクを開いてログインする", log: "締切が近いので、DMのリンクからログインした。", type: "risky", score: { factCheck: -2, privacy: -2 } },
      { label: "学校HPや連絡アプリを見る", log: "DMではなく、学校HPやいつもの連絡アプリを確認した。", type: "safe", score: { factCheck: 2, privacy: 1 } },
      { label: "友だちにだけ先に送る", log: "自分では開かず、友だちにDMを転送した。", type: "mixed", score: { factCheck: -1, responsibility: -1 } },
      { label: "先生に聞く", log: "スクリーンショットを先生に見せて、本物か聞いた。", type: "safe", score: { consultation: 2, factCheck: 1 } },
    ],
    incident: "数日後、同じDMからログインした人のアカウントが使えなくなったという話が出た。",
    analysis: "学校名、公式という文字、景品、締切を信じる材料にしていたかもしれません。本物っぽい表示でも、IDやパスワードを入れる前に公式の連絡元へ戻る必要があります。",
    source: "IPA・警察庁のフィッシング対策、実在サービスをかたる偽サイトの注意喚起",
  },
  {
    id: "teacher-video",
    no: "QUEST 03",
    title: "先生の動画が流出",
    stage: "グループチャット",
    scene:
      "夜9時、クラスのグループチャットに担任の先生が生徒を悪く言っているような動画が投稿された。顔も声も先生に見える。友だちは「広めよう」と盛り上がっている。",
    prompt: "あなたは次にどうする？",
    facts: ["顔と声は先生に見える", "だれが作った動画か分からない", "すでにチャットが盛り上がっている"],
    choices: [
      { label: "別のグループへ送る", log: "本物か分からないまま、別のグループへ送った。", type: "risky", score: { factCheck: -2, responsibility: -2 } },
      { label: "保存だけして様子を見る", log: "投稿はせず、動画を保存して様子を見た。", type: "mixed", score: { responsibility: -1 } },
      { label: "出した人に出どころを聞く", log: "動画を出した人に、どこから来たものか聞いた。", type: "mixed", score: { factCheck: 1 } },
      { label: "先生や学校に相談する", log: "動画を広めず、先生や学校に相談した。", type: "safe", score: { consultation: 2, responsibility: 2 } },
    ],
    incident: "翌朝、その動画はAIで作られたものかもしれないと分かった。すでに別のクラスにも広がっていた。",
    analysis: "自分で投稿していなくても、転送、保存、放置で広がる側に回ることがあります。真偽不明の人物動画は、面白さより先に本人の被害と相談先を考える必要があります。",
    source: "総務省・文部科学省の情報モラル教材、肖像・名誉・情報拡散リスク",
  },
  {
    id: "ai-report",
    no: "QUEST 04",
    title: "AIで課題、10分で終わった",
    stage: "レポート",
    scene:
      "明日提出のレポートがまだ白紙。AIにたのむと、本文も参考文献も一気に出てきた。AIに「本当にある？」と聞くと「あります」と答えた。",
    prompt: "提出前にどうする？",
    facts: ["AIは自信ありそうに答えている", "参考文献を自分では見ていない", "本文を自分の言葉で説明できない"],
    choices: [
      { label: "そのまま提出する", log: "AIが作った本文と参考文献をそのまま提出した。", type: "risky", score: { aiTrust: -2, factCheck: -2, responsibility: -1 } },
      { label: "参考文献が本当にあるか調べる", log: "参考文献が本当にあるか、図書館や公式ページで調べた。", type: "safe", score: { factCheck: 2, responsibility: 1 } },
      { label: "構成だけ参考にして書き直す", log: "AIの構成だけを参考にして、自分の言葉で書き直した。", type: "safe", score: { aiTrust: 1, responsibility: 2 } },
      { label: "友だちにも同じ方法をすすめる", log: "便利だったので、友だちにも同じ方法をすすめた。", type: "mixed", score: { aiTrust: -1, responsibility: -1 } },
    ],
    incident: "提出後、先生から「この参考文献は見つかりません」と言われた。",
    analysis: "AIを使って早く進めることと、正しく判断することは同じではありません。AIの答えを使うときは、出どころを自分でたしかめ、分かる言葉で説明できる形にする必要があります。",
    source: "文部科学省 生成AIガイドライン、学習活動でのAI利用に関する考え方",
  },
  {
    id: "career",
    no: "QUEST 05",
    title: "AIに進路を決めてもらった",
    stage: "進路",
    scene:
      "進路希望を書く時期。何が向いているか分からず、AIに聞くと「この仕事は向いていません。別の道がおすすめです」と強く言われた。",
    prompt: "進路希望を書く前にどうする？",
    facts: ["AIははっきり答えている", "先生や家族にはまだ相談していない", "自分の経験とは少し違う"],
    choices: [
      { label: "AIの通りに進路希望を書く", log: "AIの答えをそのまま進路希望に書いた。", type: "risky", score: { aiTrust: -2, consultation: -1, responsibility: -1 } },
      { label: "選択肢を増やすヒントにする", log: "AIの答えは、考える候補を増やすヒントとして使った。", type: "safe", score: { aiTrust: 1, responsibility: 2 } },
      { label: "先生や家族にも相談する", log: "AIだけで決めず、先生や家族にも相談した。", type: "safe", score: { consultation: 2, responsibility: 1 } },
      { label: "向いていないと言われた道を消す", log: "AIに向いていないと言われた道を、候補から外した。", type: "mixed", score: { aiTrust: -1, responsibility: -1 } },
    ],
    incident: "後から、AIの答えだけで自分の可能性をせばめていたかもしれないと感じた。",
    analysis: "AIは考える材料を出せますが、人生の決定者にはなれません。自分の経験、周りの人の話、調べた情報を合わせて考えることが大切です。",
    source: "文部科学省 生成AIガイドライン、キャリア教育での自己理解と意思決定",
  },
  {
    id: "api-key",
    no: "QUEST 06",
    title: "このコード、AIに直してもらおう",
    stage: "プログラミング",
    scene:
      "授業で作ったアプリが動かない。先生はAIを使ってもよいと言った。コードの中には学校名、APIキー、内部URLが入っている。",
    prompt: "AIへ貼り付ける前にどうする？",
    facts: ["早く直したい", "コードの中に秘密の文字列がある", "全部貼ればAIは直しやすそう"],
    choices: [
      { label: "コードを全部そのまま貼る", log: "コードを全部そのままAIに貼り付けた。", type: "risky", score: { privacy: -2, responsibility: -1 } },
      { label: "APIキーやURLを消してから貼る", log: "APIキーや内部URLを消し、必要な部分だけAIに見せた。", type: "safe", score: { privacy: 2, aiTrust: 1 } },
      { label: "エラー文だけ見せて相談する", log: "コード全部ではなく、エラー文と困っている点をAIに伝えた。", type: "safe", score: { privacy: 2, responsibility: 1 } },
      { label: "友だちのコードも一緒に貼る", log: "似ているので、友だちのコードも一緒にAIへ貼った。", type: "risky", score: { privacy: -2, responsibility: -2 } },
    ],
    incident: "バグは直ったが、秘密のキーをAIに送っていたことが後で問題になった。",
    analysis: "AIに見せる情報は少なくするのが基本です。名前、内部URL、キー、友だちの情報などは消してから相談する必要があります。",
    source: "個人情報保護委員会、IPA・AISIの生成AI利用と情報管理に関する注意喚起",
  },
  {
    id: "poster",
    no: "QUEST 07",
    title: "AIで文化祭ポスター完成",
    stage: "文化祭",
    scene:
      "文化祭ポスターを今日中に作ることになった。AI画像を使うと、有名キャラ風のかっこいいデザインがすぐに出てきた。友だちの写真を元にした案もある。",
    prompt: "公開する前にどうする？",
    facts: ["人気が出そうな絵ができた", "有名キャラに似ている", "友だちの写真を使っている"],
    choices: [
      { label: "そのまま学校外にも出す", log: "よくできたので、そのまま学校外にも公開した。", type: "risky", score: { responsibility: -2, consultation: -1 } },
      { label: "似すぎていない別案にする", log: "有名キャラに似すぎない別案に作り直した。", type: "safe", score: { responsibility: 2, aiTrust: 1 } },
      { label: "写真の本人に許可を取る", log: "写真を使う前に、写っている本人に確認した。", type: "safe", score: { privacy: 1, consultation: 1, responsibility: 1 } },
      { label: "AI作成と書けばそのままでよい", log: "AI作成と書けば大丈夫だと思い、そのまま使った。", type: "mixed", score: { aiTrust: -1, responsibility: -1 } },
    ],
    incident: "ポスターは好評だったが、後から「このキャラに似ていない？」「本人の許可は？」と指摘された。",
    analysis: "AIで作っても、公開する人の判断は残ります。だれかの作品に似すぎていないか、人物の写真を勝手に使っていないかを確認しましょう。",
    source: "文化庁のAIと著作権に関する資料、文部科学省の学校利用ガイドライン",
  },
  {
    id: "news-summary",
    no: "QUEST 08",
    title: "AIニュース要約を共有",
    stage: "ニュース",
    scene:
      "SNSで見たニュースをAIに要約してもらった。短く分かりやすくなったので、クラスLINEに共有したくなった。",
    prompt: "共有する前にどうする？",
    facts: ["要約は読みやすい", "元記事を最後まで読んでいない", "AIが少し強い言い方にしている"],
    choices: [
      { label: "元記事を読んでから共有する", log: "元記事を読み、AIの要約と違うところがないか見た。", type: "safe", score: { factCheck: 2, responsibility: 1 } },
      { label: "要約だけ見てすぐ送る", log: "AIの要約だけを見て、すぐクラスLINEへ送った。", type: "risky", score: { factCheck: -2, responsibility: -1 } },
      { label: "分からない部分は送らない", log: "自分で分からない部分は、共有文から外した。", type: "safe", score: { aiTrust: 1, factCheck: 1 } },
      { label: "もっと強い言い方に直す", log: "読まれやすいように、もっと強い言い方に直した。", type: "risky", score: { responsibility: -2, factCheck: -1 } },
    ],
    incident: "共有後、要約の一部が元記事と違うと分かり、クラス内で誤解が広がった。",
    analysis: "要約は便利ですが、元の情報と同じとは限りません。自分が広めるなら、元記事を見て、言いすぎていないか確認する必要があります。",
    source: "総務省・文部科学省の情報モラル教材、生成AIガイドライン",
  },
  {
    id: "chatbot",
    no: "QUEST 09",
    title: "AIチャットボットに全部任せた",
    stage: "問い合わせ",
    scene:
      "学校行事の問い合わせにAIチャットボットを使うことになった。回答は速いが、たまにルールと違う案内をしている。",
    prompt: "運用するとき、どうする？",
    facts: ["回答が速くなる", "たまに違う案内がある", "利用者は公式回答だと思う"],
    choices: [
      { label: "AIの回答をそのまま公式にする", log: "AIの回答をそのまま公式案内として使った。", type: "risky", score: { aiTrust: -2, responsibility: -2 } },
      { label: "重要な回答は人が確認する", log: "重要な案内は、人が確認してから出す形にした。", type: "safe", score: { responsibility: 2, aiTrust: 1 } },
      { label: "困ったら人につなぐルールにする", log: "AIで答えきれない時は、人につなぐルールを作った。", type: "safe", score: { consultation: 2, responsibility: 1 } },
      { label: "間違いが出るまで様子を見る", log: "問題が起きるまでは、そのまま使うことにした。", type: "mixed", score: { responsibility: -1 } },
    ],
    incident: "AIの案内を信じた人が違う手続きをしてしまい、あとから個別対応が必要になった。",
    analysis: "AIの回答を公式に見せるなら、人が責任を持つ仕組みが必要です。重要な内容は確認し、困った時に人へつなぐ道を用意しましょう。",
    source: "AIチャットボット誤案内の実例、消費者保護・組織責任の観点",
  },
  {
    id: "selection",
    no: "QUEST 10",
    title: "AIで採用・選抜を効率化",
    stage: "選抜",
    scene:
      "参加希望者が多く、AIに点数をつけてもらって上位だけを選ぶことになった。数字で出るので公平に見える。",
    prompt: "選ぶ前にどうする？",
    facts: ["数字で順位が出ている", "AIが何を重く見たか分かりにくい", "低い点の人にも強みがありそう"],
    choices: [
      { label: "AIの上位だけ選ぶ", log: "AIの点数だけを見て、上位の人だけを選んだ。", type: "risky", score: { aiTrust: -2, responsibility: -2 } },
      { label: "点数の理由を確認する", log: "AIがなぜその点にしたのか、理由を確認した。", type: "mixed", score: { factCheck: 1, responsibility: 1 } },
      { label: "人の目でも見直す", log: "AIの点数だけで決めず、人の目でも見直した。", type: "safe", score: { responsibility: 2, aiTrust: 1 } },
      { label: "いろいろな強みも見る", log: "点数以外の強みや事情も見て、話し合った。", type: "safe", score: { responsibility: 2, consultation: 1 } },
    ],
    incident: "あとから、AI点数が低かった人に大事な強みがあったと分かった。",
    analysis: "数字で出ると公平に見えますが、AIの判断にも偏りが入ることがあります。人を選ぶ場面では、理由を見て、人が総合的に考える必要があります。",
    source: "経産省・IPA/AISIガイドラインの公平性、人間中心、説明可能性の観点",
  },
];

const surveyQuestions = [
  "ゲームとして楽しめましたか？",
  "シナリオは自分にも起こりそうだと感じましたか？",
  "途中でAIや情報リテラシーの教材だと気づきましたか？",
  "結果や種明かしを見たとき、意外性はありましたか？",
  "AIやSNSの情報を、そのまま信じず確認しようと思いましたか？",
  "AIに入力する情報を、送信前に確認しようと思いましたか？",
  "AIに確認したことと、事実を確認したことは違うと理解できましたか？",
  "今後、AIやSNSを使うときに変えたい行動はありますか？",
  "画面の見やすさ・操作のしやすさはどうでしたか？",
  "追加してほしいシナリオやテーマはありますか？",
];

function clampScore(value: number) {
  return Math.max(0, Math.min(10, value));
}

function scorePercent(value: number) {
  return `${clampScore(value) * 10}%`;
}

function resultLabel(type: ChoiceType) {
  if (type === "safe") return "確認できた行動";
  if (type === "mixed") return "少し気になる行動";
  return "危なかった行動";
}

function resultTone(type: ChoiceType) {
  if (type === "safe") return "safe";
  if (type === "mixed") return "mixed";
  return "risky";
}

export function LifeGame() {
  const [audience, setAudience] = useState<Audience>("高校生");
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, Choice>>({});
  const [scores, setScores] = useState(initialScore);
  const [missionComplete, setMissionComplete] = useState(false);

  const currentQuest = quests[currentIndex];
  const selectedChoice = selectedChoices[currentQuest.id];
  const completedCount = Object.keys(selectedChoices).length;
  const isFinished = completedCount === quests.length;

  const totalScore = useMemo(
    () => Object.values(scores).reduce((sum, score) => sum + clampScore(score), 0),
    [scores],
  );

  const riskyCount = useMemo(
    () => Object.values(selectedChoices).filter((choice) => choice.type === "risky").length,
    [selectedChoices],
  );

  function choose(choice: Choice) {
    if (selectedChoice) return;

    setSelectedChoices((previous) => ({ ...previous, [currentQuest.id]: choice }));
    setScores((previous) => {
      const next = { ...previous };
      for (const key of Object.keys(choice.score) as ScoreKey[]) {
        next[key] = clampScore(next[key] + (choice.score[key] ?? 0));
      }
      return next;
    });
    setMissionComplete(true);
  }

  function moveNext() {
    if (currentIndex < quests.length - 1) {
      setCurrentIndex((index) => index + 1);
      setMissionComplete(false);
      return;
    }
    setMissionComplete(false);
  }

  function resetGame() {
    setStarted(false);
    setCurrentIndex(0);
    setSelectedChoices({});
    setScores(initialScore);
    setMissionComplete(false);
  }

  if (!started) {
    return (
      <main className="app-shell">
        <section className="start-panel" aria-labelledby="app-title">
          <div className="start-copy">
            <p className="eyebrow">AI Life Game / 実証プロトタイプ</p>
            <h1 id="app-title">AI時代を進むライフゲーム</h1>
            <p className="lead">教えられる前に、まず選ぶ。</p>
            <p className="intro">
              AI、SNS、学校生活、仕事の中で起きそうな出来事を選びながら進みます。
              途中では正解も危険も表示しません。最後に、あなたの行動ログから何が起きたかをふり返ります。
            </p>
            <div className="safety-note">
              実在URL、パスワード、個人情報の入力は使いません。失敗しても、現実で試す前に気づくためのゲームです。
            </div>
          </div>

          <div className="start-card" aria-label="ゲーム開始設定">
            <label htmlFor="audience">体験する立場</label>
            <select
              id="audience"
              value={audience}
              onChange={(event) => setAudience(event.target.value as Audience)}
            >
              {audiences.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button type="button" className="primary-button" onClick={() => setStarted(true)}>
              ゲームを始める
            </button>
            <p className="micro-copy">所要時間: 10〜20分 / クエスト: {quests.length}件</p>
          </div>
        </section>
      </main>
    );
  }

  if (isFinished && currentIndex === quests.length - 1 && !missionComplete) {
    return (
      <main className="app-shell">
        <section className="summary-layout" aria-labelledby="summary-title">
          <div className="summary-card">
            <p className="eyebrow">行動ログ分析 / {audience}</p>
            <h1 id="summary-title">あとから見えた判断</h1>
            <div className="total-score">
              <span>{totalScore}</span>
              <small>/ 50</small>
            </div>
            <p className="summary-text">
              {riskyCount === 0
                ? "すべての場面で、確認・相談・保留を行動にできていました。現実でも同じ一呼吸を使えます。"
                : riskyCount <= 3
                  ? "多くの場面で立ち止まれています。急がされる場面や本物っぽい表示が出た時に、もう一度確認を入れるとさらに安定します。"
                  : "AIやSNSは、一度うまくいったように見えてから問題が出ることがあります。急ぎ、景品、本人っぽさ、数字の見た目に引っぱられた場面を見直しましょう。"}
            </p>
            <div className="summary-actions">
              <button type="button" className="primary-button" onClick={resetGame}>
                もう一度ちがう行動を試す
              </button>
              <a className="secondary-link" href="#survey">
                実証アンケートを見る
              </a>
            </div>
          </div>

          <div className="score-board" aria-label="診断軸ごとのスコア">
            {(Object.keys(scores) as ScoreKey[]).map((key) => (
              <div className="score-row" key={key}>
                <div className="score-row-head">
                  <span>{scoreLabels[key]}</span>
                  <strong>{clampScore(scores[key])}</strong>
                </div>
                <div className="meter" aria-hidden="true">
                  <div style={{ width: scorePercent(scores[key]) }} />
                </div>
              </div>
            ))}
          </div>

          <section className="log-panel" aria-label="行動ログと種明かし">
            <h2>あなたの行動ログと種明かし</h2>
            <div className="log-list">
              {quests.map((quest, index) => {
                const choice = selectedChoices[quest.id];
                return (
                  <article className={`log-card ${resultTone(choice.type)}`} key={quest.id}>
                    <div className="log-head">
                      <span>{quest.no}</span>
                      <strong>{quest.title}</strong>
                    </div>
                    <p className="chosen-log">選んだ行動: {choice.log}</p>
                    <p className="incident-log">その後: {quest.incident}</p>
                    <p>{quest.analysis}</p>
                    <small>
                      {resultLabel(choice.type)} / 根拠: {quest.source}
                    </small>
                    {index === 0 ? <em>プレイ中には見えなかった情報です。</em> : null}
                  </article>
                );
              })}
            </div>
          </section>

          <section id="survey" className="survey-box" aria-label="実証アンケート">
            <h2>実証アンケート項目案</h2>
            <p>
              初回実証では、回答の負担をおさえるために10問程度に絞ります。Googleフォームなどへ移す想定です。
            </p>
            <ol>
              {surveyQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="game-shell">
      <header className="game-header">
        <div>
          <p className="eyebrow">
            {currentQuest.no} / {audience}
          </p>
          <h1>AI時代を進むライフゲーム</h1>
        </div>
        <button type="button" className="ghost-button" onClick={resetGame}>
          最初から
        </button>
      </header>

      <section className="map-panel" aria-label="ライフゲームマップ">
        {quests.map((quest, index) => {
          const completed = Boolean(selectedChoices[quest.id]);
          const active = index === currentIndex;
          return (
            <button
              type="button"
              key={quest.id}
              className={`map-node ${active ? "active" : ""} ${completed ? "completed" : ""}`}
              onClick={() => {
                if (completed || index <= completedCount) {
                  setCurrentIndex(index);
                  setMissionComplete(Boolean(selectedChoices[quest.id]));
                }
              }}
              aria-current={active ? "step" : undefined}
            >
              <span>{index + 1}</span>
              <strong>{quest.title}</strong>
              <small>{quest.stage}</small>
            </button>
          );
        })}
      </section>

      <section className="play-layout">
        <article className="event-card" aria-labelledby="event-title">
          <div className="event-meta">
            <span>{currentQuest.stage}</span>
            <span>今わかっていることだけで判断</span>
          </div>
          <h2 id="event-title">{currentQuest.title}</h2>
          <div className="scenario-box">
            <p>{currentQuest.scene}</p>
          </div>
          <h3>{currentQuest.prompt}</h3>
          <div className="choices">
            {currentQuest.choices.map((choice) => (
              <button
                type="button"
                key={choice.label}
                className={`choice-button ${selectedChoice?.label === choice.label ? "chosen" : ""}`}
                onClick={() => choose(choice)}
                disabled={Boolean(selectedChoice)}
              >
                {choice.label}
              </button>
            ))}
          </div>
        </article>

        <aside className="side-panel" aria-label="今わかっていること">
          <div className="clue-card">
            <h2>今わかっていること</h2>
            <ul>
              {currentQuest.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>

          <div className="compact-scores">
            <h2>行動ログ</h2>
            <p>ここでは良い・悪いをまだ出しません。最後にまとめてふり返ります。</p>
            <strong>
              {completedCount}/{quests.length}
            </strong>
          </div>
        </aside>
      </section>

      {missionComplete && selectedChoice ? (
        <section className="result-panel mission" aria-live="polite">
          <div>
            <p className="result-label">ミッション完了</p>
            <h2>あなたの行動を記録しました。</h2>
            <p>この時点では成功したように見えます。あとで何が起きるか、最後にまとめて確認します。</p>
          </div>
          <button type="button" className="primary-button" onClick={moveNext}>
            {currentIndex === quests.length - 1 ? "最後の結果を見る" : "次のクエストへ"}
          </button>
        </section>
      ) : null}
    </main>
  );
}
