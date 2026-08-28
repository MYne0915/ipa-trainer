import { useState } from "react";
import { PHONEMES } from "../data/phonemes";
import { speak } from "../lib/speech";
import { needsPractice } from "../lib/progress";
import type { ProgressMap } from "../types";

type Props = {
  progress: ProgressMap;
};

export function PhonemeList({ progress }: Props) {
  const [openSymbol, setOpenSymbol] = useState<string | null>(null);

  const consonants = PHONEMES.filter((p) => p.category === "consonant");
  const vowels = PHONEMES.filter((p) => p.category === "vowel");

  const renderGroup = (title: string, items: typeof PHONEMES) => (
    <section className="phoneme-group">
      <h2>{title}</h2>
      <div className="phoneme-grid">
        {items.map((p) => {
          const isOpen = openSymbol === p.symbol;
          const flagged = needsPractice(progress, p.symbol);
          return (
            <div key={p.symbol} className={`phoneme-card${isOpen ? " phoneme-card--open" : ""}`}>
              <button
                type="button"
                className="phoneme-card__main"
                onClick={() => {
                  setOpenSymbol(isOpen ? null : p.symbol);
                  speak(p.examples[0]);
                }}
              >
                <span className="phoneme-card__symbol">
                  {p.symbol}
                  {flagged && <span className="phoneme-card__badge" title="苦手(正答率50%未満)">⚠</span>}
                </span>
                <span className="phoneme-card__examples">{p.examples.join(" / ")}</span>
              </button>
              {isOpen && (
                <div className="phoneme-card__detail">
                  <p>{p.tip}</p>
                  <div className="phoneme-card__play-row">
                    {p.examples.map((ex) => (
                      <button key={ex} type="button" className="chip" onClick={() => speak(ex)}>
                        🔊 {ex}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="screen">
      {renderGroup("子音", consonants)}
      {renderGroup("母音", vowels)}
    </div>
  );
}
