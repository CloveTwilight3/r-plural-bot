import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { Bot } from '../index';
import { BotCommand } from '../types/Command';

const RULES = [
  "Be respectful to all members",
  "No harassment, discrimination, or hate speech",
  "Keep discussions relevant to plurality",
  "No NSFW content in public channels",
  "Listen to moderators and follow their instructions",
  "Use appropriate channels for different topics",
  "No spam or excessive self-promotion",
  "Respect privacy - don't share personal information without consent"
];

export const rulesCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Display server rules'),

  async execute(interaction: CommandInteraction, bot: Bot) {
    const embed = new EmbedBuilder()
      .setTitle('📋 Server Rules')
      .setDescription('Please follow these rules to maintain a safe and welcoming community:')
      .setColor(0x5865F2)
      .setTimestamp();

    RULES.forEach((rule, index) => {
      embed.addFields({ name: `${index + 1}.`, value: rule, inline: false });
    });

    embed.setFooter({ text: 'Thank you for helping keep our community safe!' });

    await interaction.reply({ embeds: [embed] });
  }
};