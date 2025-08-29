import {
  SUITS, isPickTwo, isHoldOn, isGeneralMarket, isWhot, numberValue
} from "./igbo";
import { buildDeck, shuffle } from "./deck";

// A minimal turn-based engine for 1 human vs 1 bot.
export class Game {
  constructor({ difficulty, onNyemRequest } = {}) {
    this.difficulty = difficulty; // string from LEVELS
    this.onNyemRequest = onNyemRequest; // async function to ask for suit when Whot is played

    this.reset();
  }

  reset() {
    this.drawPile = shuffle(buildDeck());
    this.discardPile = [];
    this.hands = {
      player: [],
      bot: [],
    };
    this.pendingPick = 0; // for "abụọ" effect
    this.calledSuit = null; // from nyem (whot call)
    this.turn = "player";

    for (let i = 0; i < 5; i++) {
      this.hands.player.push(this.drawCard());
      this.hands.bot.push(this.drawCard());
    }
    // Start pile
    this.discardPile.push(this.drawCard());
  }

  topCard() {
    return this.discardPile[this.discardPile.length - 1];
  }

  drawCard() {
    if (this.drawPile.length === 0) {
      // recycle discard except top
      const top = this.discardPile.pop();
      this.drawPile = shuffle(this.discardPile);
      this.discardPile = [top];
    }
    return this.drawPile.pop();
  }

  // Matching rules:
  // - same suit OR same number
  // - any Whot (Onye Nkụzi) always playable
  // - if a "nyem" suit has been called, only cards of that suit or another Whot match (until satisfied)
  canPlay(card) {
    if (isWhot(card.suit)) return true;
    const top = this.topCard();

    if (this.calledSuit) {
      return card.suit === this.calledSuit || isWhot(card.suit);
    }

    return card.suit === top.suit || card.number === top.number;
  }

  async playCard(side, card, chosenSuitIfWhot = null) {
    const hand = this.hands[side];
    const idx = hand.findIndex(c => c === card);
    if (idx < 0) throw new Error("Card not in hand");
    if (!this.canPlay(card)) throw new Error("Enweghị ntụnyere maka kaadị a (cannot play this card)");

    // place
    hand.splice(idx, 1);
    this.discardPile.push(card);

    // clear any previous calledSuit unless we’re continuing a called state
    this.calledSuit = null;

    // Special effects
    if (isHoldOn(card.number)) {
      // Skip opponent's next turn (effect: keep turn with same side)
      // no-op here: we just won't toggle turn below
    } else if (isPickTwo(card.number)) {
      // Opponent draws 2 and misses turn
      this.pendingPick += 2;
    } else if (isGeneralMarket(card.number)) {
      // Everyone picks 1 — in 1v1, just opponent draws 1
      this.pendingPick = Math.max(this.pendingPick, 1);
    } else if (isWhot(card.suit)) {
      // Nyem: caller chooses suit
      let suit = chosenSuitIfWhot;
      if (!suit && this.onNyemRequest) {
        // Ask UI to choose suit (await a promise)
        suit = await this.onNyemRequest(side);
      }
      if (!suit) throw new Error("A họrọghị uwe (no suit chosen) for Nyem");
      this.calledSuit = suit;
    }

    // End turn handling
    if (isHoldOn(card.number)) {
      // same side plays again, do nothing
    } else {
      this._endTurn();
    }
  }

  _endTurn() {
    // Apply pending draws to the next side to act
    const next = this.turn === "player" ? "bot" : "player";
    if (this.pendingPick > 0) {
      for (let i = 0; i < this.pendingPick; i++) {
        this.hands[next].push(this.drawCard());
      }
      this.pendingPick = 0;
      // That side loses their action (they just drew), so turn flips back
      this.turn = next === "player" ? "bot" : "player";
      return;
    }
    // Normal toggle
    this.turn = next;
  }

  draw(side) {
    const card = this.drawCard();
    this.hands[side].push(card);
    this._endTurn();
    return card;
  }

  isGameOver() {
    return this.hands.player.length === 0 || this.hands.bot.length === 0;
  }

  winner() {
    if (!this.isGameOver()) return null;
    return this.hands.player.length === 0 ? "player" : "bot";
  }

  scoreHand(side) {
    // Sum values; all Ịse are ×2 handled in numberValue()
    return this.hands[side].reduce((sum, c) => sum + numberValue(c.number, c.suit), 0);
  }
}