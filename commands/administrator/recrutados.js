const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('recrutados')
    .setDescription('Exibe os recrutados de um membro específico')
    .addUserOption(option =>
      option.setName('membro')
        .setDescription('Membro para exibir os recrutados')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      const errorMessage = 'Você precisa ter permissão de administrador para usar este comando.';
      return await interaction.reply({ content: errorMessage, ephemeral: true });
    }

    const memberId = interaction.options.getUser('membro').id;
    const recruits = db.get(`recruits_${memberId}`) || [];

    if (recruits.length === 0) {
      const embed = new MessageEmbed()
        .setTitle('Recrutados')
        .setDescription('Nenhum recrutado encontrado para o membro especificado.')
        .setColor('#c7c7c7')
        .setTimestamp();

      return await interaction.reply({ embeds: [embed] });
    }

    const recruitsList = recruits.map(recruit => `<@${recruit}>`).join('\n');

    const embed = new MessageEmbed()
      .setTitle('Recrutados')
      .setDescription(`Recrutados do membro <@${memberId}>:\n${recruitsList}`)
      .setColor('#c7c7c7')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
