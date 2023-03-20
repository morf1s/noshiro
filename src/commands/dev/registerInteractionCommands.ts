import { Message } from 'discord.js';

import Command from '@/sturctures/Command';
import Noshiro from '@/sturctures/Noshiro';
import InteractionCommand from '@/sturctures/InteractionCommand';

class RegisterInteractionCommands extends Command {
  constructor(client: Noshiro) {
    super({
      client,
      name: 'Register Interaction Command',
      aliases: ['registerinteractioncommands', 'ric'],
      developer: true,
    });
  }

  async run(message: Message<boolean>) {
    const commands = Object.values(this.client.interactions).filter(
      (c) => c instanceof InteractionCommand
    ) as InteractionCommand[];

    for (const command of commands) {
      const res = await message.guild?.commands
        .create(command.command)
        .catch((err: Error) => err);

      if (res instanceof Error)
        this.client.logger.error(
          res,
          `error occured while registering ${command.command.name}`
        );
      else
        this.client.logger.info(
          `${command.command.name} has been registered for ${message.guild?.name}.`
        );
    }

    message.reply(
      `${commands.length} interaction commands has been registered.`
    );
  }
}

export default RegisterInteractionCommands;
