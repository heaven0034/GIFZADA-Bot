const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const emojis = require('../../emojis.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ajuda')
        .setDescription('✅ Exibe a lista de comandos'),
    execute(interaction) {
        const mainEmbed = new MessageEmbed()
            .setColor('#68d19e')
            .setDescription(`Clique no botão de sua escolha para exibir a página de ajuda correspondente.`)
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        const helpButton = new MessageButton()
            .setCustomId('helpButton')
            .setLabel('Ajuda completa')
            .setStyle('SUCCESS');

        const paginationButton = new MessageButton()
            .setCustomId('paginationButton')
            .setLabel('Ajuda paginada (Em breve)')
            .setDisabled(true)
            .setStyle('DANGER');

        const buttonRow = new MessageActionRow().addComponents(helpButton, paginationButton);

        const interactionFilter = (i) => i.customId === 'helpButton';

        const collector = interaction.channel.createMessageComponentCollector({ interactionFilter, time: 15000 });

        collector.on('collect', (i) => {
            const replyEmbed = new MessageEmbed()
                .setColor('#68d19e')
                .setTitle('Comandos disponíveis 📝')
                .setDescription(`Aqui está a lista de comandos disponíveis.`)
                .addFields(
                    { name: `🌐 Todos - (4)`, value: `${emojis.dot} </help:1114881414299668531> *Exibe a lista de comandos.*\n${emojis.dot} </invite:1114883740074774589> *Cria um convite para o servidor.*\n${emojis.dot} </payment:1114883740074774592> *Exibe opções de pagamento.*\n${emojis.dot} </suggest:1114883740074774594> *Envia uma sugestão para melhoria.*\n${emojis.dot} </verify:1114883740074774595> *Verifique-se.*` },
                )
                .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
                .setTimestamp();

            if (interaction.member.permissions.has('MANAGE_ROLES') && interaction.member.permissions.has('MANAGE_SERVER') && interaction.member.permissions.has('MANAGE_MESSAGES')) {
                replyEmbed.addFields(
                    { name: `⭐ Cliente - (1)`, value: `${emojis.dot} </vouch:1114910378829299782> *Dê sua opinião sobre o serviço que você adquiriu.*` },
                );
            }

            if (interaction.member.permissions.has('ADMINISTRATOR')) {
                replyEmbed.addFields(
                    { name: `🔨 Administrador - (2)`, value: `${emojis.dot} </mass-role:1114883740074774590> *Adicionar ou remover um cargo de todos os usuários.*\n${emojis.dot} </nuke:1114883740074774591> *Destruir um canal.*` }
                );
            }

            i.reply({ embeds: [replyEmbed] });
            collector.stop();
        });

        interaction.reply({ embeds: [mainEmbed], components: [buttonRow] });
    },
};
