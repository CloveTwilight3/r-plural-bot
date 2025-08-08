import 'reflect-metadata';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from 'dotenv';
import { AppDataSource } from './database/database';
import { loadCommands } from './handlers/commandHandler';
import { loadEvents } from './handlers/eventHandler';
import { BotCommand } from './types/Command';

config();

export class Bot {
  public client: Client;
  public commands: Collection<string, BotCommand>;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
      ],
    });
    
    this.commands = new Collection();
  }

  public async start(): Promise<void> {
    try {
      // Initialize database
      await AppDataSource.initialize();
      console.log('Database connected successfully!');

      // Load commands and events
      await loadCommands(this);
      await loadEvents(this);

      // Login to Discord
      await this.client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
      console.error('Failed to start bot:', error);
      process.exit(1);
    }
  }
}

// Start the bot
const bot = new Bot();
bot.start();