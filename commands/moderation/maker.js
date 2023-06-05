const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const db = require('quick.db');

const notaAdicionalCommand = require('./nota-adicional');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('maker')
    .setDescription('Ver as notas de um membro')
    .addUserOption(option => option.setName('membro').setDescription('O membro para ver as notas').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_SERVER)) {
      const userMention = `<@${interaction.user.id}>`;
      const errorMessage = `${userMention}, você precisa ter permissão de Gerenciar Servidor para usar este comando.`;
      return await interaction.reply({ content: errorMessage, ephemeral: true });
    }

    const member = interaction.options.getMember('membro');
    const existingNotes = db.get(`notes_${member.id}`) || [];
    const additionalNotes = getAdditionalNotes(member);
    const notes = existingNotes.concat(additionalNotes);

    if (notes.length === 0) {
      const noNotesEmbed = new MessageEmbed()
        .setTitle('Notas do Membro')
        .setDescription(`Não foram encontradas notas para o membro ${member}`)
        .setColor('#c7c7c7')
        .setTimestamp();

      return await interaction.reply({ embeds: [noNotesEmbed] });
    }

    const maxNotesPerPage = 1;
    const maxPages = Math.ceil(notes.length / maxNotesPerPage);
    let currentPage = 1;
    let noteIndex = (currentPage - 1) * maxNotesPerPage;
    let note = notes.slice(noteIndex, noteIndex + maxNotesPerPage).join('\n'); // Converter o array de notas em uma string separada por quebras de linha

    const embed = new MessageEmbed()
      .setTitle(`Notas do Membro ${member.displayName}`)
      .setDescription(`Página ${currentPage} de ${maxPages}`)
      .addField('Nota:', note, false)
      .setColor('#c7c7c7')
      .setTimestamp();

    const previousButton = new MessageButton()
      .setCustomId('previous')
      .setLabel('◀')
      .setStyle('SUCCESS')
      .setDisabled(currentPage === 1);

    const nextButton = new MessageButton()
      .setCustomId('next')
      .setLabel('▶')
      .setStyle('SUCCESS')
      .setDisabled(currentPage === maxPages);

    const homeButton = new MessageButton()
      .setCustomId('home')
      .setLabel('🏠')
      .setStyle('SUCCESS')
      .setDisabled(currentPage === 1);

    const buttonRow = new MessageActionRow().addComponents(previousButton, nextButton, homeButton);

    const message = await interaction.reply({ embeds: [embed], components: [buttonRow], fetchReply: true });
    const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

    collector.on('collect', async interaction => {
      if (interaction.user.id !== interaction.guild.me.id) {
        interaction.deferUpdate();
        if (interaction.customId === 'previous') {
          await showPreviousNote();
        } else if (interaction.customId === 'next') {
          await showNextNote();
        } else if (interaction.customId === 'home') {
          await showFirstNote();
        }
      }
    });

    collector.on('end', async () => {
      previousButton.setDisabled(true);
      nextButton.setDisabled(true);
      homeButton.setDisabled(currentPage === 1); // Modifier l'état du bouton "Home" à la fin de la pagination

      await message.edit({ components: [buttonRow] });
    });

    async function showFirstNote() {
      currentPage = 1;
      noteIndex = (currentPage - 1) * maxNotesPerPage;
      note = notes.slice(noteIndex, noteIndex + maxNotesPerPage).join('\n');

      embed.spliceFields(0, embed.fields.length);
      embed.addField('Nota:', note, false);
      embed.setDescription(`Página ${currentPage} de ${maxPages}`);

      previousButton.setDisabled(currentPage === 1);
      nextButton.setDisabled(currentPage === maxPages);
      homeButton.setDisabled(currentPage === 1); // Désactiver le bouton "Home" sur la première page

      await interaction.editReply({ embeds: [embed], components: [buttonRow] });
    }

    async function showPreviousNote() {
      currentPage--;
      noteIndex -= maxNotesPerPage;
      note = notes.slice(noteIndex, noteIndex + maxNotesPerPage).join('\n');

      embed.spliceFields(0, embed.fields.length);
      embed.addField('Nota:', note, false);
      embed.setDescription(`Página ${currentPage} de ${maxPages}`);

      previousButton.setDisabled(currentPage === 1);
      nextButton.setDisabled(currentPage === maxPages);
      homeButton.setDisabled(currentPage === 1); // Désactiver le bouton "Home" sur la première page

      await interaction.editReply({ embeds: [embed], components: [buttonRow] });
    }

    async function showNextNote() {
      currentPage++;
      noteIndex += maxNotesPerPage;
      note = notes.slice(noteIndex, noteIndex + maxNotesPerPage).join('\n');

      embed.spliceFields(0, embed.fields.length);
      embed.addField('Nota:', note, false);
      embed.setDescription(`Página ${currentPage} de ${maxPages}`);

      previousButton.setDisabled(currentPage === 1);
      nextButton.setDisabled(currentPage === maxPages);
      homeButton.setDisabled(currentPage === 1); // Désactiver le bouton "Home" sur la première page

      await interaction.editReply({ embeds: [embed], components: [buttonRow] });
    }
  },
};

function getAdditionalNotes(member) {
  const notes = db.get(`notas_${member.id}`) || [];
  return notes;
}