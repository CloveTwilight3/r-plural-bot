import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { Bot } from '../index';

export interface BotCommand {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction, bot: Bot) => Promise<void>;
}