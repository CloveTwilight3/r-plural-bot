import { Client } from 'discord.js';
import { Bot } from '../index';

export const name = 'ready';
export const once = true;

export async function execute(bot: Bot) {
  console.log(`Ready! Logged in as ${bot.client.user?.tag}`);
  
  // Set bot status
  bot.client.user?.setActivity('Helping plural systems', { type: 0 });
}