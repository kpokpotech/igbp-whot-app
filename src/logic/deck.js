import { SUITS, IGBO_NUMBERS, slugify } from "./igbo";

// Per your spec (totals in comments):
// Eke: 1–14 excluding 9  (13)
// Orie: 1–14 excluding 6,9 (12)
// Afọr: 1–14 excluding 6,9 (12)
// Nkwọ: 1–14 excluding 4,6,9,12 (10)
// Ịse: 1,2,3,4,5,7,8 only (7)
// Onye Nkụzi: five cards, number "iri abụọ" (20) (5)
// TOTAL = 59

const WORDS_BY_NUM = {
  1: "otu",
  2: "abụọ",
  3: "atọ",
  4: "anọ",
  5: "ịse",
  6: "isii",
  7: "asaa",
  8: "asatọ",
  10: "iri",
  11: "iri na otu",
  12: "iri na abụọ",
  13: "iri na atọ",
  14: "iri na anọ",
};

function numbersRange(min, max, exclude = []) {
  const set = new Set(exclude);
  const out = [];
  for (let n = min; n <= max; n++) {
    if (n === 9) continue; // 9 doesn't have a word in your mapping and is often removed
    if (!set.has(n)) out.push(n);
  }
  return out;
}

function toNumberWords(nums) {
  return nums.map(n => WORDS_BY_NUM[n]).filter(Boolean);
}

function assetPath(suitWord, numberWord, index = null) {
  // Example asset name: assets/cards/eke_iri_na_ano.png
  // Whot variants can be indexed if you have 5 distinct images
  const suitSlug = slugify(suitWord);
  const numSlug = slugify(numberWord);
  const base = `/assets/cards/${suitSlug}_${numSlug}`;
  return index ? `${base}_${index}.png` : `${base}.png`;
}

export function buildDeck() {
  const deck = [];

  // Eke 13 (exclude 9)
  toNumberWords(numbersRange(1, 14, [])).forEach(num =>
    deck.push({ suit: SUITS.EKE, number: num, asset: assetPath(SUITS.EKE, num) })
  );

  // Orie 12 (exclude 6,9)
  toNumberWords(numbersRange(1, 14, [6])).forEach(num =>
    deck.push({ suit: SUITS.ORIE, number: num, asset: assetPath(SUITS.ORIE, num) })
  );

  // Afọr 12 (exclude 6,9)
  toNumberWords(numbersRange(1, 14, [6])).forEach(num =>
    deck.push({ suit: SUITS.AFOR, number: num, asset: assetPath(SUITS.AFOR, num) })
  );

  // Nkwọ 10 (exclude 4,6,9,12)
  toNumberWords(numbersRange(1, 14, [4, 6, 12])).forEach(num =>
    deck.push({ suit: SUITS.NKWO, number: num, asset: assetPath(SUITS.NKWO, num) })
  );

  // Ịse 7 (1,2,3,4,5,7,8)
  [1,2,3,4,5,7,8].map(n => WORDS_BY_NUM[n]).forEach(num =>
    deck.push({ suit: SUITS.ISE, number: num, asset: assetPath(SUITS.ISE, num) })
  );

  // Onye Nkụzi ×5 (iri abụọ) — optional index 1..5 if files are distinct
  for (let i = 1; i <= 5; i++) {
    const num = "iri abụọ";
    deck.push({
      suit: SUITS.ONYENKUZi,
      number: num,
      asset: assetPath(SUITS.ONYENKUZi, num, i) // or omit index if 1 file reused
    });
  }

  // Sanity
  if (deck.length !== 59) {
    console.warn("Deck size ≠ 59, got:", deck.length);
  }

  return deck;
}

export function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}