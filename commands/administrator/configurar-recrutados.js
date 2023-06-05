const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('configurar-recrutados')
    .setDescription('Configure les canaux pour les recrutés')
    .addChannelOption(option =>
      option.setName('canais')
        .setDescription('Les canaux où les recrutés peuvent envoyer des messages')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      const errorMessage = 'Vous devez avoir la permission d\'administrateur pour utiliser cette commande.';
      return await interaction.reply({ content: errorMessage, ephemeral: true });
    }

    const canais = interaction.options.get('canais').channelValues.map(channel => channel.id);
    const guildId = interaction.guild.id;

    db.set(`canaisRecrutados_${guildId}`, canais);

    const mencaoCanais = canais.map(channel => `<#${channel}>`).join(', ');

    const embed = new MessageEmbed()
      .setTitle('Configuration des recrutés')
      .setDescription(`Les canaux pour les recrutés ont été configurés avec succès : ${mencaoCanais}`)
      .setColor('#c7c7c7')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
