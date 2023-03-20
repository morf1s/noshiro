import 'dotenv/config';
import Bot from '@/sturctures/Noshiro';

const bot = new Bot();

process.on('unhandledRejection', (reason: unknown) => bot.logger.error(reason, 'unhandledRejection'));
process.on('uncaughtException', (error: Error) => bot.logger.error(error, 'uncaughtException'));
