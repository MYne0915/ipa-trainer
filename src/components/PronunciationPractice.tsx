import { useRef, useState } from "react";
import { PHONEMES } from "../data/phonemes";
import { speak } from "../lib/speech";
import { recordAnswer } from "../lib/progress";
import type { Phoneme, ProgressMap, WeakWord } from "../types";

type Props = {
  weakWords: WeakWord[];
  onRated: (map: ProgressMap) => void;
};

type PracticeItem = {
  phoneme: Phoneme;
  example: string;
  weakWord?: WeakWord;
};

function buildPool(weakWords: WeakWord[]): PracticeItem[] {
  const base: PracticeItem[] = PHONEMES.map((phoneme) => ({ phoneme, example: "" }));
  const linked: PracticeItem[] = weakWords.flatMap((weakWord) =>
    weakWord.symbols
      .map((symbol) => PHONEMES.find((p) => p.symbol === symbol))
      .filter((p): p is Phoneme => !!p)
      .map((phoneme) => ({ phoneme, example: "", weakWord })),
  );
  return [...base, ...linked];
}

function pickItem(pool: PracticeItem[]): PracticeItem {
  const item = pool[Math.floor(Math.random() * pool.length)];
  const example = item.phoneme.examples[Math.floor(Math.random() * item.phoneme.examples.length)];
  return { ...item, example };
}

export function PronunciationPractice({ weakWords, onRated }: Props) {
  const [current, setCurrent] = useState(() => pickItem(buildPool(weakWords)));
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [tally, setTally] = useState({ ok: 0, total: 0 });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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

  const next = () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl(null);
    setIsRecording(false);
    setMicError(null);
    setCurrent(pickItem(buildPool(weakWords)));
  };

  const rate = (wasGood: boolean) => {
    const map = recordAnswer(current.phoneme.symbol, wasGood);
    onRated(map);
    setTally((t) => ({ ok: t.ok + (wasGood ? 1 : 0), total: t.total + 1 }));
    next();
  };

  return (
    <div className="screen practice">
      <p className="practice__score">できた {tally.ok} / {tally.total}</p>

      <div className="practice__prompt">
        <span className="practice__symbol">{current.phoneme.symbol}</span>
        <p className="practice__tip">{current.phoneme.tip}</p>
        <button type="button" className="chip" onClick={() => speak(current.example)}>
          🔊 単体の音を聞く({current.example})
        </button>
        {current.weakWord && (
          <div className="practice__weak-word">
            <p className="practice__hint">この記号を含む苦手単語</p>
            <button
              type="button"
              className="chip chip--accent"
              onClick={() => speak(current.weakWord!.word)}
            >
              🔊 単語の音を聞く({current.weakWord.word})
            </button>
            {current.weakWord.note && <p className="practice__note">{current.weakWord.note}</p>}
          </div>
        )}
      </div>

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

      <button type="button" className="practice__skip" onClick={next}>
        次の記号へ
      </button>
    </div>
  );
}
