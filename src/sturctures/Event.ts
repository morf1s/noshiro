import { NoshiroEventOptions } from '@/types/event';
import { ClientEvents } from 'discord.js';

import Noshiro from './Noshiro';

class Event {
  client: Noshiro;
  name: string;
  emiter: keyof ClientEvents;
  disabled: boolean;
  constructor(opt: NoshiroEventOptions) {
    this.client = opt.client;
    this.name = opt.name;
    this.emiter = opt.emiter;
    this.disabled = opt.disabled || false;
  }

  async load(...args: unknown[]) {
    if (this.disabled) return;
    this.run(...args).catch((err: Error) =>
      this.client.logger.error(err, `error running ${this.name}`)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(...args: unknown[]) {
    this.client.logger.error(
      `${this.name} run method is not implemented on the childs class.`
    );
  }
}

export default Event;
