import Noshiro from '@/sturctures/Noshiro';
import InteractionCommand from '@/sturctures/InteractionCommand';
import {
  ActionRowBuilder,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';
import prettyMilliseconds from 'pretty-ms';

class Search extends InteractionCommand {
  constructor(client: Noshiro) {
    super({
      client,
      command: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search a song based on your query')
        .setDMPermission(false)
        .addStringOption((option) =>
          option
            .setName('query')
            .setDescription('Query search for the song')
            .setRequired(true)
        )
        .toJSON(),
      category: 'Music',
    });
  }

  async run(ctx: CommandInteraction<'cached'>) {
    if (!ctx.isChatInputCommand()) return;
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

    const embed = new EmbedBuilder()
      .setTitle('Search results')
      .setColor(Colors.Blurple)
      .setDescription(
        searchRes.tracks
          .slice(0, 10)
          .map(
            (track, i) =>
              `\`[${i + 1}]\` **[${this.client.utils.sliceTittle(
                track.title,
                40
              )}](${track.uri})** \`${prettyMilliseconds(track.length || 0, {
                colonNotation: true,
              })}\``
          )
          .join('\n')
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>();
    const musicSelectMenu = new StringSelectMenuBuilder()
      .setCustomId('music_search_select_menu')
      .setPlaceholder('🎵 Select music');

    for (let i = 0; i < searchRes.tracks.slice(0, 10).length; i++) {
      const track = searchRes.tracks[i];
      musicSelectMenu.addOptions({
        label: `[${i + 1}] ${track.title}`,
        value: track.identifier,
      });
    }

    row.addComponents(musicSelectMenu);
    ctx.editReply({
      embeds: [embed],
      components: [row],
    });

    this.client.interactionStates.set(
      `${ctx.user.id}:music_search_select_menu`,
      searchRes
    );
  }
}

export default Search;
