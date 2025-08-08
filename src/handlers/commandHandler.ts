import { Bot } from '../index';
import { warnCommand } from '../commands/warn';
import { banCommand } from '../commands/ban';
import { rulesCommand } from '../commands/rules';

export async function loadCommands(bot: Bot) {
  const commands = [warnCommand, banCommand, rulesCommand];
  
  for (const command of commands) {
    bot.commands.set(command.data.name, command);
  }

  console.log(`Loaded ${commands.length} commands.`);
}