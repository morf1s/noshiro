import Noshiro from '@/sturctures/Noshiro';
import InteractionCommand from '@/sturctures/InteractionCommand';
import {
  Colors,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  User,
} from 'discord.js';

import prettyMilliseconds from 'pretty-ms';

class Queue extends InteractionCommand {
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
            .setDescription(`Queue is empty`)
            .setColor(Colors.White),
        ],
      });
      return;
    }

    const queueDescription = player.queue.slice(0, 10).map(
      (track, i) =>
        `**\`[${i + 1}]\`** **[${this.client.utils.sliceTittle(track.title)}](${
          track.uri
        })** \`[${prettyMilliseconds(track.length ?? 0, {
          colonNotation: true,
        })}]\` <@${(track.requester as User).id}>`
    );

    if (queueDescription.length >= 10)
      queueDescription.push(
        `**... and ${player.queue.length - 10} more tracks.**`
      );

    const embed = new EmbedBuilder()
      .setTitle(`${ctx.guild?.name} Queue`)
      .setColor(Colors.Blurple)
      .setDescription(
        queueDescription.length
          ? queueDescription.join('\n')
          : '**`Queue is empty`**'
      )
      .addFields([
        {
          name: 'Queue Duration',
          value: `\`${prettyMilliseconds(player.queue.durationLength, {
            colonNotation: true,
          })}\``,
          inline: true,
        },
        {
          name: 'Now Playing',
          value: [
            `Track: [${player.queue.current?.title}](${player.queue.current?.uri})`,
            `Duration: \`${prettyMilliseconds(
              player.queue.current?.length ?? 0,
              {
                colonNotation: true,
              }
            )}\``,
          ].join('\n'),
        },
      ]);

    ctx.editReply({
      embeds: [embed],
    });
  }
}

export default Queue;
