import { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { Bot } from '../index';
import { BotCommand } from '../types/Command';
import { AppDataSource } from '../database/database';
import { User } from '../database/entities/User';
import { Ban } from '../database/entities/Ban';

export const banCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the ban')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Ban duration in hours (0 for permanent)')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction: CommandInteraction, bot: Bot) {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const duration = interaction.options.getInteger('duration') || 0;

    if (!targetUser || !reason || !interaction.guild) {
      await interaction.reply({ content: 'Invalid parameters!', ephemeral: true });
      return;
    }

    try {
      const userRepository = AppDataSource.getRepository(User);
      const banRepository = AppDataSource.getRepository(Ban);

      // Find or create user
      let dbUser = await userRepository.findOne({ where: { discordId: targetUser.id } });
      if (!dbUser) {
        dbUser = userRepository.create({
          discordId: targetUser.id,
          username: targetUser.username,
        });
        await userRepository.save(dbUser);
      }

      // Ban from Discord
      await interaction.guild.members.ban(targetUser.id, { reason });

      // Create ban record
      const expiresAt = duration > 0 ? new Date(Date.now() + duration * 60 * 60 * 1000) : null;
      const ban = banRepository.create({
        reason,
        moderatorId: interaction.user.id,
        guildId: interaction.guildId!,
        expiresAt,
        user: dbUser,
      });

      await banRepository.save(ban);

      const durationText = duration > 0 ? ` for ${duration} hours` : ' permanently';
      await interaction.reply({
        content: `🔨 ${targetUser.username} has been banned${durationText} for: ${reason}`,
        ephemeral: true
      });

    } catch (error) {
      console.error('Error executing ban command:', error);
      await interaction.reply({ content: 'An error occurred while banning the user.', ephemeral: true });
    }
  }
};