import { ClientEvents } from 'discord.js';
import Noshiro from '@/sturctures/Noshiro';

type NoshiroEventOptions = {
  client: Noshiro;
  name: string;
  emiter: keyof ClientEvents;
  disabled?: boolean;
};
