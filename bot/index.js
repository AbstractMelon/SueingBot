const { Client, Events, GatewayIntentBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const { token, clientId, guildId } = require('./config');
// const { log, error, warn, debug } = require('./utils/helpers');

console.log("Bot starting...");
const reset = "\x1b[0m";


module.exports.bot = () => {
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

    // console.log("Timestamp Loading started!");

    const log = (message) => {
        console.log("\x1b[32m"+`[Bot : Main] [ ${new Date().toLocaleString()} ] ${message}`+ reset);
    };
    
    const LogError = (message) => {
        console.log("\x1b[31m"+`[Bot : Error] [ ${new Date().toLocaleString()} ] ${message}` + reset);
    };
    
    const LogWarn = (message) => {
        console.log("\x1b[33m"+`[Bot : Warn] [ ${new Date().toLocaleString()} ] ${message}` + reset );
    };
    
    const LogDebug = (message) => {
        console.log(`[Bot : Debug] [ ${new Date().toLocaleString()} ] ${message}`);
    };

    log("Log Test")
    LogWarn("Log Warn")
    LogError("Log Error")
    // LogDebug("Log Debug")
    
    const logCommandLoading = (message) => {
        console.log(`[Command Loading] ${message}`);
    };
    
    // Register slash commands 
    log("Command loading started");
    const commands = [];
    const commandFiles = fs.readdirSync(path.resolve("./bot/commands/")).filter(e => e.endsWith(".js"));
    
    commandFiles.forEach((file) => {
        const command = require(path.resolve("./bot/commands/", file));
        commands.push(command);
        // logCommandLoading(`Registered command: ${command.name}`);
    });
    
    log(`Registered ${commands.length} commands`);
    
    const commandBodies = commands.map(command => command.data);
    
    const rest = new REST({ version: '9' }).setToken(token);
    
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandBodies })
        .then(() => log('Successfully registered application commands.'))
        .catch(error => {
            console.error('Failed to register application commands:', error);
        });
    

    client.on("interactionCreate", async (interaction) => {
        try {
            if (interaction.isCommand()) {
                const command = commands.find(cmd => cmd.data.name === interaction.commandName);
                if (command) {
                    await command.execute(interaction, client);
                    log(`Executed command: ${command.data.name}`);
                }
            }
        } catch (error) {
            console.error('Error executing command:', error);
            log('Error executing command');
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    });

    client.once(Events.ClientReady, readyClient => {
        log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    client.on(Events.Error, error => {
        console.error('Client error:', error);
        log('Client error');
    });

    client.on(Events.Warning, warning => {
        console.warn('Client warning:', warning);
        log('Client warning');
    });

    client.login(token);

    return { client };
};