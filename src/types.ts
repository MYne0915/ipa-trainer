export type PhonemeCategory = "consonant" | "vowel";

export type Phoneme = {
  /** IPA記号 */
  symbol: string;
  category: PhonemeCategory;
  /** 発音の手本として読み上げる例単語(先頭が音声再生のデフォルト) */
  examples: string[];
  /** 口の形・舌の位置のヒント(日本語) */
  tip: string;
};

export type ProgressStat = {
  seen: number;
  correct: number;
};

export type ProgressMap = Record<string, ProgressStat>;

export type WeakWord = {
  id: string;
  word: string;
  /** メモ(発音のポイントなど、任意) */
  note?: string;
  /** 関連するIPA記号(任意、複数可)。発音練習でこの単語と記号の音をセットで出題する */
  symbols: string[];
  addedAt: string;
};
