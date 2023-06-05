const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-recrutador')
    .setDescription('Remove os dados de um recrutador')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário cujos dados devem ser removidos')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      const errorMessage = 'Você precisa ter permissão de "Administrador" para usar este comando.';
      return await interaction.reply({ content: errorMessage, ephemeral: true });
    }

    const usuarioId = interaction.options.getUser('usuario').id;

    db.delete(`recrutados_${usuarioId}`);

    const embed = new MessageEmbed()
      .setTitle('Dados do Recrutador Removidos')
      .setDescription(`Os dados do recrutador <@${usuarioId}> foram removidos com sucesso.`)
      .setColor('#c7c7c7')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
