let voicesReady: SpeechSynthesisVoice[] = [];

function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  voicesReady = window.speechSynthesis.getVoices();
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  return (
    voicesReady.find((v) => v.lang === "en-US") ??
    voicesReady.find((v) => v.lang.startsWith("en"))
  );
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, rate = 0.85) {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = rate;
  const voice = pickVoice();
  if (voice) utter.voice = voice;
  window.speechSynthesis.speak(utter);
}
