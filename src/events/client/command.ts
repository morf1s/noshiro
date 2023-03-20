import { Message } from 'discord.js';

import Noshiro from '@/sturctures/Noshiro';
import Event from '@/sturctures/Event';
import Config from '@config';

class Command extends Event {
  clientUserName: string;
  constructor(client: Noshiro) {
    super({
      client,
      name: 'Command',
      emiter: 'messageCreate',
    });
  }

  async run(message: Message): Promise<void> {
    if (!message.guildId || message.author.bot) return;

    const { usedPrefix } = this.prefixRegex(message.content);

    if (message.content.slice(0, usedPrefix.length) !== usedPrefix) return;

    const [cmd, ...args] = message.content
      .slice(usedPrefix.length)
      .trim()
      .split(/ +/g);
    const command = this.client.getCommand(cmd);
    if (!command) return;

    const { developer, permissions, userPermissions } = command;
    if (developer && !this.client.owners[message.author.id]) return;

    if (
      permissions.length &&
      !message.guild?.members.me?.permissions.has(permissions)
    ) {
      message.reply(
        `Ooops looks like i don't have enough permissions to run this command, please make sure i have ${
          permissions.length > 1 ? 'theese' : 'this'
        } ${permissions.map((x) => `\`${x}\``).join(', ')} permission`
      );
      return;
    }

    if (userPermissions.length) {
      for (const perm of userPermissions)
        if (!message.member?.permissions.has(perm)) {
          message.reply(
            "You don't have enough permission to run this command."
          );
          return;
        }
    }

    command.load(message, args);
  }

  prefixRegex(message: string, prefix?: string) {
    let clientUserName = this.clientUserName;
    if (!clientUserName) {
      const clientNameRegex = new RegExp('\\w+').exec(
        this.client.user?.username as string
      );

      clientUserName = clientNameRegex ? clientNameRegex[0] : '';
    }

    const guildPrefix = prefix || Config.defaultPrefix;
    const regex = new RegExp(
      `^(<@!?${this.client.user?.id as string}>${
        clientUserName ? `|${this.escapeRegex(clientUserName)}|` : ''
      }${this.escapeRegex(guildPrefix)})\\s*`,
      'i'
    );

    const prefixRegex = message.match(regex);
    const usedPrefix = prefixRegex ? prefixRegex[1] : '';
    return { usedPrefix, guildPrefix };
  }

  escapeRegex(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

export default Command;
