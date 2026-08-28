import { useState } from "react";
import "./App.css";
import { TabBar, type TabKey } from "./components/TabBar";
import { PhonemeList } from "./components/PhonemeList";
import { PronunciationPractice } from "./components/PronunciationPractice";
import { WeakWordList } from "./components/WeakWordList";
import { loadProgress } from "./lib/progress";
import { loadWeakWords } from "./lib/weakWords";
import type { ProgressMap, WeakWord } from "./types";

function App() {
  const [tab, setTab] = useState<TabKey>("list");
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());
  const [weakWords, setWeakWords] = useState<WeakWord[]>(() => loadWeakWords());

  return (
    <div className="app">
      <header className="app-header">
        <h1>IPA Trainer</h1>
      </header>

      <main className="app-main">
        {tab === "list" && <PhonemeList progress={progress} />}
        {tab === "quiz" && <PronunciationPractice weakWords={weakWords} onRated={setProgress} />}
        {tab === "words" && <WeakWordList words={weakWords} onChange={setWeakWords} />}
      </main>

      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}

export default App;
