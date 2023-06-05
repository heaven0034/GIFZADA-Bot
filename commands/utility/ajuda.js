const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const emojis = require('../../emojis.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ajuda')
        .setDescription('Exibe a lista de comandos'),
    execute(interaction) {
        const mainEmbed = new MessageEmbed()
            .setColor('#c7c7c7')
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
                .setColor('#c7c7c7')
                .setTitle('Comandos disponíveis 📝')
                .setDescription(`Aqui está a lista de comandos disponíveis.`)
                .addFields(
                    { name: `🌐 Todos - (3)`, value: `${emojis.dot} </ajuda:1115259724665983009> *Exibe a lista de comandos.*\n${emojis.dot} </avatar:1114997718364999801> *Obtenha o avatar de um usuário.*\n${emojis.dot} </banner:1114998253130362970> *Obtenha o banner de um usuário.*` },
                )
                .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
                .setTimestamp();

            if (interaction.member.permissions.has('MANAGE_ROLES') && interaction.member.permissions.has('MANAGE_SERVER') && interaction.member.permissions.has('MANAGE_MESSAGES')) {
                replyEmbed.addFields(
                    { name: `🔧 Moderator - (4)`, value: `${emojis.dot} </listar:1115001284190277755> *Listar todos os membros com um cargo específico.*\n${emojis.dot} </maker:1115004244030935073> *Ver as notas de um membro.*\n${emojis.dot} </nota-adicional:1115084442025857075> *Adiciona uma nota sobre um usuário.*\n${emojis.dot} </postadores:1115020428138774659> *Ver o ranking dos postadores de imagens.*` },
                );
            }

            if (interaction.member.permissions.has('ADMINISTRATOR')) {
                replyEmbed.addFields(
                    { name: `🔨 Administrador - (9)`, value: `${emojis.dot} </adicionar-usario:1115259724665983006> *Adiciona um usuário recrutado.*\n${emojis.dot} </configurar-recrutados:1115078271747510292> *Configura os canais para recrutados.*\n${emojis.dot} </criar-webhook:1115259724665983007> *Criar um webhook.*\n${emojis.dot} </recrutadores:1115076030391128067> *Exibe o ranking dos recrutadores do servidor.*\n${emojis.dot} </recrutados:1115069847391449098> *Exibe os recrutados de um membro específico.*\n${emojis.dot} </remove-recrutador:1115259724665983008> *Remove os dados de um recrutador.*\n${emojis.dot} </reset-recrutadores:1115281726973952002> *Redefine todos os dados dos recrutadores.*\n${emojis.dot} </verificar:1115081892593676289> *Verifica um usuario.*` }
                );
            }

            i.reply({ embeds: [replyEmbed] });
            collector.stop();
        });

        interaction.reply({ embeds: [mainEmbed], components: [buttonRow] });
    },
};
