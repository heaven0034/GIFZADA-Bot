const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('postadores')
        .setDescription('Ver o ranking dos postadores de imagens'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            const userMention = `<@${interaction.user.id}>`;
            const errorMessage = `${userMention}, você precisa ter permissão de "Gerenciar mensagens" para usar este comando.`;
            return await interaction.reply({ content: errorMessage, ephemeral: true });
        }

        const postadores = db.all()
            .filter(data => data.ID.startsWith('postador_'))
            .map(data => ({ userID: data.ID.split('_')[1], count: countImages(data.data) }));

        if (postadores.length === 0) {
            const noPostadoresEmbed = new MessageEmbed()
                .setTitle('Ranking de Postadores de Imagens')
                .setDescription('Nenhum dado de postador encontrado.')
                .setColor('#c7c7c7')
                .setTimestamp();

            return await interaction.reply({ embeds: [noPostadoresEmbed] });
        }

        postadores.sort((a, b) => b.count - a.count);

        const postadoresEmbed = new MessageEmbed()
            .setTitle('Ranking de Postadores de Imagens')
            .setColor('#c7c7c7')
            .setTimestamp();

        postadores.forEach((postador, index) => {
            const user = interaction.guild.members.cache.get(postador.userID);

            if (user) {
                postadoresEmbed.addField(`#${index + 1} - ${user.user.tag}`, `Imagens postadas: ${postador.count}`);
            } else {
                postadoresEmbed.addField(`#${index + 1} - Usuário desconhecido`, `ID: ${postador.userID} | Imagens postadas: ${postador.count}`);
            }
        });

        await interaction.reply({ embeds: [postadoresEmbed] });
    },
};

function countImages(messages) {
    let count = 0;
    messages.forEach(message => {
        if (message.type === 'IMAGE') {
            count++;
        }
    });
    return count;
}
