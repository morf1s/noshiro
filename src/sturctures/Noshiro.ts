import { Client, GatewayIntentsString } from 'discord.js';

import ComponentInteaction from './ComponentInteracton';
import InteractionCommand from './InteractionCommand';
import Config from '@config';
import Command from './Command';
import Music from './Music';
import Pino, { pino } from 'pino';
import Loader from '@/utils/loader';
import Utils from '@/utils/utils';
import InteractionState from '@/utils/interactionState';

class Noshiro extends Client {
  logger: Pino.Logger;
  loader: Loader;
  commands: Record<string, Command>;
  aliases: Record<string, string>;
  owners: Record<string, boolean>;
  interactions: Record<string, InteractionCommand | ComponentInteaction>;
  music: Music;
  utils: Utils;
  interactionStates: InteractionState;

  constructor() {
    super({
      intents: Config.intents as GatewayIntentsString[],
    });
    this.logger = Pino({
      timestamp: Pino.stdTimeFunctions.isoTime,
    });
    this.loader = new Loader(this);
    this.music = new Music(this);
    this.utils = new Utils();
    this.interactionStates = new InteractionState();
    this.commands = {};
    this.interactions = {};
    this.aliases = {};
    this.owners = {};

    this.init();
  }

  getCommand(name: string): Command {
    return this.commands[this.aliases[name] || name];
  }

  logError(obj: unknown, msg?: string, ...args: any[]) {
    
    return
  }

  private async init() {
    for (const owner of Config.ownerIds) this.owners[owner] = true;

    await this.loader.loadCommands();
    await this.loader.loadInteractionCommands();
    await this.loader.loadEvents();

    this.login();
  }
}

export default Noshiro;
