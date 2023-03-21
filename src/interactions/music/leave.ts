import {
  Colors,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

import Noshiro from '@/sturctures/Noshiro';
import InteractionCommand from '@/sturctures/InteractionCommand';

class Leave extends InteractionCommand {
  constructor(client: Noshiro) {
    super({
      client,
      category: 'Music',
      command: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leave voice channel and clear queues')
        .setDMPermission(false)
        .toJSON(),
    });
  }

  async run(ctx: CommandInteraction): Promise<void> {
    await ctx.deferReply();

    const player = this.client.music.players.get(ctx.guildId as string);
    if (!player) {
      ctx.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              'I\'m not playing any music or in voice channel currently'
            )
            .setColor(Colors.White),
        ],
      });
      return;
    }

    player.destroy();

    const embed = new EmbedBuilder()
      .setDescription('Queues cleared, and leaved channel')
      .setColor(Colors.Blurple);

    ctx.editReply({
      embeds: [embed],
    });
  }
}

export default Leave;
