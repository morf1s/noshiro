import {
    Colors,
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
  } from 'discord.js';

import Noshiro from '@/sturctures/Noshiro';
import InteractionCommand from '@/sturctures/InteractionCommand';

class Pause extends InteractionCommand {
  constructor(client: Noshiro) {
    super({
      client,
      category: 'Music',
      command: new SlashCommandBuilder()
        .setName('queue')
        .setDMPermission(false)
        .setDescription('List current msuic queue')
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
            .setDescription('Queue is empty, nothing to pause here')
            .setColor(Colors.White),
        ],
      });
      return;
    }

    player.pause(!player.paused);
    const embed = new EmbedBuilder()
      .setDescription(`Player has been ${player.paused ? 'paused' : 'resumed'}`)
      .setColor(Colors.Blurple);

    ctx.editReply({
      embeds: [embed],
    });
  }
}

export default Pause;
