const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = (client) => {
    const commandFiles = fs.readdirSync(__dirname).filter(file => file !== 'index.js' && file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./${file}`);
        if (command.data instanceof SlashCommandBuilder) {
            client.commands.set(command.data.name, command);
        } else if (command.data instanceof Array) {
            command.data.forEach(subcommand => client.commands.set(subcommand.name, command));
        }
    }
};
