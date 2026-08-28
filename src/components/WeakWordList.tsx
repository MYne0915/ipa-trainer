import { useState } from "react";
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

  const handleAdd = () => {
    if (!word.trim()) return;
    const updated = addWeakWord(word, note);
    onChange(updated);
    setWord("");
    setNote("");
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
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
