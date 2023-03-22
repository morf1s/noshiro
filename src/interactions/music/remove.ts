import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';

import InteractionCommand from '@/sturctures/InteractionCommand';
import Noshiro from '@/sturctures/Noshiro';

class Remove extends InteractionCommand {
  constructor(client: Noshiro) {
    super({
      client,
      category: 'Music',
      command: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a spefic music you choose')
        .addStringOption((option) =>
          option
            .setName('track')
            .setDescription('The Track you want to remove')
            .setRequired(true)
            .setAutocomplete(true)
        )
        .setDMPermission(false)
        .toJSON(),
    });
  }

  async run(ctx: CommandInteraction | AutocompleteInteraction) {
    const player = this.client.music.players.get(ctx.guildId as string);

    if (ctx.isAutocomplete()) {
      let result: ApplicationCommandOptionChoiceData[] = [];
      const trackSearch = ctx.options.get('track', true);
      if (player) {
        if (trackSearch?.value) {
          const regex = new RegExp(`${trackSearch.value}`, 'i');
          const filterd = player.queue
            .filter((track) => regex.test(track.title))
            .slice(0, 10);

          result = filterd.map((track) => ({
            name: track.title,
            value: track.identifier,
          }));
        } else
          result = player.queue.slice(0, 11).map((track) => ({
            name: track.title,
            value: track.identifier,
          }));
      }

      ctx.respond(result);
      return;
    }

    await ctx.deferReply();

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

    const searchTrack = ctx.options.get('track', true);
    const choosedTrack = player.queue.find(
      (track) => track.identifier === searchTrack.value
    );
    if (!choosedTrack) {
      const embed = new EmbedBuilder()
        .setDescription('Looks like the track you choosed is not in the queue')
        .setColor(Colors.Orange);
      ctx.editReply({
        embeds: [embed],
      });
      return;
    }

    const trackIndex = player.queue.findIndex(
      (track) => track.identifier === choosedTrack.identifier
    );

    player.queue.remove(trackIndex);

    ctx.editReply(`**\`${choosedTrack.title}\`** removed from the queue`);
    return;
  }
}

export default Remove;
