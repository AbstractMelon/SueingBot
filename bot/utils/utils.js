// utils.js
const fs = require('fs');
const { Collection } = require('discord.js');

module.exports = {
    registerCommands(client, commandsPath) {
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`${commandsPath}/${file}`);
            client.commands.set(command.data.name, command);
        }
    },

    registerEvents(client, eventsPath) {
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`${eventsPath}/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    },
};
