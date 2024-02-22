import { Attachment, Guild, Message, MessageType, Sticker, StickerFormatType, StickerType } from 'discord.js';

import { Message as Model } from '../models/Message';

export class MessageBuilder {
  static build(guild: Guild, msg: Message): Model {
    const mentions: { id: string; name: string; discriminator: string; nickname: string | null; isBot: boolean }[] = [];
    const reactions = msg.reactions.cache.map(_ => _);

    msg.mentions.users.each(mentionedUser => {
      mentions.push({
        id: mentionedUser.id,
        name: mentionedUser.username,
        discriminator: mentionedUser.discriminator,
        nickname: mentionedUser.globalName,
        isBot: mentionedUser.bot
      });
    });

    return Model.fromPrimitives({
      id: msg.id,
      type: MessageType[msg.type],
      timestamp: new Date(msg.createdTimestamp),
      timestampEdited: msg.editedTimestamp ? new Date(msg.editedTimestamp) : null,
      isPinned: msg.pinned,
      rawContent: msg.content,
      author: {
        id: msg.author.id,
        name: msg.author.username,
        discriminator: msg.author.discriminator,
        nickname: msg.author.displayName,
        color: msg.author.hexAccentColor ?? '#0',
        isBot: msg.author.bot,
        avatarUrl: msg.author.avatarURL()
      },
      attachments:
        msg.attachments?.map((att: Attachment) => {
          return {
            id: att.id,
            url: att.url,
            fileName: att.name,
            fileSizeBytes: att.size,
            type: att.contentType
          };
        }) ?? [],
      embeds: msg.embeds ?? [],
      stickers:
        msg.stickers?.map((_: Sticker) => ({
          id: _.id,
          name: _.name,
          format: StickerFormatType[_.format],
          type: StickerType[_.type ?? 1],
          sourceUrl: _.type === 2 ? `https://media.discordapp.net/stickers/${_.id}` : undefined
        })) ?? [],
      reactions:
        reactions.map((_: any) => ({
          emoji: {
            id: _.emoji.id,
            name: _.emoji.name,
            isAnimated: _.emoji.animated,
            imageUrl: _.emoji.url
          },
          count: _.count
        })) ?? [],
      mentions: mentions
    });
  }
}
