import type { WeakWord } from "../types";

const KEY = "ipa-trainer:weak-words";

export function loadWeakWords(): WeakWord[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as WeakWord[]) : [];
  } catch {
    return [];
  }
}

function saveWeakWords(words: WeakWord[]) {
  localStorage.setItem(KEY, JSON.stringify(words));
}

export function addWeakWord(word: string, note?: string): WeakWord[] {
  const trimmed = word.trim();
  if (!trimmed) return loadWeakWords();
  const words = loadWeakWords();
  words.unshift({
    id: crypto.randomUUID(),
    word: trimmed,
    note: note?.trim() || undefined,
    addedAt: new Date().toISOString(),
  });
  saveWeakWords(words);
  return words;
}

export function removeWeakWord(id: string): WeakWord[] {
  const words = loadWeakWords().filter((w) => w.id !== id);
  saveWeakWords(words);
  return words;
}
