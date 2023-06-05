const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('criar-webhook')
        .setDescription('Criar um webhook')
        .addChannelOption(option => option.setName('canal').setDescription('O canal para criar o webhook').setRequired(true))
        .addStringOption(option => option.setName('nome').setDescription('O nome do webhook').setRequired(true))
        .addStringOption(option => option.setName('avatar').setDescription('O avatar do webhook').setRequired(true)),
    async execute(interaction) {

        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return await interaction.reply({ content: `<@${interaction.user.id}>, You must have Administrator permission to use this command.`, ephemeral: true });
        }

        const canal = interaction.options.getChannel('canal');
        const nome = interaction.options.getString('nome');
        const avatarURL = interaction.options.getString('avatar');

        const webhook = await canal.createWebhook(nome, {
            avatar: avatarURL,
        });

        const embed = new MessageEmbed()
            .setTitle('Webhook Criado')
            .setDescription(`Um webhook com o nome "${webhook.name}" foi criado em ${canal}`)
            .setColor('#c7c7c7')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
