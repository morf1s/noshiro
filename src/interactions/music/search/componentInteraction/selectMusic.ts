import {
  Colors,
  EmbedBuilder,
  Guild,
  GuildMember,
  StringSelectMenuInteraction,
} from 'discord.js';
import { KazagumoSearchResult } from 'kazagumo';

import Noshiro from '@/sturctures/Noshiro';
import ComponentInteaction from '@/sturctures/ComponentInteracton';

class SelectMusic extends ComponentInteaction {
  constructor(client: Noshiro) {
    super({
      client,
      id: 'music_search_select_menu',
      name: 'Search Music Selections',
    });
  }

  async run(ctx: StringSelectMenuInteraction<'cached'>) {
    await ctx.deferUpdate();

    const searchInteraction = this.client.interactionStates.get(
      `${ctx.user.id}:${this.id}`
    ) as KazagumoSearchResult;
    if (!searchInteraction) return;

    const selected = ctx.values[0];
    const track = searchInteraction.tracks.find(
      (track) => track.identifier === selected
    );
    if (!track) {
      ctx.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription('Sorry i could not find the music you selected')
            .setColor(Colors.Orange),
        ],
      });
      return;
    }

    const { channelId: voiceId } = (ctx.member as GuildMember).voice;
    if (!voiceId) {
      ctx.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              'You must be in voice channel to use this interaction'
            )
            .setColor(Colors.Red),
        ],
      });
      return;
    }

    const player = await this.client.music
      .createPlayer({
        guildId: ctx.guildId as string,
        textId: ctx.channelId,
        voiceId: voiceId,
        volume: 50,
      })
      .catch((err: Error) => err);
    if (player instanceof Error) {
      this.client.logger.error(player);

      return;
    }

    player.queue.add(track);
    const musicAddedEmebd = new EmbedBuilder()
      .setDescription(`**[${track.title}](${track.uri})** added to the queue.`)
      .setThumbnail(track.thumbnail || '')
      .setColor(Colors.Blurple);

    await ctx.editReply({
      embeds: [musicAddedEmebd],
      components: [],
    });
    if (!player.playing) player.play();

    return;
  }
}

export default SelectMusic;
