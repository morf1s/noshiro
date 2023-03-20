import ComponentInteaction from '@/sturctures/ComponentInteracton';
import InteractionCommand from '@/sturctures/InteractionCommand';
import Command from '@/sturctures/Command';
import Event from '@/sturctures/Event';
import Noshiro from '@/sturctures/Noshiro';
import glob from 'glob';
import path from 'path';

class Loader {
  client: Noshiro;
  constructor(client: Noshiro) {
    this.client = client;
  }

  get mainFilePath() {
    return path.dirname(require.main?.filename as string);
  }

  async loadCommands() {
    const commands = await glob(`${this.mainFilePath}/commands/**/*.js`);
    let totalCommands = 0;

    this.client.logger.info('Loading commands..');
    delete require.cache[`${this.mainFilePath}/structures/command.js`];

    for (const filePath of commands) {
      delete require.cache[filePath];

      try {
        const File = require(filePath).default;
        const Command: Command = new File(this.client);

        if (!Command.aliases.length) {
          this.client.logger.error(`${Command.name} doesn't have aliases.`);
          continue;
        }
        if (Command.disabled) continue;

        this.client.commands[Command.aliases[0]] = Command;
        for (const alias of Command.aliases.slice(1))
          this.client.aliases[alias] = Command.aliases[0];
        totalCommands++;
      } catch (error) {
        const { name } = path.parse(filePath);
        this.client.logger.error(
          error,
          `error occured while loading command ${name} file.`
        );
        continue;
      }
    }

    this.client.logger.info(`${totalCommands} commands loaded.`);
  }

  async loadInteractionCommands() {
    const commands = await glob(`${this.mainFilePath}/interactions/**/*.js`);
    let totalCommands = 0;

    this.client.logger.info('Loading commands..');
    delete require.cache[`${this.mainFilePath}/structures/command.js`];

    for (const filePath of commands) {
      delete require.cache[filePath];

      try {
        const File = require(filePath).default;
        const Command: InteractionCommand | ComponentInteaction = new File(
          this.client
        );
        if (Command.disabled) continue;
        if (Command instanceof InteractionCommand)
          this.client.interactions[Command.command.name] = Command;
        else this.client.interactions[Command.id] = Command;

        totalCommands++;
      } catch (error) {
        const { name } = path.parse(filePath);
        this.client.logger.error(
          error,
          `error occured while loading command ${name} file.`
        );
        continue;
      }
    }

    this.client.logger.info(`${totalCommands} commands loaded.`);
  }

  async loadEvents() {
    const events = await glob(`${this.mainFilePath}/events/**/*.js`);
    let totalEvent = 0;

    this.client.logger.info('Loading events...');
    delete require.cache[`${this.mainFilePath}/structures/event.js`];
    for (const filePath of events) {
      delete require.cache[filePath];

      try {
        const File = require(filePath).default;
        const Event: Event = new File(this.client);

        if (Event.disabled) continue;

        this.client.on(Event.emiter, Event.load.bind(Event));
        totalEvent++;
      } catch (error) {
        const { name } = path.parse(filePath);
        this.client.logger.error(
          error,
          `error occured while loading event ${name} file.`
        );
        continue;
      }
    }

    this.client.logger.info(`${totalEvent} events loaded.`);
  }
}

export default Loader;
