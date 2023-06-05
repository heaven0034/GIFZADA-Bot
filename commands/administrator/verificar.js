const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verificar')
    .setDescription('Verifica um membro')
    .addUserOption(option =>
      option.setName('membro')
        .setDescription('Membro para verificar')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName('cargo')
        .setDescription('Cargo a ser atribuído ao membro verificado')
        .setRequired(false)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      const errorMessage = 'Você deve ter a permissão de Administrador para usar este comando.';
      return await interaction.reply({ content: errorMessage, ephemeral: true });
    }

    const memberId = interaction.options.getUser('membro').id;
    const member = await interaction.guild.members.fetch(memberId);

    const roleOption = interaction.options.getRole('cargo');
    if (roleOption) {
      const roleId = roleOption.id;
      const role = interaction.guild.roles.cache.get(roleId);
      if (!role) {
        const errorMessage = 'O cargo fornecido é inválido.';
        return await interaction.reply({ content: errorMessage, ephemeral: true });
      }
      await member.roles.add(roleId);
    }

    const embed = new MessageEmbed()
      .setTitle('Verificação de Membro')
      .setDescription(`Membro verificado: ${member}`)
      .setColor('#c7c7c7')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
