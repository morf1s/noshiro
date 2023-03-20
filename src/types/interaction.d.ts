import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';

import Noshiro from '@/sturctures/Noshiro';

type InteractionCommandOpt = {
  client: Noshiro;
  developer?: boolean;
  category?: string;
  disabled?: boolean;
  command: RESTPostAPIChatInputApplicationCommandsJSONBody;
};

type ComponentInteractionOpt = {
  client: Noshiro;
  id: string;
  name: string;
  developer?: boolean;
  disabled?: boolean;
};
