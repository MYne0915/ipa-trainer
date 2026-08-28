import type { Phoneme } from "../types";

// アメリカ英語の発音記号(IPA)一式。子音24個+母音16個。
// 例単語はブラウザのspeechSynthesis(en-US)で読み上げる前提で選定。
export const PHONEMES: Phoneme[] = [
  // --- 子音 ---
  { symbol: "p", category: "consonant", examples: ["pen", "cup"], tip: "唇を閉じて息を破裂させる無声音" },
  { symbol: "b", category: "consonant", examples: ["bat", "cab"], tip: "唇を閉じて息を破裂させる有声音(声帯が震える)" },
  { symbol: "t", category: "consonant", examples: ["tea", "cat"], tip: "舌先を歯茎につけて破裂させる無声音" },
  { symbol: "d", category: "consonant", examples: ["dog", "red"], tip: "舌先を歯茎につけて破裂させる有声音" },
  { symbol: "k", category: "consonant", examples: ["cat", "back"], tip: "奥舌を上げて破裂させる無声音" },
  { symbol: "g", category: "consonant", examples: ["go", "bag"], tip: "奥舌を上げて破裂させる有声音" },
  { symbol: "f", category: "consonant", examples: ["fan", "leaf"], tip: "上の前歯を下唇に当てて息を摩擦させる無声音" },
  { symbol: "v", category: "consonant", examples: ["van", "love"], tip: "上の前歯を下唇に当てて息を摩擦させる有声音" },
  { symbol: "θ", category: "consonant", examples: ["think", "bath"], tip: "舌先を上下の歯で軽く挟む無声音(日本語にない音)" },
  { symbol: "ð", category: "consonant", examples: ["this", "mother"], tip: "舌先を上下の歯で軽く挟む有声音(日本語にない音)" },
  { symbol: "s", category: "consonant", examples: ["see", "bus"], tip: "舌先を歯茎に近づけて摩擦させる無声音" },
  { symbol: "z", category: "consonant", examples: ["zoo", "buzz"], tip: "舌先を歯茎に近づけて摩擦させる有声音" },
  { symbol: "ʃ", category: "consonant", examples: ["she", "wish"], tip: "唇をすぼめて出す「シュ」に近い無声音" },
  { symbol: "ʒ", category: "consonant", examples: ["vision", "measure"], tip: "唇をすぼめて出す「シュ」に近い有声音" },
  { symbol: "h", category: "consonant", examples: ["hat", "house"], tip: "喉の奥から息を出すだけの無声音" },
  { symbol: "tʃ", category: "consonant", examples: ["chair", "watch"], tip: "tとʃを続けて出す破擦音" },
  { symbol: "dʒ", category: "consonant", examples: ["job", "bridge"], tip: "dとʒを続けて出す破擦音" },
  { symbol: "m", category: "consonant", examples: ["man", "sum"], tip: "唇を閉じて息を鼻に抜く音" },
  { symbol: "n", category: "consonant", examples: ["no", "sun"], tip: "舌先を歯茎につけて息を鼻に抜く音" },
  { symbol: "ŋ", category: "consonant", examples: ["sing", "long"], tip: "奥舌を上げて息を鼻に抜く「ング」の音" },
  { symbol: "l", category: "consonant", examples: ["light", "ball"], tip: "舌先を歯茎につけ、舌の両脇から息を流す(日本語のラ行と別音)" },
  { symbol: "r", category: "consonant", examples: ["red", "car"], tip: "舌をどこにも触れさせず丸める(日本語のラ行と別音、lとの区別が重要)" },
  { symbol: "w", category: "consonant", examples: ["we", "away"], tip: "唇を丸めて突き出してから発音する" },
  { symbol: "j", category: "consonant", examples: ["yes", "yellow"], tip: "舌を上あごに近づける、日本語のヤ行に近い音" },

  // --- 母音 ---
  { symbol: "iː", category: "vowel", examples: ["see", "eat"], tip: "唇を横に引いて長く伸ばす「イー」" },
  { symbol: "ɪ", category: "vowel", examples: ["sit", "bit"], tip: "力を抜いた短い「イ」" },
  { symbol: "eɪ", category: "vowel", examples: ["day", "name"], tip: "「エ」から「イ」へ動く二重母音" },
  { symbol: "ɛ", category: "vowel", examples: ["bed", "get"], tip: "日本語の「エ」に近い短母音" },
  { symbol: "æ", category: "vowel", examples: ["cat", "hat"], tip: "口を大きく開けた「ア」と「エ」の中間の音" },
  { symbol: "ɑː", category: "vowel", examples: ["father", "box"], tip: "口を大きく開けて出す奥のほうの長い「アー」" },
  { symbol: "ʌ", category: "vowel", examples: ["cup", "love"], tip: "力を抜いた短い「ア」" },
  { symbol: "ɔː", category: "vowel", examples: ["law", "all"], tip: "唇を丸めて出す長い「オー」" },
  { symbol: "oʊ", category: "vowel", examples: ["go", "home"], tip: "「オ」から「ウ」へ動く二重母音" },
  { symbol: "ʊ", category: "vowel", examples: ["book", "put"], tip: "力を抜いた短い「ウ」" },
  { symbol: "uː", category: "vowel", examples: ["food", "blue"], tip: "唇を丸めて出す長い「ウー」" },
  { symbol: "aɪ", category: "vowel", examples: ["my", "time"], tip: "「ア」から「イ」へ動く二重母音" },
  { symbol: "aʊ", category: "vowel", examples: ["now", "house"], tip: "「ア」から「ウ」へ動く二重母音" },
  { symbol: "ɔɪ", category: "vowel", examples: ["boy", "choice"], tip: "「オ」から「イ」へ動く二重母音" },
  { symbol: "ə", category: "vowel", examples: ["about", "sofa"], tip: "力を完全に抜いた曖昧母音(シュワ)。英語で最も頻出する母音" },
  { symbol: "ɝː", category: "vowel", examples: ["bird", "her"], tip: "舌を丸めて出すr性母音(アメリカ英語特有)" },
];
