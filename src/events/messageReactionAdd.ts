import { MessageReaction, User, PartialMessageReaction, PartialUser } from 'discord.js';
import { Bot } from '../index';
import { findRoleByEmojiId } from '../roles/config';

export const name = 'messageReactionAdd';

export async function execute(bot: Bot, reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
  if (user.bot) return;

  // Fetch partial data
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message:', error);
      return;
    }
  }

  if (user.partial) {
    try {
      await user.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the user:', error);
      return;
    }
  }

  // Check if this is a role reaction message
  const isRoleMessage = reaction.message.id === process.env.ROLE_MESSAGE_ID;
  if (!isRoleMessage) return;

  // Get the emoji ID (for custom emojis) or fall back to name (for Unicode emojis)
  const emojiId = reaction.emoji.id || reaction.emoji.name;
  if (!emojiId) {
    console.log('No emoji ID or name found');
    return;
  }

  console.log(`Reaction added - Emoji ID: ${emojiId}, User: ${user.username}`);

  // Find matching role using emoji ID
  const roleId = findRoleByEmojiId(emojiId);
  if (!roleId) {
    console.log(`No role found for emoji ID: ${emojiId}`);
    return;
  }

  try {
    const guild = reaction.message.guild;
    if (!guild) {
      console.log('No guild found');
      return;
    }

    const member = await guild.members.fetch(user.id);
    const role = guild.roles.cache.get(roleId);

    if (!role) {
      console.error(`Role with ID ${roleId} not found in guild`);
      return;
    }

    if (!member.roles.cache.has(roleId)) {
      await member.roles.add(role);
      console.log(`✅ Added role "${role.name}" to ${user.username} (Emoji ID: ${emojiId})`);
    } else {
      console.log(`User ${user.username} already has role "${role.name}"`);
    }
  } catch (error) {
    console.error('Error adding role:', error);
  }
}