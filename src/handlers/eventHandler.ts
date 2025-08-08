import { Bot } from '../index';
import * as ready from '../events/ready';
import * as messageReactionAdd from '../events/messageReactionAdd';
import * as messageReactionRemove from '../events/messageReactionRemove';
import * as interactionCreate from '../events/interactionCreate';

export async function loadEvents(bot: Bot) {
  const events = [ready, messageReactionAdd, messageReactionRemove, interactionCreate];
  
  for (const event of events) {
    if (event.once) {
      bot.client.once(event.name, (...args) => event.execute(bot, ...args));
    } else {
      bot.client.on(event.name, (...args) => event.execute(bot, ...args));
    }
  }

  console.log(`Loaded ${events.length} events.`);
}