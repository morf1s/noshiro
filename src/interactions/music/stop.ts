import {
    Colors,
    CommandInteraction,
    EmbedBuilder,
    GuildMember,
    SlashCommandBuilder,
  } from 'discord.js';

import Noshiro from '@/sturctures/Noshiro';
import InteractionCommand from '@/sturctures/InteractionCommand';


class Stop extends InteractionCommand {
  constructor(client: Noshiro) {
    super({
      client,
      category: 'Music',
      command: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music and clear the queue')
        .toJSON(),
    });
  }

  async run(ctx: CommandInteraction) {
    await ctx.deferReply();

    const player = this.client.music.getPlayer(ctx.guildId as string);
    if (!player) {
      ctx.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription('Queue is empty')
            .setColor(Colors.White),
        ],
      });
      return;
    }

    if (
      !this.client.music.isQueuesRequester(
        ctx.member as GuildMember,
        player,
        ctx
      )
    )
      return;

    player.queue.clear();
    player.skip();

    const embed = new EmbedBuilder()
      .setDescription('Music stopped and queues cleared')
      .setColor(Colors.Blurple);
    ctx.editReply({
      embeds: [embed],
    });
  }
}

export default Stop;
