const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const db = require('quick.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('recrutadores')
    .setDescription('Exibe o ranking dos recrutadores do servidor'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      const errorMessage = 'Você precisa ter permissão de "Administrador" para usar este comando.';
      return await interaction.reply({ content: errorMessage, ephemeral: true });
    }

    const recrutadores = db.all()
      .filter(entry => entry.ID.startsWith('recrutados_'))
      .map(entry => ({ id: entry.ID.replace('recrutados_', ''), count: entry.data.length }))
      .sort((a, b) => b.count - a.count);

    if (recrutadores.length === 0) {
      const embed = new MessageEmbed()
        .setTitle('Ranking dos Recrutadores')
        .setDescription('Nenhum recrutador encontrado.')
        .setColor('#c7c7c7');

      await interaction.reply({ embeds: [embed] });
    } else {
      const rankList = recrutadores
        .map((recrutador, index) => `${index + 1}. <@${recrutador.id}> - ${recrutador.count} recrutados`)
        .join('\n');

      const embed = new MessageEmbed()
        .setTitle('Ranking dos Recrutadores')
        .setDescription(rankList)
        .setColor('#c7c7c7');

      await interaction.reply({ embeds: [embed] });
    }
  },
};
