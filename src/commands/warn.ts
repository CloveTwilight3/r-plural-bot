import { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { Bot } from '../index';
import { BotCommand } from '../types/Command';
import { AppDataSource } from '../database/database';
import { User } from '../database/entities/User';
import { Warn } from '../database/entities/Warn';

export const warnCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to warn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the warning')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction: CommandInteraction, bot: Bot) {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    if (!targetUser || !reason) {
      await interaction.reply({ content: 'Invalid user or reason!', ephemeral: true });
      return;
    }

    try {
      const userRepository = AppDataSource.getRepository(User);
      const warnRepository = AppDataSource.getRepository(Warn);

      // Find or create user
      let dbUser = await userRepository.findOne({ where: { discordId: targetUser.id } });
      if (!dbUser) {
        dbUser = userRepository.create({
          discordId: targetUser.id,
          username: targetUser.username,
        });
        await userRepository.save(dbUser);
      }

      // Create warn
      const warn = warnRepository.create({
        reason,
        moderatorId: interaction.user.id,
        guildId: interaction.guildId!,
        user: dbUser,
      });

      await warnRepository.save(warn);

      // Update user warn count
      dbUser.warnCount += 1;
      await userRepository.save(dbUser);

      await interaction.reply({
        content: `⚠️ ${targetUser.username} has been warned for: ${reason}\nTotal warnings: ${dbUser.warnCount}`,
        ephemeral: true
      });

    } catch (error) {
      console.error('Error executing warn command:', error);
      await interaction.reply({ content: 'An error occurred while warning the user.', ephemeral: true });
    }
  }
};