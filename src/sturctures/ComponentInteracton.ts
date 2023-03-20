import { ComponentInteractionOpt } from '@/types/interaction';
import { CacheType, Colors, CommandInteraction, Interaction } from 'discord.js';

import Noshiro from './Noshiro';

class ComponentInteaction {
  client: Noshiro;
  id: string;
  name: string;
  developer: boolean;
  disabled: boolean;
  constructor(opt: ComponentInteractionOpt) {
    this.client = opt.client;
    this.id = opt.id;
    this.name = opt.name;
    this.disabled = opt.disabled || false;
    this.developer = opt.developer || false;
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
                "Looks like you don't have permission to run this command",
            },
          ],
        });
      }
      return;
    }
    this.run(ctx).catch((err: Error) =>
      this.client.logger.error(
        err,
        `error running ${this.name} interaction`
      )
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(ctx: Interaction<CacheType> | CommandInteraction<CacheType>) {
    throw new Error(`run method is not implemented on the child class`);
  }
}

export default ComponentInteaction;
