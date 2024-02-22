import listEmojis from '../resources/emoji-data.json';

interface EmojisData {
  [emoji: string]: {
    // name
    n: string;
    // sentiment
    s?: string;
  };
}

/** Emojis database */
export class Emojis {
  private data: EmojisData;
  constructor() {
    this.data = listEmojis;
  }

  /** Returns the name of an emoji e.g. 💓 → "beating heart" */
  public getName(emoji: string): string {
    return this.data[emoji] ? this.data[emoji].n : emoji;
  }

  /** Returns the sentiment of an emoji. e.g. 😡 → negative, ❤ → positive, 🟪 → 0. Always [-1, 1] */
  public getSentiment(emoji: string): number {
    return this.data[emoji] && this.data[emoji].s ? parseFloat(this.data[emoji].s!) || 0 : 0;
  }
}
