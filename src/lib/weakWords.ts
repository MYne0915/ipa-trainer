import type { WeakWord } from "../types";

const KEY = "ipa-trainer:weak-words";

export function loadWeakWords(): WeakWord[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WeakWord[];
    // symbolsフィールド追加前に登録された既存データを補完する
    return parsed.map((w) => ({ ...w, symbols: w.symbols ?? [] }));
  } catch {
    return [];
  }
}

function saveWeakWords(words: WeakWord[]) {
  localStorage.setItem(KEY, JSON.stringify(words));
}

export function addWeakWord(word: string, symbols: string[], note?: string): WeakWord[] {
  const trimmed = word.trim();
  if (!trimmed) return loadWeakWords();
  const words = loadWeakWords();
  words.unshift({
    id: crypto.randomUUID(),
    word: trimmed,
    note: note?.trim() || undefined,
    symbols,
    addedAt: new Date().toISOString(),
  });
  saveWeakWords(words);
  return words;
}

export function updateWeakWord(
  id: string,
  word: string,
  symbols: string[],
  note?: string,
): WeakWord[] {
  const trimmed = word.trim();
  if (!trimmed) return loadWeakWords();
  const words = loadWeakWords().map((w) =>
    w.id === id ? { ...w, word: trimmed, note: note?.trim() || undefined, symbols } : w,
  );
  saveWeakWords(words);
  return words;
}

export function removeWeakWord(id: string): WeakWord[] {
  const words = loadWeakWords().filter((w) => w.id !== id);
  saveWeakWords(words);
  return words;
}
