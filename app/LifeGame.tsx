"use client";

import { useMemo, useState } from "react";

type Audience = "高校生" | "教員" | "新入社員" | "行政職員" | "高齢者";
type ScoreKey = "aiLiteracy" | "infoCheck" | "security" | "consultation" | "ethics";

type Choice = {
  label: string;
  result: "good" | "watch" | "risk";
  feedback: string;
  action: string;
  score: Partial<Record<ScoreKey, number>>;
};

type Event = {
  id: string;
  title: string;
  stage: string;
  type: string;
  scene: string;
  prompt: string;
  clues: string[];
  choices: Choice[];
};

const audiences: Audience[] = ["高校生", "教員", "新入社員", "行政職員", "高齢者"];

const initialScore: Record<ScoreKey, number> = {
  aiLiteracy: 4,
  infoCheck: 4,
  security: 4,
  consultation: 4,
  ethics: 4,
};

const scoreLabels: Record<ScoreKey, string> = {
  aiLiteracy: "AIリテラシー",
  infoCheck: "情報確認力",
  security: "セキュリティ意識",
  consultation: "相談力",
  ethics: "倫理・人間関係",
};

const events: Event[] = [
  {
    id: "ai-report",
    title: "AI課題提出",
    stage: "学校生活",
    type: "AI判断",
    scene:
      "レポート課題の締切が近い。AIに相談すると、完成度が高そうな文章と出典リストが一瞬で出てきました。ただし、出典の一部は見覚えがなく、内容も自分の言葉では説明できません。",
    prompt: "あなたなら、次にどうしますか？",
    clues: ["出典が実在するか不明", "自分で説明できない表現がある", "学校のAI利用ルールを確認していない"],
    choices: [
      {
        label: "出典を確認し、自分の言葉で書き直す",
        result: "good",
        feedback:
          "AIを道具として使い、最終責任を自分に戻せています。便利さと誠実さの両立ができています。",
        action: "公式資料や授業資料で確認し、理解した内容だけを自分の言葉で提出する。",
        score: { aiLiteracy: 2, infoCheck: 2, ethics: 1 },
      },
      {
        label: "先生にAI利用範囲を確認する",
        result: "good",
        feedback:
          "判断に迷う場面で確認できています。ルール確認は、AI時代の基本的な相談行動です。",
        action: "利用した範囲、困っている点、提出前に確認したい点を短く伝える。",
        score: { aiLiteracy: 1, consultation: 2, ethics: 1 },
      },
      {
        label: "AI生成文をそのまま提出する",
        result: "risk",
        feedback:
          "短期的には楽ですが、存在しない出典や理解不足が残ります。AIは責任まで肩代わりしてくれません。",
        action: "提出前に出典と内容理解を確認する。わからない部分は質問し直す。",
        score: { aiLiteracy: -2, infoCheck: -2, ethics: -2 },
      },
      {
        label: "友人にも同じ方法を勧める",
        result: "watch",
        feedback:
          "便利な方法を共有する前に、正しい使い方か確認が必要です。誤った方法は周囲にも広がります。",
        action: "AI利用の注意点や学校ルールもセットで共有する。",
        score: { aiLiteracy: -1, ethics: -1, consultation: 1 },
      },
    ],
  },
  {
    id: "sns-dm",
    title: "SNSなりすましDM",
    stage: "SNS",
    type: "本人確認",
    scene:
      "同じ学校の先輩を名乗るアカウントからDMが届きました。『限定イベントの申込、今日まで。ここから登録して』と外部ページへのアクセスを促されています。",
    prompt: "リンクを開く前に、どう動きますか？",
    clues: ["アカウント作成日が新しい", "共通の知人が確認できない", "今日までと急がせている"],
    choices: [
      {
        label: "プロフィールと過去投稿を確認する",
        result: "watch",
        feedback:
          "確認の第一歩はできています。ただし、見た目だけで本人と断定するのは危険です。",
        action: "共通の知人や別の連絡手段でも確認する。",
        score: { infoCheck: 1, security: 1 },
      },
      {
        label: "共通の知人や先生に確認する",
        result: "good",
        feedback:
          "一人で判断せず、リアルな関係性を使って確認できています。最も被害を避けやすい行動です。",
        action: "DMのスクリーンショットを見せ、本人かどうか確認する。",
        score: { consultation: 2, infoCheck: 2, security: 1 },
      },
      {
        label: "そのままリンクを開いて登録する",
        result: "risk",
        feedback:
          "急がせる言葉と外部リンクが重なる場面は危険です。個人情報入力前に止まる必要があります。",
        action: "リンク先ではなく、公式な案内や本人確認を先に行う。",
        score: { security: -2, infoCheck: -2 },
      },
      {
        label: "不安なので放置し、誰にも言わない",
        result: "watch",
        feedback:
          "開かない判断は良い一方、周囲にも同じDMが届いている可能性があります。",
        action: "先生、家族、友人に共有し、被害拡大を防ぐ。",
        score: { security: 1, consultation: -1 },
      },
    ],
  },
  {
    id: "friend-post",
    title: "友人関係とSNS投稿",
    stage: "人間関係",
    type: "倫理",
    scene:
      "友人との会話をAIで面白く加工してSNSに投稿しました。反応は増えましたが、本人が嫌がっていることがわかり、周囲も拡散し始めています。",
    prompt: "このあと、どう対応しますか？",
    clues: ["本人の許可を取っていない", "AI加工で文脈が変わっている", "反応より相手の尊厳が優先"],
    choices: [
      {
        label: "投稿を削除し、本人に直接謝る",
        result: "good",
        feedback:
          "早く止め、相手に向き合う判断ができています。失敗後のリカバリーは信頼を守る重要な行動です。",
        action: "拡散した相手にも削除を依頼し、必要なら先生や大人に相談する。",
        score: { ethics: 2, consultation: 1 },
      },
      {
        label: "先生や信頼できる大人に相談する",
        result: "good",
        feedback:
          "自分だけで抱え込まず、被害を広げないための支援を求められています。",
        action: "投稿内容、拡散状況、本人の反応を整理して相談する。",
        score: { consultation: 2, ethics: 1 },
      },
      {
        label: "冗談だから、と放置する",
        result: "risk",
        feedback:
          "自分に悪気がなくても、相手が傷ついていれば対応が必要です。AIやSNSの便利さより信頼関係が優先です。",
        action: "相手の気持ちを確認し、削除・謝罪・訂正を行う。",
        score: { ethics: -2, consultation: -1 },
      },
      {
        label: "AIで言い訳文を作って投稿する",
        result: "risk",
        feedback:
          "言い訳を整えても、本人と向き合わなければ信頼は戻りません。AIは誠実な対話の代わりにはなりません。",
        action: "まず本人に謝り、必要な範囲で訂正を出す。",
        score: { aiLiteracy: -1, ethics: -2 },
      },
    ],
  },
  {
    id: "phishing-mail",
    title: "怪しいURL",
    stage: "アカウント管理",
    type: "セキュリティ",
    scene:
      "『アカウント更新が必要です』というメールが届きました。本文は自然ですが、送信元とURLに少し違和感があります。24時間以内に手続きしないと停止と書かれています。",
    prompt: "ログインする前に何をしますか？",
    clues: ["送信元が公式と少し違う", "期限で焦らせている", "メール内リンクからログインを求めている"],
    choices: [
      {
        label: "メール内リンクではなく公式ページから確認する",
        result: "good",
        feedback:
          "リンクを直接開かず、公式導線に戻れています。フィッシング対策として有効です。",
        action: "ブックマークや検索から公式ページへ行き、通知の有無を確認する。",
        score: { security: 2, infoCheck: 2 },
      },
      {
        label: "担当者やサポート窓口に確認する",
        result: "good",
        feedback:
          "迷った時に確認先を使えています。組織や学校では特に重要な行動です。",
        action: "メール本文ではなく、既知の連絡先から問い合わせる。",
        score: { consultation: 2, security: 1 },
      },
      {
        label: "急いでメール内リンクからログインする",
        result: "risk",
        feedback:
          "焦りを利用するのは典型的なトラップです。IDやパスワード入力前に止まる必要があります。",
        action: "送信元、URL、公式通知を確認してから進む。",
        score: { security: -2, infoCheck: -2 },
      },
      {
        label: "周囲にも急いで転送する",
        result: "watch",
        feedback:
          "注意喚起のつもりでも、未確認情報を広げると混乱を招きます。",
        action: "確認できた事実と相談先をセットで共有する。",
        score: { infoCheck: -1, consultation: 1 },
      },
    ],
  },
  {
    id: "work-report",
    title: "報連相ミス",
    stage: "仕事・地域活動",
    type: "信頼",
    scene:
      "小さなミスをしました。AIに相談すると、問題がなかったように見える説明文が出てきました。ただし、関係者には早く共有した方がよさそうです。",
    prompt: "信頼を守るために、何を選びますか？",
    clues: ["自己保身に寄った文章", "関係者への影響が未確認", "早期共有で被害を小さくできる"],
    choices: [
      {
        label: "事実・影響・対応案を整理して報告する",
        result: "good",
        feedback:
          "AIを整理に使いながら、人間として責任ある報告に戻せています。",
        action: "何が起きたか、影響、次の対応、再発防止を短く伝える。",
        score: { ethics: 2, consultation: 2, aiLiteracy: 1 },
      },
      {
        label: "AIの謝罪文をたたき台にし、自分で直す",
        result: "watch",
        feedback:
          "AIを補助として使うのは有効です。ただし、事実確認と自分の言葉への修正が必須です。",
        action: "事実に合わない表現や責任逃れに見える表現を削る。",
        score: { aiLiteracy: 1, ethics: 1 },
      },
      {
        label: "問題が大きくなるまで黙っている",
        result: "risk",
        feedback:
          "ミスを隠すほど、信頼回復は難しくなります。AI時代でも信頼は人間の行動で決まります。",
        action: "小さいうちに相談し、影響を最小化する。",
        score: { ethics: -2, consultation: -2 },
      },
      {
        label: "AIの文章をそのまま関係者へ送る",
        result: "watch",
        feedback:
          "文章は整っていても、事実と責任が曖昧なままでは危険です。",
        action: "自分で事実確認し、必要な相手に必要な順番で共有する。",
        score: { aiLiteracy: -1, ethics: -1, infoCheck: -1 },
      },
    ],
  },
];

