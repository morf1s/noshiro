import { readFileSync } from 'fs';

const Config: Config = {
  ownerIds: (process.env.OWNER_IDS as string).split(','),
  intents: process.env.INTENTS
    ? process.env.INTENTS.split(',')
    : [
        'Guilds',
        'GuildMembers',
        'GuildVoiceStates',
        'GuildMessages',
        'MessageContent',
      ],
  lavanodes: process.env.LAVALINK_NODES
    ? JSON.parse(process.env.LAVALINK_NODES)
    : [],
  defaultPrefix: process.env.DEFAULT_PREFIX as string,
};

if (process.env.DISCORD_TOKEN_FILE) {
  const buffer = readFileSync(process.env.DISCORD_TOKEN_FILE);
  process.env.DISCORD_TOKEN = buffer.toString();
}

export default Config;
