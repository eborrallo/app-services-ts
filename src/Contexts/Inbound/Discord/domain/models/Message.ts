import { AggregateRoot } from '../../../../Shared/domain/AggregateRoot';
export type ContentProps = {
  words: string[];
  emojis: {
    type: string;
    symbol: string;
    text: string;
    name: string;
  }[];
  customEmojis: {
    type: string;
    name: string;
  }[];
  mentions: string[];
  urls: string[];
  lang: {
    iso639?: string | undefined;
    accuracy?: number | undefined;
  };
};

export class Message extends AggregateRoot {
  constructor(
    readonly id: string,
    readonly type: string,
    readonly timestamp: Date,
    readonly timestampEdited: Date | null,
    readonly isPinned: boolean,
    readonly rawContent: string,
    readonly author: {
      id: string;
      name: string;
      discriminator: string;
      nickname: string | null;
      color: string | null;
      isBot: boolean;
      avatarUrl: string | null;
    },
    readonly attachments: {
      id: string;
      url: string;
      fileName: string;
      fileSizeBytes: number;
    }[],
    readonly embeds: any[],
    readonly stickers: {
      id: string;
      name: string;
      format: string; // StickerFormatType
      type: string; // StickerType
      sourceUrl: string | undefined;
    }[],
    readonly reactions: {
      emoji: {
        id: string | null;
        name: string;
        isAnimated: boolean;
        imageUrl: string;
      };
      count: number;
    }[],
    readonly mentions: {
      id: string;
      name: string;
      discriminator: string;
      nickname: string | null;
      isBot: boolean;
    }[],
    public content?: ContentProps
  ) {
    super();
  }

  addContentProps(content: ContentProps) {
    this.content = content;
  }
  static fromPrimitives(plainData: Partial<Message>): Message {
    return new Message(
      plainData.id!,
      plainData.type!,
      plainData.timestamp!,
      plainData.timestampEdited!,
      plainData.isPinned!,
      plainData.rawContent!,
      plainData.author!,
      plainData.attachments!,
      plainData.embeds!,
      plainData.stickers!,
      plainData.reactions!,
      plainData.mentions!,
      plainData.content
    );
  }

  toPrimitives(): any {
    return {
      id: this.id,
      type: this.type,
      timestamp: this.timestamp,
      timestampEdited: this.timestampEdited,
      isPinned: this.isPinned,
      rawContent: this.rawContent,
      author: this.author,
      attachments: this.attachments,
      embeds: this.embeds,
      stickers: this.stickers,
      reactions: this.reactions,
      mentions: this.mentions,
      content: this.content
    };
  }
}
