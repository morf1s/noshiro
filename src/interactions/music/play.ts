import {
  CacheType,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

import Noshiro from '@/sturctures/Noshiro';
import InteractionCommand from '@/sturctures/InteractionCommand';

class Play extends InteractionCommand {
  constructor(client: Noshiro) {
    super({
      client,
      category: 'Music',
      command: new SlashCommandBuilder()
        .setName('play')
        .setDMPermission(false)
        .setDescription(
          'Play the first index of music search base on your input'
        )
        .addStringOption((opt) =>
          opt
            .setName('query')
            .setDescription('Music query search you want to play')
            .setRequired(true)
        )
        .toJSON(),
    });
  }

  async run(ctx: CommandInteraction<CacheType>) {
    await ctx.deferReply();

    const member = await ctx.guild?.members.fetch(ctx.user);
    const channelId = member?.voice.channelId;
    if (!channelId) {
      ctx.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription('You must be in voice channel to run this command')
            .setColor(Colors.Orange),
        ],
      });
      return;
    }

    const query = ctx.options.get('query', true);
    const searchRes = await this.client.music.search(query.value as string, {
      requester: ctx.member?.user,
    });

    const player = await this.client.music.createPlayer({
      guildId: ctx.guildId as string,
      textId: ctx.channelId,
      voiceId: channelId,
      volume: 50,
      deaf: true,
    });

    switch (searchRes.type) {
      case 'PLAYLIST': {
        ctx.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `Adding ${searchRes.tracks.length} tracks from **${searchRes.playlistName}** playlist to the queue.`
              )
              .setColor(Colors.Blurple),
          ],
        });

        player.queue.add(searchRes.tracks);
        break;
      }
      case 'SEARCH':
      case 'TRACK': {
        const track = searchRes.tracks[0];
        player.queue.add(searchRes.tracks[0]);
        ctx.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `**[${track.title}](${track.uri})** added to the queue.`
              )
              .setThumbnail(track.thumbnail || '')
              .setColor(Colors.Blurple),
          ],
        });
        break;
      }
    }

    if (!player.playing) player.play();

    return;
  }
}

export default Play;
