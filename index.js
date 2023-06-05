const { Client, Collection, MessageActionRow, MessageButton } = require('discord.js');
const { token } = require('./token.json');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const client = new Client({ intents: 3276799 });

client.commands = new Collection();
const commandFiles = getCommandFiles('./commands');

for (const file of commandFiles) {
    const command = require(`${file.path}`);
    if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`Command "${file.path}" is missing the "data" or "name" property and will not be registered.`);
    }
}

const rest = new REST({ version: '9' }).setToken(token);

async function deployCommands() {
    const commands = [];
    for (const command of client.commands.values()) {
        commands.push(command.data.toJSON());
    }

    try {
        console.log('Deployment of commands in progress...');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('The commands have been successfully deployed!');
    } catch (error) {
        console.error('An error occurred during the deployment of:', error);
    }
}

client.once('ready', () => {
    console.log(`The bot ${client.user.tag} is online ✅`);
    client.user.setStatus('online');

    deployCommands();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'An error occurred during the execution of this command.', ephemeral: true });
    }
});

function getCommandFiles(directory) {
    const commandFiles = [];

    const files = fs.readdirSync(directory);
    for (const file of files) {
        const filePath = `${directory}/${file}`;
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const subDirectoryFiles = getCommandFiles(filePath);
            commandFiles.push(...subDirectoryFiles);
        } else if (file.endsWith('.js')) {
            commandFiles.push({ path: filePath });
        }
    }

    return commandFiles;
}

client.on('guildMemberAdd', async member => {
    const welcomeMessage = `Olá, ${member.user.username}! Bem-vindo(a) ao servidor **${member.guild.name}**!`;
    const serverName = member.guild.name;

    // Verificar se o usuário permite mensagens diretas
    if (!member.user.dmChannel) {
        await member.user.createDM();
    }

    try {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel(`Enviado do servidor: ${serverName}`)
                    .setStyle('SECONDARY')
                    .setDisabled(true)
                    .setCustomId('server_button')
            );

        await member.user.send({ content: welcomeMessage, components: [row] });
        console.log(`Mensagem de boas-vindas enviada para ${member.user.tag}`);
    } catch (error) {
        console.error(`Não foi possível enviar a mensagem de boas-vindas para ${member.user.tag}: ${error}`);
    }
});

client.login(token);