const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listar')
        .setDescription('Listar todos os membros com um cargo específico')
        .addRoleOption(option => option.setName('cargo').setDescription('O cargo para filtrar os membros').setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('cargo');

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return await interaction.reply({ content: `<@${interaction.user.id}>, você não possui permissão para executar esse comando.`, ephemeral: true });
        }

        const membersWithRole = interaction.guild.members.cache.filter(member => member.roles.cache.has(role.id));

        if (membersWithRole.size === 0) {
            return await interaction.reply({ content: 'Nenhum membro encontrado com o cargo especificado.', ephemeral: true });
        }

        const embed = new MessageEmbed()
            .setTitle(`Membros com o cargo ${role.name}`)
            .setDescription(`Total de membros: **${membersWithRole.size}**`)
            .setColor('#c7c7c7')
            .setTimestamp();

        let memberList = '';

        membersWithRole.forEach(member => {
            memberList += `<@${member.user.id}>\n`;
        });

        embed.addField('Lista de Membros', memberList);

        await interaction.reply({ embeds: [embed] });
    },
};
