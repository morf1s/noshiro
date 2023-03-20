import { Message } from 'discord.js';

import Command from '@/sturctures/Command';
import Noshiro from '@/sturctures/Noshiro';

class DeleteInteractionCommands extends Command {
  constructor(client: Noshiro) {
    super({
      client,
      name: 'Delete Interaction Command',
      aliases: ['deleteinteractioncommands', 'dic'],
      developer: true,
    });
  }

  async run(message: Message<boolean>) {
    const commands = await message.guild?.commands.fetch();
    if (!commands) {
      message.reply(`0 commands deleted.`);
      return;
    }

    for (const command of commands.toJSON()) {
      const res = await command.delete().catch((err: Error) => err);
      if (res instanceof Error)
        this.client.logger.error(
          res,
          `Error occured while deleting command ${command.name}`
        );
      else
        this.client.logger.info(
          `${command.name} has been deleted for ${message.guild?.name}`
        );
    }

    message.reply(
      `${commands.toJSON().length} interaction commands has been registered.`
    );
  }
}

export default DeleteInteractionCommands;