function clampScore(value: number) {
  return Math.max(0, Math.min(10, value));
}

function scorePercent(value: number) {
  return `${clampScore(value) * 10}%`;
}

function scoreStatus(value: number) {
  if (value >= 8) return "強み";
  if (value >= 5) return "成長中";
  return "要注意";
}

export function LifeGame() {
  const [audience, setAudience] = useState<Audience>("高校生");
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, Choice>>({});
  const [scores, setScores] = useState(initialScore);
  const [showResult, setShowResult] = useState(false);

  const currentEvent = events[currentIndex];
  const selectedChoice = selectedChoices[currentEvent.id];
  const completedCount = Object.keys(selectedChoices).length;
  const isFinished = completedCount === events.length;

  const totalScore = useMemo(
    () => Object.values(scores).reduce((sum, score) => sum + clampScore(score), 0),
    [scores],
  );

  const strongest = useMemo(() => {
    const entries = Object.entries(scores) as [ScoreKey, number][];
    return entries.sort((a, b) => b[1] - a[1])[0];
  }, [scores]);

  const weakest = useMemo(() => {
    const entries = Object.entries(scores) as [ScoreKey, number][];
    return entries.sort((a, b) => a[1] - b[1])[0];
  }, [scores]);

  function choose(choice: Choice) {
    if (selectedChoice) return;

    setSelectedChoices((previous) => ({ ...previous, [currentEvent.id]: choice }));
    setScores((previous) => {
      const next = { ...previous };
      for (const key of Object.keys(choice.score) as ScoreKey[]) {
        next[key] = clampScore(next[key] + (choice.score[key] ?? 0));
      }
      return next;
    });
    setShowResult(true);
  }

  function moveNext() {
    if (currentIndex < events.length - 1) {
      setCurrentIndex((index) => index + 1);
      setShowResult(false);
      return;
    }
    setShowResult(false);
  }

  function resetGame() {
    setStarted(false);
    setCurrentIndex(0);
    setSelectedChoices({});
    setScores(initialScore);
    setShowResult(false);
  }

  if (!started) {
    return (
      <main className="app-shell">
        <section className="start-panel" aria-labelledby="app-title">
          <div className="start-copy">
            <p className="eyebrow">教育用シミュレーション / MVP</p>
            <h1 id="app-title">AI時代の失敗体験型ライフゲーム</h1>
            <p className="lead">そのAI、本当に信じて大丈夫？</p>
            <p className="intro">
              AI、SNS、怪しいURL、人間関係のトラップを安全に体験し、現実で使える確認力・相談力・倫理観を学ぶプロトタイプです。
            </p>
            <div className="safety-note">
              実在企業名、実URL、個人情報入力は使いません。失敗しても、次の判断につなげるためのゲームです。
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
              ライフゲームを始める
            </button>
            <p className="micro-copy">所要時間: 5〜10分 / イベント: {events.length}件</p>
          </div>
        </section>
      </main>
    );
  }

  if (isFinished && currentIndex === events.length - 1 && !showResult) {
    return (
      <main className="app-shell">
        <section className="summary-layout" aria-labelledby="summary-title">
          <div className="summary-card">
            <p className="eyebrow">診断結果 / {audience}</p>
            <h1 id="summary-title">AI時代の判断力スコア</h1>
            <div className="total-score">
              <span>{totalScore}</span>
              <small>/ 50</small>
            </div>
            <p className="summary-text">
              {totalScore >= 40
                ? "かなり堅実です。AIやネットの便利さを使いながら、確認と相談を行動に移せています。"
                : totalScore >= 28
                  ? "基礎はできています。焦りや人間関係が絡む場面で、もう一呼吸置くと判断が安定します。"
                  : "伸びしろがあります。危ない場面を知識として覚えるより、確認・相談・保留を習慣にすることが重要です。"}
            </p>
            <div className="summary-actions">
              <button type="button" className="primary-button" onClick={resetGame}>
                もう一度体験する
              </button>
              <a className="secondary-link" href="#survey">
                アンケート欄へ
              </a>
            </div>
          </div>

          <div className="score-board" aria-label="診断軸ごとのスコア">
            {(Object.keys(scores) as ScoreKey[]).map((key) => (
              <div className="score-row" key={key}>
                <div className="score-row-head">
                  <span>{scoreLabels[key]}</span>
                  <strong>{scoreStatus(scores[key])}</strong>
                </div>
                <div className="meter" aria-hidden="true">
                  <div style={{ width: scorePercent(scores[key]) }} />
                </div>
              </div>
            ))}
          </div>

          <div className="reflection-grid">
            <article>
              <h2>強み</h2>
              <p>{scoreLabels[strongest[0]]}が最も高く出ています。判断の前に立ち止まる力を、ほかの場面にも広げられます。</p>
            </article>
            <article>
              <h2>注意ポイント</h2>
              <p>{scoreLabels[weakest[0]]}は追加練習の余地があります。迷ったら、一人で抱えず確認先を使う設計にしましょう。</p>
            </article>
            <article>
              <h2>明日から使える行動</h2>
              <p>急がされる、外部リンクへ誘導される、AIの答えがもっともらしい。この3つが出たら、確認・相談・保留を先に選びます。</p>
            </article>
          </div>

          <section id="survey" className="survey-box" aria-label="アンケート">
            <h2>アンケートリンク設置欄</h2>
            <p>教師テスト配布時に、ここへGoogleフォーム等のURLを設定します。</p>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="game-shell">
      <header className="game-header">
        <div>
          <p className="eyebrow">AI Life Game / {audience}</p>
          <h1>そのAI、本当に信じて大丈夫？</h1>
        </div>
        <button type="button" className="ghost-button" onClick={resetGame}>
          最初から
        </button>
      </header>

      <section className="map-panel" aria-label="ライフゲームマップ">
        {events.map((event, index) => {
          const completed = Boolean(selectedChoices[event.id]);
          const active = index === currentIndex;
          return (
            <button
              type="button"
              key={event.id}
              className={`map-node ${active ? "active" : ""} ${completed ? "completed" : ""}`}
              onClick={() => {
                if (completed || index <= completedCount) {
                  setCurrentIndex(index);
                  setShowResult(Boolean(selectedChoices[event.id]));
                }
              }}
              aria-current={active ? "step" : undefined}
            >
              <span>{index + 1}</span>
              <strong>{event.title}</strong>
              <small>{event.stage}</small>
            </button>
          );
        })}
      </section>

      <section className="play-layout">
        <article className="event-card" aria-labelledby="event-title">
          <div className="event-meta">
            <span>{currentEvent.stage}</span>
            <span>{currentEvent.type}</span>
          </div>
          <h2 id="event-title">{currentEvent.title}</h2>
          <div className="scenario-box">
            <p>{currentEvent.scene}</p>
          </div>
          <h3>{currentEvent.prompt}</h3>
          <div className="choices">
            {currentEvent.choices.map((choice) => (
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

        <aside className="side-panel" aria-label="ヒントとスコア">
          <div className="clue-card">
            <h2>見るべきサイン</h2>
            <ul>
              {currentEvent.clues.map((clue) => (
                <li key={clue}>{clue}</li>
              ))}
            </ul>
          </div>

          <div className="compact-scores">
            <h2>現在の診断</h2>
            {(Object.keys(scores) as ScoreKey[]).map((key) => (
              <div className="mini-score" key={key}>
                <span>{scoreLabels[key]}</span>
                <strong>{clampScore(scores[key])}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {showResult && selectedChoice ? (
        <section className={`result-panel ${selectedChoice.result}`} aria-live="polite">
          <div>
            <p className="result-label">
              {selectedChoice.result === "good"
                ? "よい判断"
                : selectedChoice.result === "watch"
                  ? "惜しい判断"
                  : "トラップ発動"}
            </p>
            <h2>{selectedChoice.feedback}</h2>
            <p>{selectedChoice.action}</p>
          </div>
          <button type="button" className="primary-button" onClick={moveNext}>
            {currentIndex === events.length - 1 ? "診断を見る" : "次のマスへ"}
          </button>
        </section>
      ) : null}
    </main>
  );
}
