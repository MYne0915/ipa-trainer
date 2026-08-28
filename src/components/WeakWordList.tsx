import { useState } from "react";
import { PHONEMES } from "../data/phonemes";
import { speak } from "../lib/speech";
import { addWeakWord, removeWeakWord, updateWeakWord } from "../lib/weakWords";
import type { WeakWord } from "../types";

type Props = {
  words: WeakWord[];
  onChange: (words: WeakWord[]) => void;
};

export function WeakWordList({ words, onChange }: Props) {
  const [word, setWord] = useState("");
  const [note, setNote] = useState("");
  const [symbols, setSymbols] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleSymbol = (symbol: string) => {
    setSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol],
    );
  };

  const resetForm = () => {
    setWord("");
    setNote("");
    setSymbols([]);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!word.trim()) return;
    const updated = editingId
      ? updateWeakWord(editingId, word, symbols, note)
      : addWeakWord(word, symbols, note);
    onChange(updated);
    resetForm();
  };

  const startEdit = (w: WeakWord) => {
    setWord(w.word);
    setNote(w.note ?? "");
    setSymbols(w.symbols);
    setEditingId(w.id);
  };

  return (
    <div className="screen">
      <section className="phoneme-group">
        <h2>{editingId ? "苦手な単語を編集" : "苦手な単語を登録"}</h2>
        <div className="word-form">
          <input
            type="text"
            placeholder="単語(例: comfortable)"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <input
            type="text"
            placeholder="メモ(発音記号など任意)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          <p className="word-form__label">
            発音記号を選択(複数可。発音練習で単語と一緒に出題されます)
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

          <div className="word-form__actions">
            <button type="button" className="primary-button" onClick={handleSubmit}>
              {editingId ? "更新" : "追加"}
            </button>
            {editingId && (
              <button type="button" className="secondary-button" onClick={resetForm}>
                キャンセル
              </button>
            )}
          </div>
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
                <button type="button" className="word-list__edit" onClick={() => startEdit(w)}>
                  編集
                </button>
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
