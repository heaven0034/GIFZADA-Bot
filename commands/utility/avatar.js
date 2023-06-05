const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Obtenha o avatar de um usuário')
        .addUserOption(option => option.setName('usuário').setDescription('O usuário para obter o avatar').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('usuário') || interaction.user;

        await user.fetch();

        const avatarEmbed = new MessageEmbed()
            .setTitle(`${user.tag}`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setColor('#c7c7c7');

        await interaction.reply({ embeds: [avatarEmbed] });
    },
};
