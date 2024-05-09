const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spam')
        .setDescription('Spams text!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Starts spamming text')
                .addStringOption(option =>
                    option.setName('text')
                        .setDescription('The text to spam')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('times')
                        .setDescription('Number of times to spam the text')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Stops spamming'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Deletes past spammed messages')),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'start') {
            const text = interaction.options.getString('text');
            const times = interaction.options.getInteger('times');

            if (times < 1 || times > 1000) {
                return interaction.reply({ content: 'Number of times must be between 1 and 1000', ephemeral: true });
            }

            const messages = [];
            for (let i = 0; i < times; i++) {
                const message = await interaction.channel.send(text);
                messages.push(message);
            }

            // Store the messages somewhere if needed
            interaction.reply({ content: `Spammed "${text}" ${times} times!`, ephemeral: true });
        } else if (subcommand === 'stop') {
            interaction.reply({ content: 'Stopped spamming!', ephemeral: true });
        } else if (subcommand === 'delete') {
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            const spamMessages = messages.filter(msg => msg.author.id === interaction.client.user.id);
            await interaction.channel.bulkDelete(spamMessages);
            interaction.reply({ content: 'Deleted past spammed messages!', ephemeral: true });
        }
    },
};
