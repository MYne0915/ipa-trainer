import { useState } from "react";
import { PHONEMES } from "../data/phonemes";
import { speak } from "../lib/speech";
import { addWeakWord, removeWeakWord } from "../lib/weakWords";
import type { WeakWord } from "../types";

type Props = {
  words: WeakWord[];
  onChange: (words: WeakWord[]) => void;
};

export function WeakWordList({ words, onChange }: Props) {
  const [word, setWord] = useState("");
  const [note, setNote] = useState("");
  const [symbols, setSymbols] = useState<string[]>([]);

  const toggleSymbol = (symbol: string) => {
    setSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol],
    );
  };

  const handleAdd = () => {
    if (!word.trim()) return;
    const updated = addWeakWord(word, symbols, note);
    onChange(updated);
    setWord("");
    setNote("");
    setSymbols([]);
  };

  return (
    <div className="screen">
      <section className="phoneme-group">
        <h2>苦手な単語を登録</h2>
        <div className="word-form">
          <input
            type="text"
            placeholder="単語(例: comfortable)"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <input
            type="text"
            placeholder="メモ(任意)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />

          <p className="word-form__label">
            関連する発音記号(任意、複数選択可。発音練習で単語と一緒に出題されます)
          </p>
          <div className="word-form__symbols">
            {PHONEMES.map((p) => (
              <button
                key={p.symbol}
                type="button"
                className={`symbol-chip${symbols.includes(p.symbol) ? " symbol-chip--selected" : ""}`}
                onClick={() => toggleSymbol(p.symbol)}
              >
                {p.symbol}
              </button>
            ))}
          </div>

          <button type="button" className="primary-button" onClick={handleAdd}>
            追加
          </button>
        </div>
      </section>

      <section className="phoneme-group">
        <h2>登録した単語({words.length})</h2>
        {words.length === 0 && <p className="empty-hint">まだ登録がありません</p>}
        <ul className="word-list">
          {words.map((w) => (
            <li key={w.id} className="word-list__item">
              <div className="word-list__row">
                <button type="button" className="word-list__play" onClick={() => speak(w.word)}>
                  🔊 {w.word}
                </button>
                {w.note && <span className="word-list__note">{w.note}</span>}
                <button
                  type="button"
                  className="word-list__delete"
                  aria-label="削除"
                  onClick={() => onChange(removeWeakWord(w.id))}
                >
                  ✕
                </button>
              </div>
              {w.symbols.length > 0 && (
                <div className="word-list__symbols">
                  {w.symbols.map((s) => (
                    <span key={s} className="symbol-badge">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
