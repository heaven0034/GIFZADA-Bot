const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetuser')
    .setDescription('Redefine os posts e entregas de um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário para redefinir os posts e entregas')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      const errorMessage = 'Você precisa ter permissões de administrador para usar este comando.';
      return await interaction.reply({ content: errorMessage, ephemeral: true });
    }

    const userId = interaction.options.getUser('usuario').id;

    db.delete(`posts_${userId}`);
    db.delete(`entregas_${userId}`);

    const embed = new MessageEmbed()
      .setTitle('Posts Redefinidos')
      .setDescription(`Os posts do usuário <@${userId}> foram redefinidos com sucesso.`)
      .setColor('#c7c7c7')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
