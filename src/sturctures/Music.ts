import {
  Colors,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  TextChannel,
  User,
} from 'discord.js';
import { Connectors } from 'shoukaku';
import { Kazagumo, KazagumoPlayer } from 'kazagumo';

import Config from '@config';
import Noshiro from './Noshiro';

import prettyms from 'pretty-ms';

class Music extends Kazagumo {
  client: Noshiro;
  constructor(client: Noshiro) {
    super(
      {
        defaultSearchEngine: 'youtube',
        send: (guildId, payload) => {
          const guild = client.guilds.cache.get(guildId);
          if (guild) guild.shard.send(payload);
        },
      },
      new Connectors.DiscordJS(client),
      Config.lavanodes
    );
    this.client = client;

    this.shoukaku
      .on('ready', (name) =>
        this.client.logger.info(`Shoukaku Connected to ${name} node`)
      )
      .on('error', (name: string, error: Error) =>
        this.client.logger.error(error, name)
      );

    this.on('playerEmpty', async (player) => {
      setTimeout(() => {
        const playerExists = this.players.get(player.guildId);
        if (!player.queue.size && playerExists) player.destroy();
      }, 30000);
    }).on('playerStart', async (player, track) => {
      const channel = (await this.client.channels.fetch(
        player.textId
      )) as TextChannel;

      const user = track.requester as User;
      if (channel)
        channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle('Playing')
              .setThumbnail(track.thumbnail || '')
              .addFields([
                {
                  name: 'Title',
                  value: `**[${track.title}](${track.uri})**`,
                  inline: true,
                },
                {
                  name: 'Duration',
                  value: `**\`${prettyms(track.length || 0, {
                    colonNotation: true,
                  })}\`**`,
                  inline: true,
                },
              ])
              .setFooter({
                text: `Request By: ${user.username}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(Colors.Blurple),
          ],
        });
    });
  }

  isQueuesRequester(
    member: GuildMember,
    player: KazagumoPlayer,
    ctx: CommandInteraction
  ): boolean {
    if (
      member.permissions.has('Administrator') ||
      this.client.owners[member.id]
    )
      return true;
    const voice = member.voice;
    const embed = new EmbedBuilder()
      .setDescription(
        'You must be in the same voice channel as me to run this command.'
      )
      .setColor(Colors.Red);

    if (!voice || voice.channelId !== player.voiceId) {
      ctx.editReply({
        embeds: [embed],
      });
      return false;
    }

    return true;
  }
}

export default Music;
