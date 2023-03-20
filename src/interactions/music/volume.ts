import {
  Colors,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';

import Noshiro from '@/sturctures/Noshiro';
import InteractionCommand from '@/sturctures/InteractionCommand';

class Volume extends InteractionCommand {
  constructor(client: Noshiro) {
    super({
      client,
      category: 'Music',
      command: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Set the music volume')
        .addNumberOption((option) =>
          option
            .setName('volume')
            .setDescription('The amount of volume')
            .setMaxValue(100)
            .setRequired(true)
        )
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

    const volume = ctx.options.get('volume', true);

    player.setVolume(volume.value as number);
    const embed = new EmbedBuilder()
      .setDescription(`Volume successfully  set to ${player.volume}`)
      .setColor(Colors.Green);
    ctx.editReply({
      embeds: [embed],
    });
    return;
  }
}

export default Volume;
