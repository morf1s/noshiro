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

class Skip extends InteractionCommand {
  constructor(client: Noshiro) {
    super({
      client,
      category: 'Music',
      command: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current music')
        .addStringOption((option) =>
          option
            .setName('track')
            .setDescription('The Track you want to skip to')
            .setRequired(false)
            .setAutocomplete(true)
        )
        .toJSON(),
    });
  }

  async run(ctx: CommandInteraction | AutocompleteInteraction) {
    const player = this.client.music.players.get(ctx.guildId as string);

    if (ctx.isAutocomplete()) {
      let result: ApplicationCommandOptionChoiceData[] = [];
      const trackSearch = ctx.options.get('track');
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

    const searchTrack = ctx.options.get('track');
    if (searchTrack) {
      const track = player.queue.find(
        (track) => track.identifier === searchTrack.value
      );
      if (track) {
        // idk player.queue.previous is empty after player.play(), so...
        const lastPlayed = player.queue.current?.getRaw();
        await player.play(track);
        const trackIndex = player.queue.findIndex(
          (track) => track.identifier === lastPlayed?.info.identifier
        );
        if (trackIndex >= 0) player.queue.remove(trackIndex);
      }
    } else player.skip();

    ctx.editReply('Skipping current track.');
    return;
  }
}

export default Skip;
