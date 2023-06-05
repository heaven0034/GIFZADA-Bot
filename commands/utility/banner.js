const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Obtenha o banner de um usuário')
        .addUserOption(option => option.setName('usuário').setDescription('O usuário para obter o banner').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('usuário') || interaction.user;

        await user.fetch();

        const bannerEmbed = new MessageEmbed()
            .setTitle(`${user.tag}`)
            .setImage(user.bannerURL({ dynamic: true, size: 4096 }))
            .setColor('#c7c7c7');

        await interaction.reply({ embeds: [bannerEmbed] });
    },
};
