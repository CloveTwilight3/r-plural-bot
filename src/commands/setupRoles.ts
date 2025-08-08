import { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { Bot } from '../index';
import { BotCommand } from '../types/Command';
import { ROLES, ROLE_CATEGORIES } from '../roles/config';

export const setupRolesCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('setup-roles')
    .setDescription('Set up role reaction message')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to send the role message to')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: CommandInteraction, bot: Bot) {
    const channel = interaction.options.getChannel('channel');
    
    if (!channel || !channel.isTextBased()) {
      await interaction.reply({ content: 'Please provide a valid text channel!', ephemeral: true });
      return;
    }

    try {
      const embed = new EmbedBuilder()
        .setTitle('🎭 Role Selection')
        .setDescription('React with the emojis below to get your roles!')
        .setColor(0x5865F2)
        .setTimestamp();

      // Add fields for each category
      for (const [categoryKey, categoryName] of Object.entries(ROLE_CATEGORIES)) {
        const categoryRoles = ROLES[categoryKey];
        if (!categoryRoles) continue;

        let fieldValue = '';
        for (const [emojiId, roleId] of Object.entries(categoryRoles)) {
          // Try to get the emoji from the guild
          const guild = interaction.guild;
          if (guild) {
            const emoji = guild.emojis.cache.get(emojiId);
            const role = guild.roles.cache.get(roleId);
            if (emoji && role) {
              fieldValue += `${emoji} - ${role.name}\n`;
            } else {
              fieldValue += `Emoji ID: ${emojiId} - Role ID: ${roleId}\n`;
            }
          }
        }

        if (fieldValue) {
          embed.addFields({ name: categoryName, value: fieldValue, inline: false });
        }
      }

      const message = await channel.send({ embeds: [embed] });

      // Add reactions for all configured emojis
      const guild = interaction.guild;
      if (guild) {
        for (const category of Object.values(ROLES)) {
          for (const emojiId of Object.keys(category)) {
            try {
              const emoji = guild.emojis.cache.get(emojiId);
              if (emoji) {
                await message.react(emoji);
              } else {
                console.warn(`Emoji with ID ${emojiId} not found in guild`);
              }
            } catch (error) {
              console.error(`Failed to add reaction for emoji ${emojiId}:`, error);
            }
          }
        }
      }

      await interaction.reply({ 
        content: `✅ Role reaction message created! Message ID: \`${message.id}\`\n**Important:** Add this message ID to your .env file as ROLE_MESSAGE_ID`, 
        ephemeral: true 
      });

    } catch (error) {
      console.error('Error setting up roles:', error);
      await interaction.reply({ content: 'An error occurred while setting up the role message.', ephemeral: true });
    }
  }
};