import { InteractionCommandOpt } from '@/types/interaction';
import {
  CacheType,
  Colors,
  CommandInteraction,
  Interaction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';

import Noshiro from './Noshiro';

class InteractionCommand {
  client: Noshiro;
  command: RESTPostAPIChatInputApplicationCommandsJSONBody;
  category: string;
  developer: boolean;
  disabled: boolean;
  register: boolean;
  constructor(opt: InteractionCommandOpt) {
    this.client = opt.client;
    this.category = opt.category || 'Misc';
    this.disabled = opt.disabled || false;
    if (opt.developer) {
      this.developer = true;
      this.category = 'Developer';
    }

    this.command = opt.command;
  }

  async load(ctx: Interaction<CacheType>) {
    if (this.developer && !this.client.owners[ctx.user.id]) {
      if (ctx.isRepliable()) {
        await ctx.deferReply();
        ctx.editReply({
          embeds: [
            {
              color: Colors.Red,
              description:
                'Looks like you don\'t have permission to run this command',
            },
          ],
        });
      }
      return;
    }

    this.run(ctx).catch((err: Error) =>
      this.client.logger.error(
        err,
        `error running ${this.command.name} interaction`
      )
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(ctx: Interaction<CacheType> | CommandInteraction<CacheType>) {
    throw new Error('run method is not implemented on the child class');
  }
}

export default InteractionCommand;
