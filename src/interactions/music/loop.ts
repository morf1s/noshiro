import {
  Colors,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';

import InteractionCommand from '@/sturctures/InteractionCommand';
import Noshiro from '@/sturctures/Noshiro';

class Loop extends InteractionCommand {
  constructor(client: Noshiro) {
    super({
      client,
      category: 'Music',
      command: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loop current track/queue')
        .addStringOption((option) =>
          option
            .setName('loop_type')
            .setDescription(
              'Loop type whether you wwant to loop the track or the queue. default: track'
            )
            .addChoices(
              {
                name: 'track',
                value: 'track',
              },
              {
                name: 'queue',
                value: 'queue',
              }
            )
        )
        .toJSON(),
    });
  }

  async run(ctx: CommandInteraction): Promise<void> {
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

    const loopTypeParam = ctx.options.get('loop_type');
    let loopType = 'track';
    if (loopTypeParam) loopType = loopTypeParam.value as string;

    console.log(player.loop, loopType);
    if (player.loop !== 'none' && !loopTypeParam) loopType = 'none';
    // @ts-ignore
    player.setLoop(loopType);

    const embed = new EmbedBuilder()
      .setDescription(`\`${player.loop}\` loop enabled`)
      .setColor(Colors.Blurple);

    if (player.loop === 'none') embed.setDescription('Loop has been disabled');

    ctx.editReply({
      embeds: [embed],
    });
  }
}

export default Loop;
