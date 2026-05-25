import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowDownUp, Clipboard, Sparkles, Trash2 } from "lucide-react";
import "./styles.css";

type Mode = "encode" | "decode";

const kanaEmojiMap: Record<string, string[]> = {
  "あ": ["🐜", "🥑"],
  "い": ["🪨", "🐶"],
  "う": ["🐮", "🐰"],
  "え": ["🖼️", "🦐"],
  "お": ["👹", "🍙"],
  "か": ["🐸", "🦀"],
  "き": ["🌲", "🌳"],
  "く": ["🚗", "🌰"],
  "け": ["🍰", "👮", "⚔️"],
  "こ": ["🐨", "✊"],
  "さ": ["🐵", "🐟"],
  "し": ["🦓", "🦌"],
  "す": ["🍉", "🍣"],
  "せ": ["🪭", "🌍", "🌎", "🌏"],
  "そ": ["🍦", "🛷"],
  "た": ["🐙"],
  "ち": ["🩸", "🍫"],
  "つ": ["🌙"],
  "て": ["🖐", "✋"],
  "と": ["🦌", "🕐", "🕒"],
  "な": ["7⃣", "🍐"],
  "に": ["🥕", "2⃣"],
  "ぬ": ["🧸"],
  "ね": ["🐱"],
  "の": ["🪚", "📓"],
  "は": ["🦷"],
  "ひ": ["🔥", "👸", "🐏"],
  "ふ": ["🛳️", "🦩"],
  "へ": ["🐍", "🚁"],
  "ほ": ["⭐", "🔥"],
  "ま": ["⭕", "🪆"],
  "み": ["👂"],
  "む": ["💜", "🔍", "🔎"],
  "め": ["👀"],
  "も": ["🍑", ],
  "や": ["🏹", "🌴"],
  "ゆ": ["♨"],
  "よ": ["4⃣"],
  "ら": ["🦁", "🏩"],
  "り": ["🍎"],
  "る": ["💎"],
  "れ": ["🍋"],
  "ろ": ["🚀", "🤖"],
  "わ": ["🐊"],
  "を": ["👌"],
  "ん": ["🆖"],
  "が": ["🐸\"", "🦀\""],
  "ぎ": ["⚙️", "🥛", "🌲\"", "🌳\""],
  "ぐ": ["🚗\"", "🌰\""],
  "げ": ["🍰\"", "👮\""],
  "ご": ["🐨\"", "✊\""],
  "ざ": ["🐵\"", "🐟\""],
  "じ": ["🦓\"", "🦌\""],
  "ず": ["🍉\"", "🍣\""],
  "ぜ": ["🪭\"", "🌍\"", "🌎\"", "🌏\""],
  "ぞ": ["🍦\"", "🛷\""],
  "だ": ["🐙\""],
  "ぢ": ["🩸\"", "🍫\""],
  "づ": ["🌙\""],
  "で": ["🖐\"", "✋\""],
  "ど": ["🦌\"", "🕐\"", "🕒\""],
  "ば": ["🦷\""],
  "び": ["🔥\"", "👸\"", "🐏\""],
  "ぶ": ["🛳️\"", "🦩\""],
  "べ": ["🐍\"", "🚁\""],
  "ぼ": ["⭐\"", "🔥\""],
  "ぱ": [],
  "ぴ": [],
  "ぷ": [],
  "ぺ": [],
  "ぽ": [],
  "ぁ": ["🐜", "🥑"],
  "ぃ": ["🪨", "🐶"],
  "ぅ": ["🐮", "🐰"],
  "ぇ": ["🖼️", "🦐"],
  "ぉ": ["👹", "🍙"],
  "ゃ": ["🏹", "🌴"],
  "ゅ": ["♨"],
  "ょ": ["4⃣"],
  "っ": ["🌙"],
  "ゎ": ["🐊"],
  "ゔ": []
};

const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });

function splitGraphemes(value: string) {
  return Array.from(segmenter.segment(value), (part) => part.segment);
}

function buildEmojiToKanaMap() {
  return Object.entries(kanaEmojiMap).reduce<Record<string, string>>((acc, [kana, emojis]) => {
    emojis.forEach((emoji) => {
      if (!acc[emoji]) acc[emoji] = kana;
    });
    return acc;
  }, {});
}

function encode(value: string) {
  return splitGraphemes(value)
    .map((char) => kanaEmojiMap[char]?.[0] ?? char)
    .join("");
}

function decode(value: string, emojiToKanaMap: Record<string, string>) {
  return splitGraphemes(value)
    .map((char) => emojiToKanaMap[char] ?? char)
    .join("");
}

function App() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("こんにちは");
  const emojiToKanaMap = useMemo(buildEmojiToKanaMap, []);
  const output = mode === "encode" ? encode(input) : decode(input, emojiToKanaMap);
  const filledCount = Object.values(kanaEmojiMap).filter((emojis) => emojis.length > 0).length;

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  }

  return (
    <main className="app">
      <section className="tool">
        <header className="hero">
          <div className="brand">
            <span className="brandMark">
              <Sparkles size={22} strokeWidth={2.4} />
            </span>
            <span>メン地下文字列コンバーター</span>
          </div>
        </header>

        <div className="converter" aria-label="変換ツール">
          <div className="toolbar">
            <div className="segmented" aria-label="変換モード">
              <button className={mode === "encode" ? "active" : ""} onClick={() => setMode("encode")}>
                ひらがな → 絵文字
              </button>
              <button className={mode === "decode" ? "active" : ""} onClick={() => setMode("decode")}>
                絵文字 → ひらがな
              </button>
            </div>
            <button className="iconButton" onClick={() => setMode(mode === "encode" ? "decode" : "encode")} title="変換方向を切り替え">
              <ArrowDownUp size={18} />
            </button>
          </div>

          <div className="panes">
            <label className="pane">
              <span>{mode === "encode" ? "ひらがな" : "絵文字"}</span>
              <textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} />
            </label>
            <label className="pane outputPane">
              <span>{mode === "encode" ? "絵文字" : "ひらがな"}</span>
              <textarea value={output} readOnly spellCheck={false} />
            </label>
          </div>

          <div className="actions">
            <button onClick={copyOutput}>
              <Clipboard size={17} />
              コピー
            </button>
            <button className="secondary" onClick={() => setInput("")}>
              <Trash2 size={17} />
              クリア
            </button>
          </div>
        </div>
      </section>

      <aside className="mapping">
        <div>
          <h2>対応表</h2>
          <p>
            <strong>{filledCount}</strong> / {Object.keys(kanaEmojiMap).length} 文字が入力済み
          </p>
        </div>
        <div className="mappingGrid">
          {Object.entries(kanaEmojiMap).map(([kana, emojis]) => (
            <div className="mappingItem" key={kana}>
              <span className="kana">{kana}</span>
              <span className={emojis.length ? "emoji" : "empty"}>{emojis.join(" ") || "[]"}</span>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
