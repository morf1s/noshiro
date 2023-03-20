import { Interaction } from 'discord.js';

import ComponentInteaction from '@/sturctures/ComponentInteracton';
import InteractionCommand from '@/sturctures/InteractionCommand';
import Event from '@/sturctures/Event';
import Noshiro from '@/sturctures/Noshiro';

class InteractionCreate extends Event {
  constructor(client: Noshiro) {
    super({
      client,
      name: 'Interaction Create',
      emiter: 'interactionCreate',
    });
  }

  async run(ctx: Interaction) {
    let command: InteractionCommand | ComponentInteaction | undefined;
    if (ctx.isChatInputCommand() || ctx.isCommand() || ctx.isAutocomplete())
      command = this.client.interactions[ctx.commandName];
    else if (ctx.isAnySelectMenu() || ctx.isModalSubmit() || ctx.isButton())
      command = this.client.interactions[ctx.customId];

    if (command) return command.load(ctx);
  }
}

export default InteractionCreate;
