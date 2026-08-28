import { useRef, useState } from "react";
import { PHONEMES } from "../data/phonemes";
import { speak } from "../lib/speech";
import { recordAnswer } from "../lib/progress";
import type { Phoneme, ProgressMap, WeakWord } from "../types";

type Props = {
  weakWords: WeakWord[];
  onRated: (map: ProgressMap) => void;
};

type QueueWord = {
  word: string;
  note?: string;
  isRegistered: boolean;
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQueue(phoneme: Phoneme, weakWords: WeakWord[]): QueueWord[] {
  const linked = weakWords.filter((w) => w.symbols.includes(phoneme.symbol));
  if (linked.length > 0) {
    return shuffle(linked.map((w) => ({ word: w.word, note: w.note, isRegistered: true })));
  }
  return shuffle(phoneme.examples.map((ex) => ({ word: ex, isRegistered: false })));
}

export function PronunciationPractice({ weakWords, onRated }: Props) {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueWord[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const phoneme = selectedSymbol ? (PHONEMES.find((p) => p.symbol === selectedSymbol) ?? null) : null;
  const currentWord = queue.length > 0 ? queue[wordIndex % queue.length] : null;

  const resetRecording = () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl(null);
    setIsRecording(false);
    setMicError(null);
  };

  const selectSymbol = (symbol: string) => {
    const nextPhoneme = PHONEMES.find((p) => p.symbol === symbol);
    if (!nextPhoneme) return;
    resetRecording();
    setSelectedSymbol(symbol);
    setQueue(buildQueue(nextPhoneme, weakWords));
    setWordIndex(0);
  };

  const nextWord = () => {
    resetRecording();
    setWordIndex((i) => i + 1);
  };

  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        setRecordedUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setMicError("マイクを使用できませんでした。ブラウザの設定でマイクへのアクセスを許可してください。");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const rate = (wasGood: boolean) => {
    if (!phoneme) return;
    const map = recordAnswer(phoneme.symbol, wasGood);
    onRated(map);
    nextWord();
  };

  return (
    <div className="screen practice">
      <section className="phoneme-group">
        <h2>練習する発音記号を選ぶ</h2>
        <div className="practice__symbol-picker">
          {PHONEMES.map((p) => (
            <button
              key={p.symbol}
              type="button"
              className={`symbol-chip${p.symbol === selectedSymbol ? " symbol-chip--selected" : ""}`}
              onClick={() => selectSymbol(p.symbol)}
            >
              {p.symbol}
            </button>
          ))}
        </div>
      </section>

      {!phoneme && <p className="empty-hint">発音記号を選ぶと練習が始まります</p>}

      {phoneme && currentWord && (
        <div className="practice__prompt">
          <span className="practice__symbol">{phoneme.symbol}</span>
          <button type="button" className="chip" onClick={() => speak(currentWord.word)}>
            🔊 {currentWord.word}
          </button>
          {!currentWord.isRegistered && (
            <p className="practice__hint">単語登録がまだないため、例単語を出しています</p>
          )}
          {currentWord.note && <p className="practice__note">{currentWord.note}</p>}

          <div className="practice__record">
            {!isRecording ? (
              <button type="button" className="practice__record-button" onClick={startRecording}>
                🎙 発音を録音する
              </button>
            ) : (
              <button
                type="button"
                className="practice__record-button practice__record-button--active"
                onClick={stopRecording}
              >
                ⏹ 録音を止める
              </button>
            )}
            {micError && <p className="practice__error">{micError}</p>}
          </div>

          {recordedUrl && (
            <div className="practice__playback">
              <button type="button" className="chip" onClick={() => new Audio(recordedUrl).play()}>
                ▶ 自分の発音を聞く
              </button>
              <p className="practice__hint">お手本と聞き比べてどうでしたか</p>
              <div className="practice__rate">
                <button type="button" className="primary-button" onClick={() => rate(true)}>
                  👍 できた
                </button>
                <button type="button" className="secondary-button" onClick={() => rate(false)}>
                  🔁 もう一度練習
                </button>
              </div>
            </div>
          )}

          {queue.length > 1 && (
            <button type="button" className="practice__skip" onClick={nextWord}>
              次の単語へ({wordIndex % queue.length + 1}/{queue.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
