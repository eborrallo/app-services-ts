import { Emojis } from './Emojis';
import { normalizeText } from '../helpers/Text';
import { Token, tokenize } from '../helpers/Tokenizer';
import { FastTextLID176Model } from './FastTextModel';

export class MessageProcessor {
  private langPredictModel?: FastTextLID176Model;

  async init() {
    this.langPredictModel = await FastTextLID176Model.load();
    return this;
  }
  process(rawMsg: string) {
    const tokenizations: Token[] = tokenize(normalizeText(rawMsg));
    const allText = tokenizations
      .filter(token => token.tag === 'word')
      .map(token => token.text)
      .join(' ')
      .toLowerCase();

    let lang: { iso639?: string; accuracy?: number } = { iso639: undefined, accuracy: undefined };
    if (allText.length > 0) {
      const { iso639, accuracy } = this.langPredictModel!.identifyLanguage(allText);
      lang = { iso639, accuracy };
    }
    //TODO detect also mails
    const words = [];
    const emojis = [];
    const customEmojis = [];
    const mentions = [];
    const urls = [];
    const _emojis = new Emojis();
    for (const { tag, text } of tokenizations) {
      try {
        switch (tag) {
          case 'word':
            words.push(text);
            break;
          case 'emoji':
            emojis.push({
              type: 'unicode',
              symbol: normalizeText(text),
              text,
              name: _emojis.getName(normalizeText(text))
            });
            break;
          case 'custom-emoji':
            customEmojis.push({ type: 'custom', name: text });
            break;
          case 'mention':
            mentions.push(text);
            break;
          case 'url':
            urls.push(new URL(text).hostname.toLowerCase());
            break;
        }
      } catch (e) {
        console.error(`Error on Process message: ${rawMsg}`);
        console.error(e);
      }
    }

    return { words, emojis, customEmojis, mentions, urls, lang };
  }
}
