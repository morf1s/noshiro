import Noshiro from '@/sturctures/Noshiro';
import { PermissionResolvable } from 'discord.js';

type CommandOption = {
  client: Noshiro;
  name: string;
  aliases: string[];
  category?: string;
  permissions?: PermissionResolvable[];
  userPermissions?: PermissionResolvable[];
  developer?: boolean;
  cooldown?: number;
  disable?: boolean;
};
