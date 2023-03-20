/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Message, PermissionResolvable } from 'discord.js';
import { CommandOption } from '@/types/command';
import Noshiro from './Noshiro';

class Command {
  client: Noshiro;
  name: string;
  aliases: string[];
  category: string;
  permissions: PermissionResolvable[];
  userPermissions: PermissionResolvable[];
  developer: boolean;
  disabled: boolean;

  constructor(opt: CommandOption) {
    this.client = opt.client;
    this.name = opt.name;
    this.aliases = opt.aliases;
    this.category = opt.developer ? 'Developer' : opt.category || 'Misc';
    this.permissions = opt.permissions || [];
    this.userPermissions = opt.userPermissions || [];
    this.developer = opt.developer || false;
    this.disabled = opt.disable || false;
  }

  async load(message: Message, args: string[]) {
    if (this.disabled) return;
    this.run(message, args).catch((err: Error) =>
      this.client.logger.error(err, `error running ${this.name}`)
    );
  }

  async run(message: Message, args: string[]) {
    this.client.logger.error(
      `${this.name} run method is not implemented on the childs class`
    );
  }
}

export default Command;