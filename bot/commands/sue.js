// commands/sue.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

const userList = ['@user1', '@user2', '@user3']; // List of users for suing

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sue')
        .setDescription('Start or stop a suing process')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start suing')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Stop suing')
        ),
    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        }

        if (interaction.options.getSubcommand() === 'start') {
            await startSuing(interaction);
        } else if (interaction.options.getSubcommand() === 'stop') {
            await stopSuing(interaction);
        }
    },
};

async function startSuing(interaction) {
    const user = await getUser(interaction);

    await interaction.reply(`Welcome, Who do you want to sue today?`);

    if (!user) {
        return interaction.reply({ content: 'Invalid user!', ephemeral: true });
    }

    const reason = await getReason(interaction);

    if (!reason) {
        return interaction.reply({ content: 'Invalid reason!', ephemeral: true });
    }

    // Validate the reason against the list of valid reasons
    const validReasons = ['Harassment', 'Murder', 'Doxxing', 'Robbery', 'Theft', 'No reason'];
    if (!validReasons.includes(reason)) {
        return interaction.reply({ content: 'Invalid reason! Please choose from the list of valid reasons.', ephemeral: true });
    }

    // Notify everyone to join a specific voice channel
    await interaction.followUp('@everyone JOIN SUEING VC!');

    // Assign roles to users: Judge, Victim, Defendant, and Lawyer
    const judge = await askForUser(interaction, 'Who is the judge in this case?');
    const victim = await askForUser(interaction, 'Who is the victim in this case?');
    const defendant = await askForUser(interaction, 'Who is the defendant in this case?');
    const lawyer = await askForUser(interaction, 'Who is the lawyer in this case?');

    // Commence the suing process
    await interaction.followUp(`Suing ${user} for ${reason}!`);
}

async function askForUser(interaction, message) {
    await interaction.followUp(message);
    const filter = m => m.author.id === interaction.user.id;
    const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
    const user = collected.first().mentions.users.first();
    return user;
}

async function stopSuing(interaction) {
    await interaction.reply('Thanks for suing today! Hope you sue again soon!');
}

async function getUser(interaction) {
    return userList[Math.floor(Math.random() * userList.length)];
}

async function getReason(interaction) {
    const validReasons = ['Harassment', 'Murder', 'Doxxing', 'Robbery', 'Theft', 'No reason'];
    return 'reason';
}
