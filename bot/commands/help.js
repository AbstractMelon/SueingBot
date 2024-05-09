const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists all available commands'),
    async execute(interaction) {
        let str
        const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
        const command = require(`./${file}`);
        str += `Name: ${command.data.name}, Description: ${command.data.description} \n`;
        }

        return interaction.reply({
        content: str,
        ephemeral: true,
        });
    },
};