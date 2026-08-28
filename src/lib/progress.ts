import type { ProgressMap } from "../types";

const KEY = "ipa-trainer:progress";

export function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function saveProgress(map: ProgressMap) {
  localStorage.setItem(KEY, JSON.stringify(map));
}

export function recordAnswer(symbol: string, wasCorrect: boolean): ProgressMap {
  const map = loadProgress();
  const stat = map[symbol] ?? { seen: 0, correct: 0 };
  stat.seen += 1;
  if (wasCorrect) stat.correct += 1;
  map[symbol] = stat;
  saveProgress(map);
  return map;
}

/** 誤答が多く復習が必要な記号かどうか(2回以上出題され、正答率50%未満) */
export function needsPractice(map: ProgressMap, symbol: string): boolean {
  const stat = map[symbol];
  if (!stat || stat.seen < 2) return false;
  return stat.correct / stat.seen < 0.5;
}
