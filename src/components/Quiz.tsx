import { useState } from "react";
import { PHONEMES } from "../data/phonemes";
import { speak } from "../lib/speech";
import { recordAnswer } from "../lib/progress";
import type { Phoneme, ProgressMap } from "../types";

type Props = {
  onAnswered: (map: ProgressMap) => void;
};

function pickQuestion(): { answer: Phoneme; choices: Phoneme[]; example: string } {
  const answer = PHONEMES[Math.floor(Math.random() * PHONEMES.length)];
  const example = answer.examples[Math.floor(Math.random() * answer.examples.length)];
  const pool = PHONEMES.filter((p) => p.symbol !== answer.symbol);
  const distractors: Phoneme[] = [];
  const poolCopy = [...pool];
  while (distractors.length < 3 && poolCopy.length > 0) {
    const idx = Math.floor(Math.random() * poolCopy.length);
    distractors.push(poolCopy.splice(idx, 1)[0]);
  }
  const choices = [answer, ...distractors].sort(() => Math.random() - 0.5);
  return { answer, choices, example };
}

export function Quiz({ onAnswered }: Props) {
  const [question, setQuestion] = useState(() => pickQuestion());
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { example } = question;

  const handleChoice = (symbol: string) => {
    if (selected) return;
    setSelected(symbol);
    const wasCorrect = symbol === question.answer.symbol;
    setScore((s) => ({ correct: s.correct + (wasCorrect ? 1 : 0), total: s.total + 1 }));
    const map = recordAnswer(question.answer.symbol, wasCorrect);
    onAnswered(map);
  };

  const next = () => {
    setSelected(null);
    setQuestion(pickQuestion());
  };

  return (
    <div className="screen quiz">
      <p className="quiz__score">正解 {score.correct} / {score.total}</p>

      <div className="quiz__play">
        <button type="button" className="quiz__play-button" onClick={() => speak(example)}>
          🔊 音声を聞く
        </button>
        <p className="quiz__hint">聞こえた発音記号を選んでください</p>
      </div>

      <div className="quiz__choices">
        {question.choices.map((c) => {
          const isAnswer = c.symbol === question.answer.symbol;
          const isSelected = c.symbol === selected;
          let cls = "quiz__choice";
          if (selected) {
            if (isAnswer) cls += " quiz__choice--correct";
            else if (isSelected) cls += " quiz__choice--wrong";
          }
          return (
            <button
              key={c.symbol}
              type="button"
              className={cls}
              onClick={() => handleChoice(c.symbol)}
              disabled={!!selected}
            >
              {c.symbol}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="quiz__result">
          <p>
            正解: <strong>{question.answer.symbol}</strong>({example}) — {question.answer.tip}
          </p>
          <button type="button" className="primary-button" onClick={next}>
            次の問題へ
          </button>
        </div>
      )}
    </div>
  );
}
