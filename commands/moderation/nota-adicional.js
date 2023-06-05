const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nota-adicional')
        .setDescription('Adiciona uma nota sobre um usuário')
        .addUserOption(option => option.setName('usuário').setDescription('O usuário para adicionar uma nota').setRequired(true))
        .addStringOption(option => option.setName('nota').setDescription('A nota a ser adicionada').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_SERVER)) {
            return await interaction.reply({ content: 'Você precisa ter permissão de Gerenciar Servidor para usar esse comando.', ephemeral: true });
        }

        const usuário = interaction.options.getUser('usuário');
        const nota = interaction.options.getString('nota');

        const notasExistentes = db.get(`notas_${usuário.id}`) || [];

        notasExistentes.push(nota);

        db.set(`notas_${usuário.id}`, notasExistentes);

        const embed = new MessageEmbed()
            .setColor('#68d19e')
            .setTitle('Nota adicionada')
            .setDescription(`A nota "${nota}" foi adicionada para o usuário ${usuário.username}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
