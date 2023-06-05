const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetrecrutadores')
    .setDescription('Redefine todos os dados dos recrutadores'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      const errorMessage = 'Você precisa ter permissões de administrador para usar este comando.';
      return await interaction.reply({ content: errorMessage, ephemeral: true });
    }

    db.delete('recrutados');

    const embed = new MessageEmbed()
      .setTitle('Dados dos Recrutadores Redefinidos')
      .setDescription('Todos os dados dos recrutadores foram redefinidos com sucesso.')
      .setColor('#c7c7c7')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
