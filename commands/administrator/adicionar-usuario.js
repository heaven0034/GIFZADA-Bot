const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adicionar-usuario')
    .setDescription('Adiciona um usuário recrutado')
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Usuário recrutado')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      const errorMessage = 'Você precisa ter permissão de administrador para usar este comando.';
      return await interaction.reply({ content: errorMessage, ephemeral: true });
    }

    const recruiterId = interaction.user.id;
    const userId = interaction.options.getUser('usuário').id;

    let recruits = db.get(`recruits_${recruiterId}`) || [];

    if (!recruits.includes(userId)) {
      recruits.push(userId);
      db.set(`recruits_${recruiterId}`, recruits);
    }

    const embed = new MessageEmbed()
      .setTitle('Usuário adicionado')
      .setDescription(`O usuário <@${userId}> foi adicionado como recruta.`)
      .setColor('#c7c7c7')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
