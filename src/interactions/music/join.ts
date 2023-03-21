import {
  Colors,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';

import Noshiro from '@/sturctures/Noshiro';
import InteractionCommand from '@/sturctures/InteractionCommand';

class Join extends InteractionCommand {
  constructor(client: Noshiro) {
    super({
      client,
      category: 'Music',
      command: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join your voice channel')
        .setDMPermission(false)
        .toJSON(),
    });
  }

  async run(ctx: CommandInteraction) {
    await ctx.deferReply();

    const voiceId = (ctx.member as GuildMember)?.voice.channelId;
    if (!voiceId) {
      ctx.editReply({
        embeds: [
          new EmbedBuilder().setDescription(
            'You must be in a voice channel to run this command'
          ),
        ],
      });
      return;
    }

    const me = ctx.guild?.members.cache.get(
      this.client.user?.id as string
    ) as GuildMember;

    const player = await this.client.music.createPlayer({
      guildId: ctx.guildId as string,
      textId: ctx.channelId,
      voiceId,
    });

    if (!me.voice.channelId || player.voiceId !== voiceId) player.connect();

    ctx.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Joined <#${player.voiceId}>`)
          .setColor(Colors.Blurple),
      ],
    });
  }
}

export default Join;
